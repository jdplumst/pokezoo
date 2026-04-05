import { CATCHING_CHARM_ID } from "~/lib/constants";
import type { charms } from "~/server/db/schema";

export const TEST_CHARMS = {
	catching: {
		id: CATCHING_CHARM_ID,
		name: "Catching Charm",
		img: "catching-charm.png",
		cost: 100,
		description: "Increases catch rate",
	},
	other: {
		id: 2,
		name: "Other Charm",
		img: "other-charm.png",
		cost: 200,
		description: "Does something else",
	},
} satisfies Record<string, typeof charms.$inferSelect>;

export const TEST_CHARM_IDS = Object.values(TEST_CHARMS).map((c) => c.id);
