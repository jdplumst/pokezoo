import {
  index,
  primaryKey,
  text,
  integer,
  boolean,
  timestamp,
  pgTableCreator,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { type AdapterAccount } from "next-auth/adapters";
import { createSelectSchema } from "drizzle-zod";

export const pgTable = pgTableCreator((name) => `pokezoo_${name}`);

// Next Auth Tables

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// PokeZoo Tables

export const achievements = pgTable(
  "achievement",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    description: text("description").notNull(),
    tier: integer("tier").notNull(),
    yield: integer("yield").notNull(),
    typeId: integer("typeId")
      .notNull()
      .references(() => achievementTypes.id, { onDelete: "cascade" }),
    attributeId: integer("attributeId")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),
    regionId: integer("regionId")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade" }),
    shiny: boolean("shiny").notNull(),
    generation: integer("generation").notNull(),
  },
  (a) => ({
    typeIdIdx: index("Achievement_typeId_idx").on(a.typeId),
    attributeIdIdx: index("Achievement_attributeId_id").on(a.attributeId),
    regionIdIdx: index("Achievement_regionId_idx").on(a.regionId),
  }),
);

export const achievementTypes = pgTable("achievementType", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const attributes = pgTable("attribute", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const balls = pgTable("ball", {
  id: text("id")
    .notNull()
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull().unique(),
  img: text("img").notNull(),
  cost: integer("cost").notNull(),
  commonChance: integer("commonChance").notNull(),
  rareChance: integer("rareChance").notNull(),
  epicChance: integer("epicChance").notNull(),
  legendaryChance: integer("legendaryChance").notNull(),
  megaChance: integer("megaChance").notNull(),
  ubChance: integer("ubChance").notNull().default(0),
});

export const charms = pgTable("charm", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
  img: text("img").notNull(),
  cost: integer("cost").notNull(),
  description: text("description").notNull(),
});

export const habitats = pgTable("habitat", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const instances = pgTable(
  "instance",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    speciesId: text("speciesId")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    createDate: timestamp("createDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
    modifyDate: timestamp("modifyDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (i) => {
    return {
      userIdIdx: index("Instance_userId_idx").on(i.userId),
      speciesIdIdx: index("Instance_speciesId_idx").on(i.speciesId),
    };
  },
);

export const profiles = pgTable(
  "profile",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    username: text("username"),
    admin: boolean("admin").notNull().default(false),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    totalYield: integer("totalYield").notNull().default(0),
    balance: integer("balance").notNull().default(0),
    instanceCount: integer("instanceCount").notNull().default(0),
    claimedDaily: boolean("claimedDaily").notNull().default(false),
    claimedNightly: boolean("claimedNightly").notNull().default(false),
    claimedEvent: boolean("claimedEvent").notNull().default(true),
    commonCards: integer("commonCards").notNull().default(0),
    rareCards: integer("rareCards").notNull().default(0),
    epicCards: integer("epicCards").notNull().default(0),
    legendaryCards: integer("legendaryCards").notNull().default(0),
    johtoStarter: boolean("johtoStarter").notNull().default(true),
    hoennStarter: boolean("hoennStarter").notNull().default(true),
    sinnohStarter: boolean("sinnohStarter").notNull().default(true),
    unovaStarter: boolean("unovaStarter").notNull().default(true),
    kalosStarter: boolean("kalosStarter").notNull().default(true),
    alolaStarter: boolean("alolaStarter").notNull().default(true),
  },
  (p) => {
    return {
      userIdIdx: index("Profile_userId_idx").on(p.userId),
    };
  },
);

export const quests = pgTable(
  "quest",
  {
    id: serial("id").notNull().primaryKey(),
    description: text("description").notNull(),
    typeId: integer("type")
      .notNull()
      .references(() => questTypes.id, { onDelete: "cascade" }),
    reward: integer("reward").notNull(),
    goal: integer("goal").notNull(),
  },
  (q) => {
    return {
      typeIdIdx: index("Quest_typeId_idx").on(q.typeId),
    };
  },
);

export const questTypes = pgTable("questType", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const rarities = pgTable("rarity", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const regions = pgTable("region", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const species = pgTable(
  "species",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    pokedexNumber: integer("pokedexNumber").notNull(),
    name: text("name").notNull(),
    rarityId: serial("rarityId")
      .notNull()
      .references(() => rarities.id, { onDelete: "cascade" }),
    yield: integer("yield").notNull(),
    img: text("img").notNull(),
    sellPrice: integer("sellPrice").notNull(),
    shiny: boolean("shiny").notNull(),
    typeOneId: integer("typeOneId")
      .notNull()
      .references(() => types.id, { onDelete: "cascade" }),
    typeTwoId: integer("typeTwoId").references(() => types.id, {
      onDelete: "cascade",
    }),
    generation: integer("generation").notNull(),
    habitatId: integer("habitatId")
      .notNull()
      .references(() => habitats.id, { onDelete: "cascade" }),
    regionId: integer("regionId")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade" }),
  },
  (s) => {
    return {
      rarityIdIdx: index("Species_rarityId_idx").on(s.rarityId),
      typeOneIdIdx: index("Species_typeOneId_idx").on(s.typeOneId),
      typeTwoIdIdx: index("Species_typeTwoId_idx").on(s.typeTwoId),
      habitatIdIdx: index("Species_habitatId_idx").on(s.habitatId),
      regionIdIdx: index("Species_regionId_idx").on(s.regionId),
    };
  },
);

export const trades = pgTable(
  "trade",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    initiatorId: text("initiatorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    offererId: text("offererId").references(() => users.id, {
      onDelete: "set null",
    }),
    createDate: timestamp("createDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
    modifyDate: timestamp("modifyDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
    description: text("description"),
    initiatorInstanceId: text("initiatorInstanceId")
      .notNull()
      .references(() => instances.id, { onDelete: "cascade" }),
    offererInstanceId: text("offererInstanceId").references(
      () => instances.id,
      {
        onDelete: "set null",
      },
    ),
  },
  (t) => {
    return {
      initiatorIdIdx: index("Trade_initiatorId_idx").on(t.initiatorId),
      offererIdIdx: index("Trade_offererId_idx").on(t.offererId),
      initiatorInstanceIdIdx: index("Trade_initiatorInstanceId_idx").on(
        t.initiatorInstanceId,
      ),
      offererInstanceIdIdx: index("Trade_offererInstanceId_idx").on(
        t.offererInstanceId,
      ),
    };
  },
);

export const types = pgTable("type", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
});

export const userAchievements = pgTable(
  "userAchievement",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: text("achievementId")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    createDate: timestamp("createDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (ua) => {
    return {
      userIdIdx: index("UserAchievement_userId_idx").on(ua.userId),
      achievementIdIdx: index("UserAchievement_achievementId_idx").on(
        ua.achievementId,
      ),
    };
  },
);

export const userCharms = pgTable(
  "userCharm",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    charmId: integer("charmId")
      .notNull()
      .references(() => charms.id, { onDelete: "cascade" }),
    createDate: timestamp("createDate", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (uc) => {
    return {
      userIdIdx: index("UserCharm_userId_idx").on(uc.userId),
      charmIdIdx: index("UserCharm_charmId_idx").on(uc.charmId),
    };
  },
);

export const userQuests = pgTable(
  "userQuest",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questId: integer("questId")
      .notNull()
      .references(() => quests.id, { onDelete: "cascade" }),
    count: integer("count").notNull(),
    claimed: boolean("claimed").notNull(),
  },
  (uq) => {
    return {
      userIdIdx: index("UserQuest_userId_idx").on(uq.userId),
      questIdIdx: index("UserQuest_questId_idx").on(uq.questId),
    };
  },
);

// Drizzle Zod Table Types
export const selectAchievementSchema = createSelectSchema(achievements);
export const selectBallSchema = createSelectSchema(balls);
export const selectInstanceSchema = createSelectSchema(instances);
export const selectProfileSchema = createSelectSchema(profiles);
export const selectSpeciesSchema = createSelectSchema(species);
export const selectTradesSchema = createSelectSchema(trades);
export const selectUserAchievementSchema = createSelectSchema(userAchievements);
export const selectCharmSchema = createSelectSchema(charms);
