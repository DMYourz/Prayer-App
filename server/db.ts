import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";

import type {
  InsertChurch,
  InsertChurchMember,
  InsertEmailPreference,
  InsertPrayer,
  InsertPrayerGroup,
  InsertPrayerGroupMember,
  InsertPrayerResponse,
  InsertUser,
} from "../drizzle/schema";
import {
  churches,
  churchMembers,
  emailPreferences,
  prayerGroupMembers,
  prayerGroups,
  prayerResponses,
  prayers,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { memoryDb } from "./_core/memoryDb";

let _db: ReturnType<typeof drizzle> | null = null;

type DbResolver = () => Promise<ReturnType<typeof drizzle> | null>;
let resolveDb: DbResolver = getDb;

let memoryNoticeShown = false;

export function __setDbResolver(resolver: DbResolver | null) {
  resolveDb = resolver ?? getDb;
}

function notifyMemoryFallback() {
  if (!memoryNoticeShown) {
    console.warn(
      "[Database] DATABASE_URL not configured. Falling back to in-memory sample data for local development."
    );
    memoryNoticeShown = true;
  }
}

const csvEscape = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    await memoryDb.upsertUser(user);
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getUserByOpenId(openId);
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Prayer queries
export async function createPrayer(prayer: InsertPrayer) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.createPrayer(prayer);
  }

  const result = await db.insert(prayers).values(prayer);
  return result;
}

export async function getPrayers(filters?: {
  churchId?: number;
  status?: "active" | "answered" | "archived";
  isPublic?: boolean;
  moderationStatus?: "pending" | "approved" | "flagged" | "rejected";
  limit?: number;
  offset?: number;
}) {
  const db = await resolveDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getPrayers(filters);
  }

  let query = db.select().from(prayers).$dynamic();

  const conditions = [];
  if (filters?.churchId !== undefined) {
    conditions.push(eq(prayers.churchId, filters.churchId));
  }
  if (filters?.status) {
    conditions.push(eq(prayers.status, filters.status));
  }
  if (filters?.isPublic !== undefined) {
    conditions.push(eq(prayers.isPublic, filters.isPublic ? 1 : 0));
  }
  if (filters?.moderationStatus) {
    conditions.push(eq(prayers.moderationStatus, filters.moderationStatus));
  }

  if (conditions.length === 1) {
    query = query.where(conditions[0]);
  } else if (conditions.length > 1) {
    query = query.where(and(...conditions));
  }

  const result = await query
    .orderBy(prayers.createdAt)
    .limit(filters?.limit ?? 50)
    .offset(filters?.offset ?? 0);
  
  return result;
}

export async function getPrayerById(id: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getPrayerById(id);
  }

  const result = await db.select().from(prayers).where(eq(prayers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePrayerStatus(id: number, status: "active" | "answered" | "archived") {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    await memoryDb.updatePrayerStatus(id, status);
    return;
  }

  await db.update(prayers).set({ status }).where(eq(prayers.id, id));
}

export async function updatePrayerModeration(
  id: number,
  moderationStatus: "pending" | "approved" | "flagged" | "rejected",
  moderatorId: number,
  notes?: string | null
) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.updatePrayerModeration(id, moderationStatus, moderatorId, notes);
  }

  await db
    .update(prayers)
    .set({
      moderationStatus,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
      moderationConcerns: notes ?? null,
    })
    .where(eq(prayers.id, id));

  const result = await db.select().from(prayers).where(eq(prayers.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Church queries
export async function createChurch(church: InsertChurch) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.createChurch(church);
  }

  const result = await db.insert(churches).values(church);
  return result;
}

export async function getChurches(filters?: {
  status?: "pending" | "approved" | "rejected";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getChurches(filters);
  }

  let query = db.select().from(churches).$dynamic();
  
  if (filters?.status) {
    query = query.where(eq(churches.status, filters.status));
  }
  
  const result = await query
    .orderBy(churches.createdAt)
    .limit(filters?.limit ?? 50)
    .offset(filters?.offset ?? 0);
  
  return result;
}

export async function getChurchById(id: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getChurchById(id);
  }

  const result = await db.select().from(churches).where(eq(churches.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateChurchStatus(
  id: number,
  status: "pending" | "approved" | "rejected",
  reviewedBy: number,
  reviewNotes?: string
) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    await memoryDb.updateChurchStatus(id, status, reviewedBy, reviewNotes);
    return;
  }

  await db.update(churches).set({
    status,
    reviewedBy,
    reviewNotes,
    reviewedAt: new Date(),
  }).where(eq(churches.id, id));
}

// Prayer response queries
export async function createPrayerResponse(response: InsertPrayerResponse) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.createPrayerResponse(response);
  }

  const result = await db.insert(prayerResponses).values(response);
  return result;
}

export async function getPrayerResponses(prayerId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getPrayerResponses(prayerId);
  }

  const result = await db.select()
    .from(prayerResponses)
    .where(eq(prayerResponses.prayerId, prayerId))
    .orderBy(prayerResponses.createdAt);
  
  return result;
}


// Church member queries
export async function createChurchMember(member: InsertChurchMember) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.createChurchMember(member);
  }

  const result = await db.insert(churchMembers).values(member);
  return result;
}

export async function getChurchMembers(churchId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getChurchMembers(churchId);
  }

  const result = await db.select()
    .from(churchMembers)
    .where(eq(churchMembers.churchId, churchId))
    .orderBy(churchMembers.createdAt);
  
  return result;
}

export async function getUserChurches(userId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getUserChurches(userId);
  }

  const result = await db.select()
    .from(churchMembers)
    .where(eq(churchMembers.userId, userId));
  
  return result;
}

export async function verifyChurchMember(
  id: number,
  verifiedBy: number
) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    await memoryDb.verifyChurchMember(id, verifiedBy);
    return;
  }

  await db.update(churchMembers).set({
    status: "verified",
    verifiedBy,
    verifiedAt: new Date(),
  }).where(eq(churchMembers.id, id));
}

export async function isChurchMember(userId: number, churchId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.isChurchMember(userId, churchId);
  }
  
  const result = await db.select()
    .from(churchMembers)
    .where(and(
      eq(churchMembers.userId, userId),
      eq(churchMembers.churchId, churchId),
      eq(churchMembers.status, "verified")
    ))
    .limit(1);
  
  return result.length > 0;
}

export async function isChurchAdmin(userId: number, churchId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.isChurchAdmin(userId, churchId);
  }
  
  const result = await db.select()
    .from(churchMembers)
    .where(and(
      eq(churchMembers.userId, userId),
      eq(churchMembers.churchId, churchId),
      eq(churchMembers.status, "verified")
    ));
  
  if (result.length === 0) return false;
  
  return result[0].role === "admin" || result[0].role === "pastor";
}

// Prayer group queries
export async function createPrayerGroup(group: InsertPrayerGroup) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.createPrayerGroup(group);
  }
  
  const result = await db.insert(prayerGroups).values(group);
  return result;
}

export async function getPrayerGroups(churchId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getPrayerGroups(churchId);
  }
  
  const result = await db.select()
    .from(prayerGroups)
    .where(eq(prayerGroups.churchId, churchId))
    .orderBy(prayerGroups.name);
  
  return result;
}

export async function getPrayerGroupById(id: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getPrayerGroupById(id);
  }
  
  const result = await db.select()
    .from(prayerGroups)
    .where(eq(prayerGroups.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// Prayer group member queries
export async function addGroupMember(member: InsertPrayerGroupMember) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.addGroupMember(member);
  }
  
  const result = await db.insert(prayerGroupMembers).values(member);
  return result;
}

export async function getGroupMembers(groupId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getGroupMembers(groupId);
  }
  
  const result = await db.select()
    .from(prayerGroupMembers)
    .where(eq(prayerGroupMembers.groupId, groupId))
    .orderBy(prayerGroupMembers.createdAt);
  
  return result;
}

export async function getUserGroups(userId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getUserGroups(userId);
  }
  
  const result = await db.select()
    .from(prayerGroupMembers)
    .where(eq(prayerGroupMembers.userId, userId));
  
  return result;
}

export async function isGroupMember(userId: number, groupId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    const members = await memoryDb.getGroupMembers(groupId);
    return members.some(member => member.userId === userId);
  }
  
  const result = await db.select()
    .from(prayerGroupMembers)
    .where(and(
      eq(prayerGroupMembers.userId, userId),
      eq(prayerGroupMembers.groupId, groupId)
    ))
    .limit(1);
  
  return result.length > 0;
}

// Email preferences queries
export async function getEmailPreferences(userId: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getEmailPreference(userId);
  }
  
  const result = await db.select()
    .from(emailPreferences)
    .where(eq(emailPreferences.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertEmailPreferences(prefs: InsertEmailPreference) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    await memoryDb.createEmailPreference(prefs);
    return;
  }

  await db.insert(emailPreferences).values(prefs).onDuplicateKeyUpdate({
    set: {
      weeklyDigest: prefs.weeklyDigest,
      dailyDigest: prefs.dailyDigest,
      newPrayers: prefs.newPrayers,
      prayerUpdates: prefs.prayerUpdates,
      answeredPrayers: prefs.answeredPrayers,
      updatedAt: new Date(),
    },
  });
}

export async function getNotifications(limit?: number) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    return memoryDb.getNotifications(limit);
  }

  // Placeholder: implement real notification persistence once DB is wired.
  console.warn("[Database] Notifications requested but persistence not implemented yet.");
  return [];
}

export async function createDemoChurchMember(churchId: number, member: { name?: string; email?: string; role: "member" | "admin" | "pastor" }) {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    const openId = member.email ? `demo-${member.email}` : `demo-${nanoid()}`;
    await memoryDb.upsertUser({
      openId,
      name: member.name ?? null,
      email: member.email ?? null,
      loginMethod: "demo_invite",
      role: "user",
      lastSignedIn: new Date(),
    });

    const user = await memoryDb.getUserByOpenId(openId);
    if (!user) {
      throw new Error("Failed to create demo user for church member");
    }

    await memoryDb.createChurchMember({
      churchId,
      userId: user.id,
      role: member.role,
      status: "pending",
    });

    return user;
  }

  console.warn("[Database] createDemoChurchMember invoked without implementation on SQL backend.");
  return null;
}

export async function exportReviewReport() {
  const db = await getDb();
  if (!db) {
    notifyMemoryFallback();
    const [pendingChurches, flaggedPrayers] = await Promise.all([
      memoryDb.getChurches({ status: "pending" }),
      memoryDb.getPrayers({ moderationStatus: "flagged" }),
    ]);

    const pendingMembers = await Promise.all(
      pendingChurches.map(church => memoryDb.getChurchMembers(church.id))
    ).then(groups => groups.flat().filter(member => member.status !== "verified"));

    const csvLines: string[] = [];
    csvLines.push("Pending Churches");
    csvLines.push("Name,City,State,Submitted By,Submitted At");
    pendingChurches.forEach(church => {
      csvLines.push([
        csvEscape(church.name),
        csvEscape(church.city),
        csvEscape(church.state),
        csvEscape(church.submittedBy),
        csvEscape(church.createdAt.toISOString()),
      ].join(","));
    });

    csvLines.push("");
    csvLines.push("Flagged Prayers");
    csvLines.push("Title,Urgency,Categories,Submitted At,Flagged At");
    flaggedPrayers.forEach(prayer => {
      csvLines.push([
        csvEscape(prayer.title),
        csvEscape(prayer.urgency ?? ""),
        csvEscape(prayer.categories ?? ""),
        csvEscape(prayer.createdAt.toISOString()),
        csvEscape(prayer.moderatedAt?.toISOString() ?? ""),
      ].join(","));
    });

    csvLines.push("");
    csvLines.push("Pending Members");
    csvLines.push("Member ID,Church ID,Role,Status,Requested At");
    pendingMembers.forEach(member => {
      csvLines.push([
        csvEscape(member.id),
        csvEscape(member.churchId),
        csvEscape(member.role),
        csvEscape(member.status),
        csvEscape(member.createdAt.toISOString()),
      ].join(","));
    });

    return csvLines.join("\n");
  }

  console.warn("[Database] exportReviewReport invoked without SQL backend implementation.");
  return "";
}
