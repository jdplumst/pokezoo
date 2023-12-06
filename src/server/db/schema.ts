import {
  mysqlTable,
  index,
  primaryKey,
  unique,
  varchar,
  text,
  int,
  mysqlEnum,
  datetime,
  boolean,
  timestamp
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  DBAchivementType,
  DBAttribute,
  DBHabitat,
  DBRarity,
  DBRegion,
  DBSpeciesType
} from "@/src/zod";
import { AdapterAccount } from "next-auth/adapters";
import { createSelectSchema } from "drizzle-zod";

// Next Auth Tables

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 })
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions)
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
    refresh_token_expires_in: int("refresh_token_expires_in")
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
      name: "Account_pk"
    }),
    userIdIdx: index("userId_idx").on(account.userId)
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId)
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
      name: "VerificationToken_pk"
    })
  })
);

// PokeZoo Tables

export const achievements = mysqlTable(
  "achievement",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    description: varchar("description", { length: 191 }).notNull(),
    tier: int("tier").notNull(),
    yield: int("yield").notNull(),
    type: mysqlEnum("type", DBAchivementType).notNull(),
    attribute: mysqlEnum("attribute", DBAttribute).notNull(),
    generation: int("generation").notNull(),
    shiny: boolean("shiny").notNull(),
    region: mysqlEnum("region", DBRegion).notNull()
  },
  (table) => {
    return {
      achievementIdPk: primaryKey({
        columns: [table.id],
        name: "Achievement_id_pk"
      })
    };
  }
);

export const balls = mysqlTable(
  "ball",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    img: varchar("img", { length: 191 }).notNull(),
    cost: int("cost").notNull(),
    commonChance: int("commonChance").notNull(),
    rareChance: int("rareChance").notNull(),
    epicChance: int("epicChance").notNull(),
    legendaryChance: int("legendaryChance").notNull()
  },
  (table) => {
    return {
      ballIdPk: primaryKey({ columns: [table.id], name: "Ball_id_pk" }),
      ballNameKey: unique("Ball_name_key").on(table.name)
    };
  }
);

export const instances = mysqlTable(
  "instance",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("userId", { length: 191 }).notNull(),
    speciesId: varchar("speciesId", { length: 191 }).notNull(),
    createDate: datetime("createDate", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    modifyDate: datetime("modifyDate", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull()
  },
  (table) => {
    return {
      userIdIdx: index("Instance_userId_idx").on(table.userId),
      speciesIdIdx: index("Instance_speciesId_idx").on(table.speciesId),
      instanceIdPk: primaryKey({ columns: [table.id], name: "Instance_id_pk" })
    };
  }
);

export const profiles = mysqlTable(
  "profile",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    totalYield: int("totalYield").default(0).notNull(),
    balance: int("balance").default(0).notNull(),
    claimedDaily: boolean("claimedDaily").default(false).notNull(),
    johtoStarter: boolean("johtoStarter").default(true).notNull(),
    claimedNightly: boolean("claimedNightly").default(false).notNull(),
    admin: boolean("admin").default(false).notNull(),
    hoennStarter: boolean("hoennStarter").default(true).notNull(),
    sinnohStarter: boolean("sinnohStarter").default(true).notNull(),
    username: varchar("username", { length: 191 }),
    instanceCount: int("instanceCount").default(0).notNull(),
    unovaStarter: boolean("unovaStarter").default(true).notNull(),
    commonCards: int("commonCards").default(0).notNull(),
    epicCards: int("epicCards").default(0).notNull(),
    legendaryCards: int("legendaryCards").default(0).notNull(),
    rareCards: int("rareCards").default(0).notNull(),
    userId: varchar("userId", { length: 191 }).notNull()
  },
  (table) => {
    return {
      userIdIdx: index("Profile_userId_idx").on(table.userId),
      profileIdPk: primaryKey({ columns: [table.id], name: "Profile_id_pk" })
    };
  }
);

export const species = mysqlTable(
  "species",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    pokedexNumber: int("pokedexNumber").notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    rarity: mysqlEnum("rarity", DBRarity).notNull(),
    yield: int("yield").notNull(),
    img: varchar("img", { length: 191 }).notNull(),
    sellPrice: int("sellPrice").notNull(),
    shiny: boolean("shiny").notNull(),
    typeOne: mysqlEnum("typeOne", DBSpeciesType).notNull(),
    typeTwo: mysqlEnum("typeTwo", DBSpeciesType),
    generation: int("generation").notNull(),
    habitat: mysqlEnum("habitat", DBHabitat).notNull(),
    region: mysqlEnum("region", DBRegion).notNull()
  },
  (table) => {
    return {
      speciesIdPk: primaryKey({ columns: [table.id], name: "Species_id_pk" })
    };
  }
);

export const trades = mysqlTable(
  "trade",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    initiatorId: varchar("initiatorId", { length: 191 }).notNull(),
    offererId: varchar("offererId", { length: 191 }),
    createDate: datetime("createDate", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    modifyDate: datetime("modifyDate", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    description: varchar("description", { length: 191 }),
    initiatorInstanceId: varchar("initiatorInstanceId", {
      length: 191
    }).notNull(),
    offererInstanceId: varchar("offererInstanceId", { length: 191 })
  },
  (table) => {
    return {
      initiatorIdIdx: index("Trade_initiatorId_idx").on(table.initiatorId),
      offererIdIdx: index("Trade_offererId_idx").on(table.offererId),
      initiatorInstanceIdIdx: index("Trade_initiatorInstanceId_idx").on(
        table.initiatorInstanceId
      ),
      offererInstanceIdIdx: index("Trade_offererInstanceId_idx").on(
        table.offererInstanceId
      ),
      tradeIdPk: primaryKey({ columns: [table.id], name: "Trade_id_pk" })
    };
  }
);

export const userAchievements = mysqlTable(
  "userAchievement",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("userId", { length: 191 }).notNull(),
    achievementId: varchar("achievementId", { length: 191 }).notNull(),
    createDate: datetime("createDate", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull()
  },
  (table) => {
    return {
      userIdIdx: index("UserAchievement_userId_idx").on(table.userId),
      achievementIdIdx: index("UserAchievement_achievementId_idx").on(
        table.achievementId
      ),
      userAchievementIdPk: primaryKey({
        columns: [table.id],
        name: "UserAchievement_id_pk"
      })
    };
  }
);

// Drizzle Zod Table Types
export const selectAchievementSchema = createSelectSchema(achievements);
export const selectBallSchema = createSelectSchema(balls);
export const selectInstanceSchema = createSelectSchema(instances);
export const selectProfileSchema = createSelectSchema(profiles);
export const selectSpeciesSchema = createSelectSchema(species);
export const selectTradesSchema = createSelectSchema(trades);
export const selectUserAchievementSchema = createSelectSchema(userAchievements);
