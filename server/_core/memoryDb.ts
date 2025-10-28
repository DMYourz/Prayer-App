import {
  type Church,
  type ChurchMember,
  type EmailPreference,
  type InsertChurch,
  type InsertChurchMember,
  type InsertEmailPreference,
  type InsertPrayer,
  type InsertPrayerGroup,
  type InsertPrayerGroupMember,
  type InsertPrayerResponse,
  type InsertUser,
  type Prayer,
  type PrayerGroup,
  type PrayerGroupMember,
  type PrayerResponse,
  type User,
} from "../../drizzle/schema";

type IdCounters = {
  prayers: number;
  churches: number;
  prayerResponses: number;
  churchMembers: number;
  prayerGroups: number;
  prayerGroupMembers: number;
  users: number;
  emailPreferences: number;
};

const baseDate = new Date();

const inMemoryData = {
  prayers: [] as Prayer[],
  churches: [] as Church[],
  prayerResponses: [] as PrayerResponse[],
  churchMembers: [] as ChurchMember[],
  prayerGroups: [] as PrayerGroup[],
  prayerGroupMembers: [] as PrayerGroupMember[],
  users: [] as User[],
  emailPreferences: [] as EmailPreference[],
};

const counters: IdCounters = {
  prayers: 0,
  churches: 0,
  prayerResponses: 0,
  churchMembers: 0,
  prayerGroups: 0,
  prayerGroupMembers: 0,
  users: 0,
  emailPreferences: 0,
};

const cloneDate = (date: Date) => new Date(date.getTime());

const addDays = (date: Date, days: number) => {
  const result = cloneDate(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addSampleUser = (user: Omit<User, "id">) => {
  counters.users += 1;
  const record: User = {
    id: counters.users,
    ...user,
  };
  inMemoryData.users.push(record);
  return record;
};

const ownerUser = addSampleUser({
  openId: "owner-dev-user",
  name: "Prayer Circle Admin",
  email: "team@prayercircle.example",
  loginMethod: "dev",
  role: "admin",
  createdAt: cloneDate(baseDate),
  updatedAt: cloneDate(baseDate),
  lastSignedIn: cloneDate(baseDate),
});

const shepherdUser = addSampleUser({
  openId: "shepherd-dev",
  name: "Pastor Grace Walker",
  email: "grace.walker@example.com",
  loginMethod: "dev",
  role: "user",
  createdAt: addDays(baseDate, -42),
  updatedAt: addDays(baseDate, -7),
  lastSignedIn: addDays(baseDate, -7),
});

const caringUser = addSampleUser({
  openId: "caregiver-dev",
  name: "Marcus Allen",
  email: "marcus.allen@example.com",
  loginMethod: "dev",
  role: "user",
  createdAt: addDays(baseDate, -21),
  updatedAt: addDays(baseDate, -2),
  lastSignedIn: addDays(baseDate, -2),
});

const addSampleChurch = (church: Omit<Church, "id">) => {
  counters.churches += 1;
  const record: Church = {
    id: counters.churches,
    ...church,
  };
  inMemoryData.churches.push(record);
  return record;
};

const radiantHope = addSampleChurch({
  name: "Radiant Hope Church",
  description:
    "A community of believers committed to prayer, discipleship, and serving the city with compassion.",
  address: "4578 Grace Street",
  city: "Orlando",
  state: "FL",
  country: "USA",
  zipCode: "32801",
  contactEmail: "hello@radianthope.church",
  contactPhone: "(407) 555-0148",
  website: "https://radianthope.church",
  status: "approved",
  submittedBy: ownerUser.id,
  reviewedBy: ownerUser.id,
  reviewNotes: "Vibrant prayer ministry and active pastoral oversight.",
  reviewedAt: addDays(baseDate, -28),
  createdAt: addDays(baseDate, -90),
  updatedAt: addDays(baseDate, -3),
});

const mercyBridge = addSampleChurch({
  name: "Mercy Bridge Fellowship",
  description:
    "A multicultural church caring for families, students, and those in transition with practical support and prayer.",
  address: "218 Willow Creek Rd",
  city: "Atlanta",
  state: "GA",
  country: "USA",
  zipCode: "30309",
  contactEmail: "contact@mercybridge.org",
  contactPhone: "(404) 555-0112",
  website: "https://mercybridge.org",
  status: "approved",
  submittedBy: ownerUser.id,
  reviewedBy: ownerUser.id,
  reviewNotes: "Has an established prayer chain and counseling ministry.",
  reviewedAt: addDays(baseDate, -17),
  createdAt: addDays(baseDate, -75),
  updatedAt: addDays(baseDate, -5),
});

addSampleChurch({
  name: "Northside Community Church",
  description:
    "Growing congregation with strong youth outreach. Pending additional verification for community safety policies.",
  address: "91 Meadow Lane",
  city: "Nashville",
  state: "TN",
  country: "USA",
  zipCode: "37209",
  contactEmail: "info@northsidecommunity.org",
  contactPhone: "(615) 555-0191",
  website: "https://northsidecommunity.org",
  status: "pending",
  submittedBy: shepherdUser.id,
  reviewedBy: null,
  reviewNotes: null,
  reviewedAt: null,
  createdAt: addDays(baseDate, -14),
  updatedAt: addDays(baseDate, -14),
});

const addSampleChurchMember = (member: Omit<ChurchMember, "id">) => {
  counters.churchMembers += 1;
  const record: ChurchMember = {
    id: counters.churchMembers,
    ...member,
  };
  inMemoryData.churchMembers.push(record);
  return record;
};

addSampleChurchMember({
  churchId: radiantHope.id,
  userId: shepherdUser.id,
  role: "pastor",
  status: "verified",
  verifiedBy: ownerUser.id,
  verifiedAt: addDays(baseDate, -30),
  createdAt: addDays(baseDate, -60),
  updatedAt: addDays(baseDate, -30),
});

addSampleChurchMember({
  churchId: mercyBridge.id,
  userId: caringUser.id,
  role: "member",
  status: "verified",
  verifiedBy: ownerUser.id,
  verifiedAt: addDays(baseDate, -15),
  createdAt: addDays(baseDate, -45),
  updatedAt: addDays(baseDate, -15),
});

const addSamplePrayerGroup = (group: Omit<PrayerGroup, "id">) => {
  counters.prayerGroups += 1;
  const record: PrayerGroup = {
    id: counters.prayerGroups,
    ...group,
  };
  inMemoryData.prayerGroups.push(record);
  return record;
};

const hopeMoms = addSamplePrayerGroup({
  churchId: radiantHope.id,
  name: "Hope Moms Circle",
  description: "Weekly encouragement and intercession for moms of all stages.",
  isPublic: 1,
  createdBy: shepherdUser.id,
  createdAt: addDays(baseDate, -50),
  updatedAt: addDays(baseDate, -10),
});

addSamplePrayerGroup({
  churchId: mercyBridge.id,
  name: "Bridge Builders (Young Adults)",
  description: "Focuses on career discernment, community outreach, and life transitions.",
  isPublic: 1,
  createdBy: caringUser.id,
  createdAt: addDays(baseDate, -35),
  updatedAt: addDays(baseDate, -7),
});

const addSamplePrayerGroupMember = (member: Omit<PrayerGroupMember, "id">) => {
  counters.prayerGroupMembers += 1;
  const record: PrayerGroupMember = {
    id: counters.prayerGroupMembers,
    ...member,
  };
  inMemoryData.prayerGroupMembers.push(record);
  return record;
};

addSamplePrayerGroupMember({
  groupId: hopeMoms.id,
  userId: shepherdUser.id,
  role: "leader",
  createdAt: addDays(baseDate, -50),
});

addSamplePrayerGroupMember({
  groupId: hopeMoms.id,
  userId: caringUser.id,
  role: "member",
  createdAt: addDays(baseDate, -22),
});

const addSamplePrayer = (prayer: Omit<Prayer, "id">) => {
  counters.prayers += 1;
  const record: Prayer = {
    id: counters.prayers,
    ...prayer,
  };
  inMemoryData.prayers.push(record);
  return record;
};

const now = cloneDate(baseDate);

addSamplePrayer({
  title: "Healing for My Son Ethan",
  content:
    "Our 8-year-old son Ethan is undergoing surgery next week to repair a congenital heart defect. Please pray for steady hands for the surgical team, strength for Ethan, and peace for our family during the recovery.",
  userId: shepherdUser.id,
  churchId: radiantHope.id,
  groupId: hopeMoms.id,
  isAnonymous: 0,
  anonymousName: null,
  isPublic: 1,
  visibilityScope: "community",
  status: "active",
  categories: "Health & Healing, Family & Relationships",
  urgency: "high",
  moderationStatus: "approved",
  moderationConcerns: null,
  moderatedBy: ownerUser.id,
  moderatedAt: addDays(now, -29),
  createdAt: addDays(now, -32),
  updatedAt: addDays(now, -2),
});

addSamplePrayer({
  title: "Guidance in Career Transition",
  content:
    "After 12 years in education, I sense God leading me into something new but I'm unsure what that looks like. Pray for clarity, courage to take the right steps, and provision for my family's needs during this transition.",
  userId: caringUser.id,
  churchId: mercyBridge.id,
  groupId: null,
  isAnonymous: 0,
  anonymousName: null,
  isPublic: 1,
  visibilityScope: "community",
  status: "active",
  categories: "Guidance & Decisions, Financial & Work",
  urgency: "medium",
  moderationStatus: "approved",
  moderationConcerns: null,
  moderatedBy: ownerUser.id,
  moderatedAt: addDays(now, -12),
  createdAt: addDays(now, -18),
  updatedAt: addDays(now, -6),
});

addSamplePrayer({
  title: "Strength for Caregivers",
  content:
    "I'm caring for my elderly mother who has rapidly progressing dementia. Pray for stamina, compassionate patience, quality respite care options, and that mom senses God's nearness even when she's anxious.",
  userId: null,
  churchId: radiantHope.id,
  groupId: null,
  isAnonymous: 1,
  anonymousName: "Grateful Daughter",
  isPublic: 1,
  visibilityScope: "community",
  status: "active",
  categories: "Family & Relationships, Mental Health",
  urgency: "medium",
  moderationStatus: "approved",
  moderationConcerns: null,
  moderatedBy: ownerUser.id,
  moderatedAt: addDays(now, -5),
  createdAt: addDays(now, -9),
  updatedAt: addDays(now, -5),
});

addSamplePrayer({
  title: "Launch Team Encouragement",
  content:
    "Our church plant is entering week four of Sunday gatherings. We're joyful and exhausted. Pray that our core team stays unified, that new families find a home with us, and for provision as we search for a permanent space.",
  userId: shepherdUser.id,
  churchId: null,
  groupId: null,
  isAnonymous: 0,
  anonymousName: null,
  isPublic: 1,
  visibilityScope: "community",
  status: "active",
  categories: "Community & Church, Guidance & Decisions",
  urgency: "medium",
  moderationStatus: "approved",
  moderationConcerns: null,
  moderatedBy: ownerUser.id,
  moderatedAt: addDays(now, -3),
  createdAt: addDays(now, -7),
  updatedAt: addDays(now, -1),
});

addSamplePrayer({
  title: "Praise Report: Unexpected Provision",
  content:
    "Wanted to share that after months of praying for steady employment, I received an offer this week that perfectly fits our family's rhythms. Thank you for praying — God provided in detail!",
  userId: caringUser.id,
  churchId: mercyBridge.id,
  groupId: null,
  isAnonymous: 0,
  anonymousName: null,
  isPublic: 1,
  visibilityScope: "community",
  status: "answered",
  categories: "Thanksgiving & Praise, Financial & Work",
  urgency: "low",
  moderationStatus: "approved",
  moderationConcerns: null,
  moderatedBy: ownerUser.id,
  moderatedAt: addDays(now, -1),
  createdAt: addDays(now, -40),
  updatedAt: addDays(now, -1),
});

const addSamplePrayerResponse = (response: Omit<PrayerResponse, "id">) => {
  counters.prayerResponses += 1;
  const record: PrayerResponse = {
    id: counters.prayerResponses,
    ...response,
  };
  inMemoryData.prayerResponses.push(record);
  return record;
};

addSamplePrayerResponse({
  prayerId: 1,
  userId: caringUser.id,
  content:
    "Standing with you this week. Our team committed to praying each morning for Ethan's surgery. Please keep us updated.",
  isAnswer: 0,
  createdAt: addDays(now, -6),
});

addSamplePrayerResponse({
  prayerId: 5,
  userId: caringUser.id,
  content: "Celebrating with you! God is faithful.",
  isAnswer: 1,
  createdAt: addDays(now, -1),
});

const addSampleEmailPreference = (preference: Omit<EmailPreference, "id">) => {
  counters.emailPreferences += 1;
  const record: EmailPreference = {
    id: counters.emailPreferences,
    ...preference,
  };
  inMemoryData.emailPreferences.push(record);
  return record;
};

addSampleEmailPreference({
  userId: shepherdUser.id,
  weeklyDigest: 1,
  dailyDigest: 0,
  newPrayers: 1,
  prayerUpdates: 1,
  answeredPrayers: 1,
  createdAt: addDays(baseDate, -45),
  updatedAt: addDays(baseDate, -5),
});

const orderByDateDesc = <T extends { createdAt: Date }>(items: T[]) =>
  [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

const nextId = <K extends keyof IdCounters>(key: K) => {
  counters[key] += 1;
  return counters[key];
};

export const memoryDb = {
  async upsertUser(user: InsertUser) {
    const existing = inMemoryData.users.find(u => u.openId === user.openId);
    if (existing) {
      Object.assign(existing, {
        ...user,
        id: existing.id,
        updatedAt: new Date(),
        lastSignedIn: user.lastSignedIn ?? new Date(),
      });
      return;
    }

    const id = nextId("users");
    const record: User = {
      id,
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      role: user.role ?? "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: user.lastSignedIn ?? new Date(),
    };
    inMemoryData.users.push(record);
  },

  async getUserByOpenId(openId: string) {
    return inMemoryData.users.find(user => user.openId === openId);
  },

  async createPrayer(prayer: InsertPrayer) {
    const id = nextId("prayers");
    const nowDate = new Date();
    const record: Prayer = {
      id,
      title: prayer.title,
      content: prayer.content,
      userId: prayer.userId ?? null,
      churchId: prayer.churchId ?? null,
      groupId: prayer.groupId ?? null,
      isAnonymous: prayer.isAnonymous ?? 0,
      anonymousName: prayer.anonymousName ?? null,
      isPublic: prayer.isPublic ?? 1,
      visibilityScope: prayer.visibilityScope ?? "community",
      status: prayer.status ?? "active",
      categories: prayer.categories ?? null,
      urgency: prayer.urgency ?? null,
      moderationStatus: prayer.moderationStatus ?? "pending",
      moderationConcerns: prayer.moderationConcerns ?? null,
      moderatedBy: prayer.moderatedBy ?? null,
      moderatedAt: prayer.moderatedAt ?? null,
      createdAt: prayer.createdAt ?? nowDate,
      updatedAt: prayer.updatedAt ?? nowDate,
    };
    inMemoryData.prayers.unshift(record);
    return record;
  },

  async getPrayers(filters?: {
    churchId?: number;
    status?: "active" | "answered" | "archived";
    isPublic?: boolean;
    moderationStatus?: "pending" | "approved" | "flagged" | "rejected";
    limit?: number;
    offset?: number;
  }) {
    let results = orderByDateDesc(inMemoryData.prayers);

    if (filters?.churchId !== undefined) {
      results = results.filter(prayer => prayer.churchId === filters.churchId);
    }
    if (filters?.status) {
      results = results.filter(prayer => prayer.status === filters.status);
    }
    if (filters?.isPublic !== undefined) {
      const expected = filters.isPublic ? 1 : 0;
      results = results.filter(prayer => prayer.isPublic === expected);
    }
    if (filters?.moderationStatus) {
      results = results.filter(prayer => prayer.moderationStatus === filters.moderationStatus);
    }

    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? results.length;
    return results.slice(offset, offset + limit);
  },

  async getPrayerById(id: number) {
    return inMemoryData.prayers.find(prayer => prayer.id === id);
  },

  async updatePrayerStatus(id: number, status: "active" | "answered" | "archived") {
    const prayer = inMemoryData.prayers.find(item => item.id === id);
    if (prayer) {
      prayer.status = status;
      prayer.updatedAt = new Date();
    }
  },

  async createChurch(church: InsertChurch) {
    const id = nextId("churches");
    const nowDate = new Date();
    const record: Church = {
      id,
      name: church.name,
      description: church.description ?? null,
      address: church.address ?? null,
      city: church.city ?? null,
      state: church.state ?? null,
      country: church.country ?? null,
      zipCode: church.zipCode ?? null,
      contactEmail: church.contactEmail ?? null,
      contactPhone: church.contactPhone ?? null,
      website: church.website ?? null,
      status: church.status ?? "pending",
      submittedBy: church.submittedBy,
      reviewedBy: church.reviewedBy ?? null,
      reviewNotes: church.reviewNotes ?? null,
      reviewedAt: church.reviewedAt ?? null,
      createdAt: church.createdAt ?? nowDate,
      updatedAt: church.updatedAt ?? nowDate,
    };
    inMemoryData.churches.push(record);
    return record;
  },

  async getChurches(filters?: { status?: "pending" | "approved" | "rejected"; limit?: number; offset?: number }) {
    let results = [...inMemoryData.churches];
    if (filters?.status) {
      results = results.filter(church => church.status === filters.status);
    }
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? results.length;
    return results.slice(offset, offset + limit);
  },

  async getChurchById(id: number) {
    return inMemoryData.churches.find(church => church.id === id);
  },

  async updateChurchStatus(
    id: number,
    status: "pending" | "approved" | "rejected",
    reviewedBy: number,
    reviewNotes?: string
  ) {
    const church = inMemoryData.churches.find(item => item.id === id);
    if (church) {
      church.status = status;
      church.reviewedBy = reviewedBy;
      church.reviewNotes = reviewNotes ?? null;
      church.reviewedAt = new Date();
      church.updatedAt = new Date();
    }
  },

  async createPrayerResponse(response: InsertPrayerResponse) {
    const id = nextId("prayerResponses");
    const nowDate = new Date();
    const record: PrayerResponse = {
      id,
      prayerId: response.prayerId,
      userId: response.userId ?? null,
      content: response.content,
      isAnswer: response.isAnswer ?? 0,
      createdAt: response.createdAt ?? nowDate,
    };
    inMemoryData.prayerResponses.push(record);
    return record;
  },

  async getPrayerResponses(prayerId: number) {
    return inMemoryData.prayerResponses
      .filter(response => response.prayerId === prayerId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async createChurchMember(member: InsertChurchMember) {
    const id = nextId("churchMembers");
    const nowDate = new Date();
    const record: ChurchMember = {
      id,
      churchId: member.churchId,
      userId: member.userId,
      role: member.role ?? "member",
      status: member.status ?? "pending",
      verifiedBy: member.verifiedBy ?? null,
      verifiedAt: member.verifiedAt ?? null,
      createdAt: member.createdAt ?? nowDate,
      updatedAt: member.updatedAt ?? nowDate,
    };
    inMemoryData.churchMembers.push(record);
    return record;
  },

  async getChurchMembers(churchId: number) {
    return inMemoryData.churchMembers
      .filter(member => member.churchId === churchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async getUserChurches(userId: number) {
    return inMemoryData.churchMembers.filter(member => member.userId === userId);
  },

  async verifyChurchMember(id: number, verifiedBy: number) {
    const member = inMemoryData.churchMembers.find(item => item.id === id);
    if (member) {
      member.status = "verified";
      member.verifiedBy = verifiedBy;
      member.verifiedAt = new Date();
      member.updatedAt = new Date();
    }
  },

  async isChurchMember(userId: number, churchId: number) {
    return (
      inMemoryData.churchMembers.find(
        member =>
          member.userId === userId && member.churchId === churchId && member.status === "verified"
      ) !== undefined
    );
  },

  async isChurchAdmin(userId: number, churchId: number) {
    const member = inMemoryData.churchMembers.find(
      item =>
        item.userId === userId && item.churchId === churchId && item.status === "verified"
    );
    if (!member) {
      return false;
    }
    return member.role === "admin" || member.role === "pastor";
  },

  async createPrayerGroup(group: InsertPrayerGroup) {
    const id = nextId("prayerGroups");
    const nowDate = new Date();
    const record: PrayerGroup = {
      id,
      churchId: group.churchId,
      name: group.name,
      description: group.description ?? null,
      isPublic: group.isPublic ?? 1,
      createdBy: group.createdBy,
      createdAt: group.createdAt ?? nowDate,
      updatedAt: group.updatedAt ?? nowDate,
    };
    inMemoryData.prayerGroups.push(record);
    return record;
  },

  async getPrayerGroups(churchId: number) {
    return inMemoryData.prayerGroups
      .filter(group => group.churchId === churchId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getPrayerGroupById(id: number) {
    return inMemoryData.prayerGroups.find(group => group.id === id);
  },

  async addGroupMember(member: InsertPrayerGroupMember) {
    const id = nextId("prayerGroupMembers");
    const nowDate = new Date();
    const record: PrayerGroupMember = {
      id,
      groupId: member.groupId,
      userId: member.userId,
      role: member.role ?? "member",
      createdAt: member.createdAt ?? nowDate,
    };
    inMemoryData.prayerGroupMembers.push(record);
    return record;
  },

  async getGroupMembers(groupId: number) {
    return inMemoryData.prayerGroupMembers.filter(member => member.groupId === groupId);
  },

  async getUserGroups(userId: number) {
    return inMemoryData.prayerGroupMembers.filter(member => member.userId === userId);
  },

  async createEmailPreference(pref: InsertEmailPreference) {
    const existing = inMemoryData.emailPreferences.find(item => item.userId === pref.userId);
    if (existing) {
      existing.weeklyDigest = pref.weeklyDigest ?? existing.weeklyDigest;
      existing.dailyDigest = pref.dailyDigest ?? existing.dailyDigest;
      existing.newPrayers = pref.newPrayers ?? existing.newPrayers;
      existing.prayerUpdates = pref.prayerUpdates ?? existing.prayerUpdates;
      existing.answeredPrayers = pref.answeredPrayers ?? existing.answeredPrayers;
      existing.updatedAt = pref.updatedAt ?? new Date();
      return existing;
    }

    const id = nextId("emailPreferences");
    const nowDate = new Date();
    const record: EmailPreference = {
      id,
      userId: pref.userId,
      weeklyDigest: pref.weeklyDigest ?? 1,
      dailyDigest: pref.dailyDigest ?? 0,
      newPrayers: pref.newPrayers ?? 1,
      prayerUpdates: pref.prayerUpdates ?? 1,
      answeredPrayers: pref.answeredPrayers ?? 1,
      createdAt: pref.createdAt ?? nowDate,
      updatedAt: pref.updatedAt ?? nowDate,
    };
    inMemoryData.emailPreferences.push(record);
    return record;
  },

  async getEmailPreference(userId: number) {
    return inMemoryData.emailPreferences.find(pref => pref.userId === userId);
  },
};
