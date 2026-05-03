import type { instances } from "~/server/db/schema";
import { TEST_SPECIES } from "./species";
import { TEST_USERS } from "./users";

export const TEST_INSTANCES = {
	bulbasaur: {
		id: "bulbasaur-instance",
		userId: TEST_USERS.testUser.id,
		speciesId: TEST_SPECIES.bulbasaur.id,
	},
	charmander: {
		id: "charmander-instance",
		userId: TEST_USERS.testUser.id,
		speciesId: TEST_SPECIES.charmander.id,
	},
	squirtle: {
		id: "squirtle-instance",
		userId: TEST_USERS.testUser.id,
		speciesId: TEST_SPECIES.squirtle.id,
	},
	pikachuOffer: {
		id: "pikachu-instance-offer",
		userId: TEST_USERS.offererUser.id,
		speciesId: TEST_SPECIES.pikachu.id,
	},
} satisfies Record<string, Partial<typeof instances.$inferSelect>>;

export const TEST_INSTANCE_IDS = Object.values(TEST_INSTANCES).map((i) => i.id);
