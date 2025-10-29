import { z } from "zod";

import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  notifications: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
    .query(async ({ input }) => {
      const { getNotifications } = await import("../db");
      return getNotifications(input?.limit);
    }),

  exportReviewData: adminProcedure.mutation(async () => {
    const { exportReviewReport } = await import("../db");
    const csv = await exportReviewReport();
    return {
      csv,
      generatedAt: new Date().toISOString(),
    } as const;
  }),
});
