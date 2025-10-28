import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Churches table for organizations that can be part of the prayer network.
 * Churches must submit for review and be approved before appearing in the app.
 */
export const churches = mysqlTable("churches", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  /** Status of church membership: pending, approved, rejected */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** User who submitted this church for review */
  submittedBy: int("submittedBy").notNull(),
  /** Admin who reviewed this church (if applicable) */
  reviewedBy: int("reviewedBy"),
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Church = typeof churches.$inferSelect;
export type InsertChurch = typeof churches.$inferInsert;

/**
 * Prayers table for prayer requests submitted by users or anonymously.
 * Each prayer can be associated with a church or be independent.
 */
export const prayers = mysqlTable("prayers", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  /** User who submitted the prayer (null if anonymous) */
  userId: int("userId"),
  /** Church this prayer is associated with (optional) */
  churchId: int("churchId"),
  /** Prayer group this prayer belongs to (optional) */
  groupId: int("groupId"),
  /** Whether this prayer was submitted anonymously */
  isAnonymous: int("isAnonymous").default(0).notNull(),
  /** Display name for anonymous prayers (optional) */
  anonymousName: varchar("anonymousName", { length: 100 }),
  /** Whether this prayer is public or private to church members */
  isPublic: int("isPublic").default(1).notNull(),
  /** Visibility scope: community (all), church_only, nearby_churches */
  visibilityScope: mysqlEnum("visibilityScope", ["community", "church_only", "nearby_churches"]).default("community").notNull(),
  /** Status of prayer: active, answered, archived */
  status: mysqlEnum("status", ["active", "answered", "archived"]).default("active").notNull(),
  /** AI-generated categories (comma-separated) */
  categories: text("categories"),
  /** AI-detected urgency level */
  urgency: mysqlEnum("urgency", ["low", "medium", "high"]),
  /** Moderation status: pending, approved, flagged, rejected */
  moderationStatus: mysqlEnum("moderationStatus", ["pending", "approved", "flagged", "rejected"]).default("pending").notNull(),
  /** AI moderation concerns (JSON array) */
  moderationConcerns: text("moderationConcerns"),
  /** Admin who reviewed flagged content */
  moderatedBy: int("moderatedBy"),
  moderatedAt: timestamp("moderatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;

/**
 * Prayer responses/updates table for tracking answered prayers and updates.
 */
export const prayerResponses = mysqlTable("prayerResponses", {
  id: int("id").autoincrement().primaryKey(),
  prayerId: int("prayerId").notNull(),
  userId: int("userId"),
  content: text("content").notNull(),
  /** Whether this response marks the prayer as answered */
  isAnswer: int("isAnswer").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PrayerResponse = typeof prayerResponses.$inferSelect;
export type InsertPrayerResponse = typeof prayerResponses.$inferInsert;

/**
 * Church members table for tracking which users belong to which churches.
 * Enables private prayers and church-specific features.
 */
export const churchMembers = mysqlTable("churchMembers", {
  id: int("id").autoincrement().primaryKey(),
  churchId: int("churchId").notNull(),
  userId: int("userId").notNull(),
  /** Role within the church: member, admin, pastor */
  role: mysqlEnum("role", ["member", "admin", "pastor"]).default("member").notNull(),
  /** Verification status: pending, verified, rejected */
  status: mysqlEnum("status", ["pending", "verified", "rejected"]).default("pending").notNull(),
  /** Who verified this membership */
  verifiedBy: int("verifiedBy"),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChurchMember = typeof churchMembers.$inferSelect;
export type InsertChurchMember = typeof churchMembers.$inferInsert;

/**
 * Prayer groups/circles within churches for better organization.
 * Examples: Youth Group, Women's Ministry, Men's Fellowship, etc.
 */
export const prayerGroups = mysqlTable("prayerGroups", {
  id: int("id").autoincrement().primaryKey(),
  churchId: int("churchId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  /** Whether this group is public or private */
  isPublic: int("isPublic").default(1).notNull(),
  /** User who created this group */
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrayerGroup = typeof prayerGroups.$inferSelect;
export type InsertPrayerGroup = typeof prayerGroups.$inferInsert;

/**
 * Prayer group members for tracking who belongs to which groups.
 */
export const prayerGroupMembers = mysqlTable("prayerGroupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull(),
  userId: int("userId").notNull(),
  /** Role within the group: member, leader */
  role: mysqlEnum("role", ["member", "leader"]).default("member").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PrayerGroupMember = typeof prayerGroupMembers.$inferSelect;
export type InsertPrayerGroupMember = typeof prayerGroupMembers.$inferInsert;

/**
 * Email notification preferences for prayer digests.
 */
export const emailPreferences = mysqlTable("emailPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Receive weekly prayer digest emails */
  weeklyDigest: int("weeklyDigest").default(1).notNull(),
  /** Receive daily prayer digest emails */
  dailyDigest: int("dailyDigest").default(0).notNull(),
  /** Receive notifications for new prayers in your church */
  newPrayers: int("newPrayers").default(1).notNull(),
  /** Receive notifications for prayer updates */
  prayerUpdates: int("prayerUpdates").default(1).notNull(),
  /** Receive notifications for answered prayers */
  answeredPrayers: int("answeredPrayers").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailPreference = typeof emailPreferences.$inferSelect;
export type InsertEmailPreference = typeof emailPreferences.$inferInsert;

