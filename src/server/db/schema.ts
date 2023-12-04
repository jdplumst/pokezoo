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
  boolean
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const account = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
    refreshTokenExpiresIn: int("refresh_token_expires_in")
  },
  (table) => {
    return {
      userIdIdx: index("Account_userId_idx").on(table.userId),
      accountIdPk: primaryKey({ columns: [table.id], name: "Account_id_pk" }),
      accountProviderProviderAccountIdKey: unique(
        "Account_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId)
    };
  }
);

export const achievement = mysqlTable(
  "Achievement",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    description: varchar("description", { length: 191 }).notNull(),
    tier: int("tier").notNull(),
    yield: int("yield").notNull(),
    type: mysqlEnum("type", ["Rarity", "Habitat", "Type", "All"]).notNull(),
    attribute: mysqlEnum("attribute", [
      "Common",
      "Rare",
      "Epic",
      "Legendary",
      "Grassland",
      "Forest",
      "WatersEdge",
      "Sea",
      "Cave",
      "Mountain",
      "RoughTerrain",
      "Urban",
      "Normal",
      "Fire",
      "Fighting",
      "Water",
      "Flying",
      "Grass",
      "Poison",
      "Electric",
      "Ground",
      "Psychic",
      "Rock",
      "Ice",
      "Bug",
      "Dragon",
      "Ghost",
      "Steel",
      "Fairy",
      "Dark",
      "All"
    ]).notNull(),
    generation: int("generation").notNull(),
    shiny: boolean("shiny").notNull(),
    region: mysqlEnum("region", [
      "Kanto",
      "Johto",
      "Hoenn",
      "Sinnoh",
      "Unova"
    ]).notNull()
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

export const ball = mysqlTable(
  "Ball",
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

export const instance = mysqlTable(
  "Instance",
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

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date", fsp: 3 }).notNull()
  },
  (table) => {
    return {
      userIdIdx: index("Session_userId_idx").on(table.userId),
      sessionIdPk: primaryKey({ columns: [table.id], name: "Session_id_pk" }),
      sessionSessionTokenKey: unique("Session_sessionToken_key").on(
        table.sessionToken
      )
    };
  }
);

export const species = mysqlTable(
  "Species",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    pokedexNumber: int("pokedexNumber").notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    rarity: mysqlEnum("rarity", [
      "Common",
      "Rare",
      "Epic",
      "Legendary"
    ]).notNull(),
    yield: int("yield").notNull(),
    img: varchar("img", { length: 191 }).notNull(),
    sellPrice: int("sellPrice").notNull(),
    shiny: boolean("shiny").notNull(),
    typeOne: mysqlEnum("typeOne", [
      "Normal",
      "Grass",
      "Bug",
      "Fire",
      "Electric",
      "Ground",
      "Water",
      "Fighting",
      "Poison",
      "Rock",
      "Ice",
      "Ghost",
      "Psychic",
      "Fairy",
      "Dark",
      "Dragon",
      "Steel",
      "Flying"
    ]).notNull(),
    typeTwo: mysqlEnum("typeTwo", [
      "Normal",
      "Grass",
      "Bug",
      "Fire",
      "Electric",
      "Ground",
      "Water",
      "Fighting",
      "Poison",
      "Rock",
      "Ice",
      "Ghost",
      "Psychic",
      "Fairy",
      "Dark",
      "Dragon",
      "Steel",
      "Flying"
    ]),
    generation: int("generation").notNull(),
    habitat: mysqlEnum("habitat", [
      "Grassland",
      "Forest",
      "WatersEdge",
      "Sea",
      "Cave",
      "Mountain",
      "RoughTerrain",
      "Urban",
      "Rare"
    ]).notNull(),
    region: mysqlEnum("region", [
      "Kanto",
      "Johto",
      "Hoenn",
      "Sinnoh",
      "Unova"
    ]).notNull()
  },
  (table) => {
    return {
      speciesIdPk: primaryKey({ columns: [table.id], name: "Species_id_pk" })
    };
  }
);

export const trade = mysqlTable(
  "Trade",
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

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).default("").notNull(),
    emailVerified: datetime("emailVerified", { mode: "date", fsp: 3 }),
    image: varchar("image", { length: 191 }),
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
    rareCards: int("rareCards").default(0).notNull()
  },
  (table) => {
    return {
      userIdPk: primaryKey({ columns: [table.id], name: "User_id_pk" }),
      userEmailKey: unique("User_email_key").on(table.email)
    };
  }
);

export const userAchievement = mysqlTable(
  "UserAchievement",
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

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date", fsp: 3 }).notNull()
  },
  (table) => {
    return {
      verificationTokenIdentifierPk: primaryKey({
        columns: [table.identifier],
        name: "VerificationToken_identifier_pk"
      }),
      verificationTokenTokenKey: unique("VerificationToken_token_key").on(
        table.token
      ),
      verificationTokenIdentifierTokenKey: unique(
        "VerificationToken_identifier_token_key"
      ).on(table.identifier, table.token)
    };
  }
);
