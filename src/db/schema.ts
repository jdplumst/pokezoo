import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", {
		precision: 6,
		withTimezone: true,
	}),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
		precision: 6,
		withTimezone: true,
	}),
	scope: text("scope"),
	idToken: text("id_token"),
	password: text("password"),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull().unique(),
	expiresAt: timestamp("expires_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});

export const verification = pgTable("verificationToken", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});

export const achievement = pgTable(
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
			.references(() => achievementType.id, { onDelete: "cascade" }),
		attributeId: integer("attributeId")
			.notNull()
			.references(() => attribute.id, { onDelete: "cascade" }),
		regionId: integer("regionId")
			.notNull()
			.references(() => region.id, { onDelete: "cascade" }),
		shiny: boolean("shiny").notNull(),
		generation: integer("generation").notNull(),
	},
	(a) => [
		index("Achievement_typeId_idx").on(a.typeId),
		index("Achievement_attributeId_id").on(a.attributeId),
		index("Achievement_regionId_idx").on(a.regionId),
	],
);

export const achievementType = pgTable("achievementType", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const attribute = pgTable("attribute", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const ball = pgTable("ball", {
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
	gmaxChance: integer("gmaxChance").notNull().default(0),
	paradoxChance: integer("paradoxChance").notNull().default(0),
});

export const charm = pgTable("charm", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
	img: text("img").notNull(),
	cost: integer("cost").notNull(),
	description: text("description").notNull(),
});

export const habitat = pgTable("habitat", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const instance = pgTable(
	"instance",
	{
		id: text("id")
			.notNull()
			.$defaultFn(() => createId())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		speciesId: text("speciesId")
			.notNull()
			.references(() => species.id, { onDelete: "cascade" }),
		createDate: timestamp("createDate", { mode: "date" })
			.notNull()
			.default(sql`now()`),
		modifyDate: timestamp("modifyDate", { mode: "date" })
			.notNull()
			.default(sql`now()`),
		box: integer("box").notNull().default(0),
	},
	(i) => [
		index("Instance_userId_idx").on(i.userId),
		index("Instance_speciesId_idx").on(i.speciesId),
	],
);

export const profile = pgTable(
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
			.references(() => user.id, { onDelete: "cascade" }),
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
		galarStarter: boolean("galarStarter").notNull().default(true),
		hisuiStarter: boolean("hisuiStarter").notNull().default(true),
		paldeaStarter: boolean("paldeaStarter").notNull().default(true),
	},
	(p) => [index("Profile_userId_idx").on(p.userId)],
);

export const quest = pgTable(
	"quest",
	{
		id: serial("id").notNull().primaryKey(),
		description: text("description").notNull(),
		typeId: integer("type")
			.notNull()
			.references(() => questType.id, { onDelete: "cascade" }),
		reward: integer("reward").notNull(),
		goal: integer("goal").notNull(),
	},
	(q) => [index("Quest_typeId_idx").on(q.typeId)],
);

export const questType = pgTable("questType", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const rarity = pgTable("rarity", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const region = pgTable("region", {
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
			.references(() => rarity.id, { onDelete: "cascade" }),
		yield: integer("yield").notNull(),
		img: text("img").notNull(),
		sellPrice: integer("sellPrice").notNull(),
		shiny: boolean("shiny").notNull(),
		typeOneId: integer("typeOneId")
			.notNull()
			.references(() => type.id, { onDelete: "cascade" }),
		typeTwoId: integer("typeTwoId").references(() => type.id, {
			onDelete: "cascade",
		}),
		generation: integer("generation").notNull(),
		habitatId: integer("habitatId")
			.notNull()
			.references(() => habitat.id, { onDelete: "cascade" }),
		regionId: integer("regionId")
			.notNull()
			.references(() => region.id, { onDelete: "cascade" }),
		starter: boolean("starter").notNull().default(false),
	},
	(s) => [
		index("Species_rarityId_idx").on(s.rarityId),
		index("Species_typeOneId_idx").on(s.typeOneId),
		index("Species_typeTwoId_idx").on(s.typeTwoId),
		index("Species_habitatId_idx").on(s.habitatId),
		index("Species_regionId_idx").on(s.regionId),
	],
);

export const trade = pgTable(
	"trade",
	{
		id: text("id")
			.notNull()
			.$defaultFn(() => createId())
			.primaryKey(),
		initiatorId: text("initiatorId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		offererId: text("offererId").references(() => user.id, {
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
			.unique()
			.references(() => instance.id, { onDelete: "cascade" }),
		offererInstanceId: text("offererInstanceId").references(() => instance.id, {
			onDelete: "set null",
		}),
	},
	(t) => [
		index("Trade_initiatorId_idx").on(t.initiatorId),
		index("Trade_offererId_idx").on(t.offererId),
		index("Trade_initiatorInstanceId_idx").on(t.initiatorInstanceId),
		index("Trade_offererInstanceId_idx").on(t.offererInstanceId),
	],
);

export const type = pgTable("type", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull().unique(),
});

export const userAchievement = pgTable(
	"userAchievement",
	{
		id: text("id")
			.notNull()
			.$defaultFn(() => createId())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		achievementId: text("achievementId")
			.notNull()
			.references(() => achievement.id, { onDelete: "cascade" }),
		createDate: timestamp("createDate", { mode: "date" })
			.notNull()
			.default(sql`now()`),
	},
	(ua) => [
		index("UserAchievement_userId_idx").on(ua.userId),
		index("UserAchievement_achievementId_idx").on(ua.achievementId),
	],
);

export const userCharm = pgTable(
	"userCharm",
	{
		id: text("id")
			.notNull()
			.$defaultFn(() => createId())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		charmId: integer("charmId")
			.notNull()
			.references(() => charm.id, { onDelete: "cascade" }),
		createDate: timestamp("createDate", { mode: "date" })
			.notNull()
			.default(sql`now()`),
	},
	(uc) => [
		index("UserCharm_userId_idx").on(uc.userId),
		index("UserCharm_charmId_idx").on(uc.charmId),
	],
);

export const userQuest = pgTable(
	"userQuest",
	{
		id: text("id")
			.notNull()
			.$defaultFn(() => createId())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		questId: integer("questId")
			.notNull()
			.references(() => quest.id, { onDelete: "cascade" }),
		count: integer("count").notNull(),
		claimed: boolean("claimed").notNull(),
	},
	(uq) => [
		index("UserQuest_userId_idx").on(uq.userId),
		index("UserQuest_questId_idx").on(uq.questId),
	],
);
