import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure,publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Prayer routers
  prayers: router({
    list: publicProcedure
      .input(z.object({
        churchId: z.number().optional(),
        status: z.enum(["active", "answered", "archived"]).optional(),
        category: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        const { getPrayers } = await import("./db");
        
        // Get approved prayers only (content moderation)
        let prayers = await getPrayers({
          churchId: input?.churchId,
          status: input?.status,
          isPublic: true,
          moderationStatus: "approved",
          limit: input?.limit ?? 50,
          offset: input?.offset ?? 0,
        });
        
        // Filter by category if specified
        if (input?.category) {
          prayers = prayers.filter(p => 
            p.categories?.split(", ").some(cat => cat.trim() === input.category)
          );
        }
        
        return prayers;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getPrayerById } = await import("./db");
        return getPrayerById(input.id);
      }),

    create: publicProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        churchId: z.number().optional(),
        isAnonymous: z.boolean().default(false),
        anonymousName: z.string().max(100).optional(),
        visibilityScope: z.enum(["community", "church_only", "nearby_churches"]).default("community"),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createPrayer } = await import("./db");
        const { moderatePrayerContent, categorizePrayer } = await import("./ai");
        
        // AI moderation
        const moderation = await moderatePrayerContent(input.title, input.content);
        
        // AI categorization
        const categorization = await categorizePrayer(input.title, input.content);
        
        // Determine moderation status
        let moderationStatus: "pending" | "approved" | "flagged" | "rejected";
        if (!moderation.isSafe) {
          moderationStatus = "rejected";
        } else if (moderation.requiresReview) {
          moderationStatus = "flagged";
        } else {
          moderationStatus = "approved";
        }
        
        const prayerData = {
          title: input.title,
          content: input.content,
          churchId: input.churchId,
          userId: ctx.user?.id,
          isAnonymous: input.isAnonymous ? 1 : 0,
          anonymousName: input.anonymousName,
          isPublic: 1,
          visibilityScope: input.visibilityScope,
          status: "active" as const,
          categories: categorization.categories.join(", "),
          urgency: categorization.urgency,
          moderationStatus,
          moderationConcerns: moderation.concerns.length > 0 ? JSON.stringify(moderation.concerns) : null,
        };
        
        return createPrayer(prayerData);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["active", "answered", "archived"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getPrayerById, updatePrayerStatus } = await import("./db");
        
        const prayer = await getPrayerById(input.id);
        if (!prayer) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Prayer not found" });
        }
        
        // Only the prayer creator or admin can update status
        if (prayer.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        
        return updatePrayerStatus(input.id, input.status);
      }),
  }),

  // Church routers
  churches: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        const { getChurches } = await import("./db");
        // Only show approved churches to public
        return getChurches({
          status: input?.status ?? "approved",
          limit: input?.limit,
          offset: input?.offset,
        });
      }),

    listPending: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Only admins can see pending churches
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        
        const { getChurches } = await import("./db");
        return getChurches({
          status: "pending",
          limit: input?.limit,
          offset: input?.offset,
        });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getChurchById } = await import("./db");
        return getChurchById(input.id);
      }),

    submit: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        address: z.string().optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(50).optional(),
        country: z.string().max(100).optional(),
        zipCode: z.string().max(20).optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().max(50).optional(),
        website: z.string().url().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createChurch } = await import("./db");
        
        const churchData = {
          ...input,
          submittedBy: ctx.user.id,
          status: "pending" as const,
        };
        
        return createChurch(churchData);
      }),

    review: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
        reviewNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admins can review churches
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        
        const { updateChurchStatus } = await import("./db");
        return updateChurchStatus(
          input.id,
          input.status,
          ctx.user.id,
          input.reviewNotes
        );
      }),
  }),

  // Prayer responses
  prayerResponses: router({
    list: publicProcedure
      .input(z.object({ prayerId: z.number() }))
      .query(async ({ input }) => {
        const { getPrayerResponses } = await import("./db");
        return getPrayerResponses(input.prayerId);
      }),

    create: protectedProcedure
      .input(z.object({
        prayerId: z.number(),
        content: z.string().min(1),
        isAnswer: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createPrayerResponse, getPrayerById, updatePrayerStatus } = await import("./db");
        
        const prayer = await getPrayerById(input.prayerId);
        if (!prayer) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Prayer not found" });
        }
        
        const responseData = {
          prayerId: input.prayerId,
          userId: ctx.user.id,
          content: input.content,
          isAnswer: input.isAnswer ? 1 : 0,
        };
        
        const result = await createPrayerResponse(responseData);
        
        // If this is marked as an answer, update prayer status
        if (input.isAnswer) {
          await updatePrayerStatus(input.prayerId, "answered");
        }
        
        return result;
      }),
  }),

  // AI-powered features
  ai: router({
    // Semantic search for prayers
    searchPrayers: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      }))
      .query(async ({ input }) => {
        const { getPrayers } = await import("./db");
        const { semanticSearchPrayers } = await import("./ai");
        
        // Get all approved prayers
        const allPrayers = await getPrayers({ isPublic: true, moderationStatus: "approved" });
        
        // Use AI to find relevant prayers
        const relevantIds = await semanticSearchPrayers(
          input.query,
          allPrayers.map(p => ({ id: p.id, title: p.title, content: p.content }))
        );
        
        // Return prayers in order of relevance
        const results = relevantIds
          .slice(0, input.limit)
          .map(id => allPrayers.find(p => p.id === id))
          .filter(Boolean);
        
        return results;
      }),

    // Get church insights from prayer data
    getChurchInsights: protectedProcedure
      .input(z.object({
        churchId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        const { getPrayers, getChurchById } = await import("./db");
        const { generateChurchInsights } = await import("./ai");
        
        // Verify user has access to this church
        const church = await getChurchById(input.churchId);
        if (!church) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Church not found" });
        }
        
        // Only admins or church members can view insights
        if (ctx.user.role !== "admin") {
          // For now, allow any authenticated user - you can add church membership checks later
        }
        
        // Get prayers from the last 30 days for this church
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const prayers = await getPrayers({
          churchId: input.churchId,
          isPublic: true,
          moderationStatus: "approved",
        });
        
        // Filter to last 30 days
        const recentPrayers = prayers.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
        
        if (recentPrayers.length === 0) {
          return {
            topThemes: [],
            trends: [],
            summary: "Not enough prayer data to generate insights. Encourage your community to share more prayer requests.",
            ministrySuggestions: [],
            prayerCount: 0,
          };
        }
        
        const insights = await generateChurchInsights(recentPrayers);
        
        return {
          ...insights,
          prayerCount: recentPrayers.length,
        };
      }),

    // Get available prayer categories
    getCategories: publicProcedure
      .query(async () => {
        const { getPrayers } = await import("./db");
        
        const prayers = await getPrayers({ isPublic: true, moderationStatus: "approved" });
        
        // Extract unique categories
        const categoriesSet = new Set<string>();
        prayers.forEach(p => {
          if (p.categories) {
            p.categories.split(", ").forEach(cat => categoriesSet.add(cat.trim()));
          }
        });
        
        return Array.from(categoriesSet).sort();
      }),

    // Filter prayers by category
    filterByCategory: publicProcedure
      .input(z.object({
        category: z.string(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const { getPrayers } = await import("./db");
        
        const allPrayers = await getPrayers({ isPublic: true, moderationStatus: "approved" });
        
        // Filter by category
        const filtered = allPrayers.filter(p => 
          p.categories?.split(", ").some(cat => cat.trim() === input.category)
        );
        
        return filtered.slice(input.offset, input.offset + input.limit);
      }),
  }),

  // Church members router
  churchMembers: router({
    // Join a church
    join: protectedProcedure
      .input(z.object({
        churchId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createChurchMember, getUserChurches } = await import("./db");
        
        // Check if already a member
        const existing = await getUserChurches(ctx.user.id);
        const alreadyMember = existing.some(m => m.churchId === input.churchId);
        
        if (alreadyMember) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Already a member of this church" });
        }
        
        await createChurchMember({
          churchId: input.churchId,
          userId: ctx.user.id,
          role: "member",
          status: "pending",
        });
        
        return { success: true };
      }),

    // Get church members (church admins only)
    list: protectedProcedure
      .input(z.object({
        churchId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const { getChurchMembers, isChurchAdmin } = await import("./db");
        
        // Check if user is church admin
        const isAdmin = await isChurchAdmin(ctx.user.id, input.churchId);
        if (!isAdmin && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only church admins can view members" });
        }
        
        return await getChurchMembers(input.churchId);
      }),

    // Verify a church member (church admins only)
    verify: protectedProcedure
      .input(z.object({
        memberId: z.number(),
        churchId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { verifyChurchMember, isChurchAdmin } = await import("./db");
        
        // Check if user is church admin
        const isAdmin = await isChurchAdmin(ctx.user.id, input.churchId);
        if (!isAdmin && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only church admins can verify members" });
        }
        
        await verifyChurchMember(input.memberId, ctx.user.id);
        return { success: true };
      }),

    // Get user's churches
    myChurches: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserChurches } = await import("./db");
        return await getUserChurches(ctx.user.id);
      }),
  }),

  // Prayer groups router
  prayerGroups: router({
    // Create a prayer group (church members only)
    create: protectedProcedure
      .input(z.object({
        churchId: z.number(),
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        isPublic: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createPrayerGroup, isChurchMember } = await import("./db");
        
        // Check if user is a church member
        const isMember = await isChurchMember(ctx.user.id, input.churchId);
        if (!isMember && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only church members can create groups" });
        }
        
        await createPrayerGroup({
          churchId: input.churchId,
          name: input.name,
          description: input.description,
          isPublic: input.isPublic ? 1 : 0,
          createdBy: ctx.user.id,
        });
        
        return { success: true };
      }),

    // List prayer groups for a church
    list: publicProcedure
      .input(z.object({
        churchId: z.number(),
      }))
      .query(async ({ input }) => {
        const { getPrayerGroups } = await import("./db");
        return await getPrayerGroups(input.churchId);
      }),

    // Get a specific prayer group
    get: publicProcedure
      .input(z.object({
        groupId: z.number(),
      }))
      .query(async ({ input }) => {
        const { getPrayerGroupById } = await import("./db");
        const group = await getPrayerGroupById(input.groupId);
        if (!group) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Prayer group not found" });
        }
        return group;
      }),

    // Join a prayer group
    join: protectedProcedure
      .input(z.object({
        groupId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { addGroupMember, getPrayerGroupById, isChurchMember } = await import("./db");
        
        // Get group to check church
        const group = await getPrayerGroupById(input.groupId);
        if (!group) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Prayer group not found" });
        }
        
        // Check if user is a church member
        const isMember = await isChurchMember(ctx.user.id, group.churchId);
        if (!isMember && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only church members can join groups" });
        }
        
        await addGroupMember({
          groupId: input.groupId,
          userId: ctx.user.id,
          role: "member",
        });
        
        return { success: true };
      }),

    // Get group members
    members: publicProcedure
      .input(z.object({
        groupId: z.number(),
      }))
      .query(async ({ input }) => {
        const { getGroupMembers } = await import("./db");
        return await getGroupMembers(input.groupId);
      }),

    // Get user's groups
    myGroups: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserGroups } = await import("./db");
        return await getUserGroups(ctx.user.id);
      }),
  }),

  // Email preferences router
  emailPreferences: router({
    // Get user's email preferences
    get: protectedProcedure
      .query(async ({ ctx }) => {
        const { getEmailPreferences } = await import("./db");
        const prefs = await getEmailPreferences(ctx.user.id);
        
        // Return defaults if not set
        if (!prefs) {
          return {
            weeklyDigest: 1,
            dailyDigest: 0,
            newPrayers: 1,
            prayerUpdates: 1,
            answeredPrayers: 1,
          };
        }
        
        return prefs;
      }),

    // Update email preferences
    update: protectedProcedure
      .input(z.object({
        weeklyDigest: z.boolean().optional(),
        dailyDigest: z.boolean().optional(),
        newPrayers: z.boolean().optional(),
        prayerUpdates: z.boolean().optional(),
        answeredPrayers: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { upsertEmailPreferences } = await import("./db");
        
        await upsertEmailPreferences({
          userId: ctx.user.id,
          weeklyDigest: input.weeklyDigest !== undefined ? (input.weeklyDigest ? 1 : 0) : undefined,
          dailyDigest: input.dailyDigest !== undefined ? (input.dailyDigest ? 1 : 0) : undefined,
          newPrayers: input.newPrayers !== undefined ? (input.newPrayers ? 1 : 0) : undefined,
          prayerUpdates: input.prayerUpdates !== undefined ? (input.prayerUpdates ? 1 : 0) : undefined,
          answeredPrayers: input.answeredPrayers !== undefined ? (input.answeredPrayers ? 1 : 0) : undefined,
        });
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
