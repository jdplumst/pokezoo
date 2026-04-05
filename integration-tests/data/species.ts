import type { species } from "~/server/db/schema";
import { TEST_HABITATS } from "./habitats";
import { TEST_RARITIES } from "./rarities";
import { TEST_REGIONS } from "./regions";
import { TEST_TYPES } from "./types";

export const TEST_SPECIES = {
	bulbasaur: {
		id: "bulbasaur-1",
		name: "Bulbasaur",
		typeOneId: TEST_TYPES.grass.id, // Grass
		typeTwoId: TEST_TYPES.poison.id, // Poison
		yield: 10,
		img: "https://example.com/bulbasaur.png",
		sellPrice: 100,
		generation: 1,
		starter: true,
		pokedexNumber: 1,
		rarityId: TEST_RARITIES.rare.id,
		shiny: false,
		regionId: TEST_REGIONS.kanto.id,
		habitatId: TEST_HABITATS.grassland.id,
	},
	charmander: {
		id: "charmander-4",
		name: "Charmander",
		typeOneId: TEST_TYPES.fire.id, // Fire
		typeTwoId: null,
		yield: 10,
		img: "https://example.com/charmander.png",
		sellPrice: 50,
		generation: 1,
		starter: true,
		pokedexNumber: 4,
		rarityId: TEST_RARITIES.rare.id,
		shiny: false,
		regionId: TEST_REGIONS.kanto.id,
		habitatId: TEST_HABITATS.mountain.id,
	},
	squirtle: {
		id: "squirtle-7",
		name: "Squirtle",
		typeOneId: TEST_TYPES.water.id,
		typeTwoId: null,
		yield: 10,
		img: "https://example.com/squirtle.png",
		sellPrice: 50,
		generation: 1,
		starter: true,
		pokedexNumber: 7,
		rarityId: TEST_RARITIES.rare.id,
		shiny: false,
		regionId: TEST_REGIONS.kanto.id,
		habitatId: TEST_HABITATS.watersEdge.id,
	},
	pikachu: {
		id: "pikachu-25",
		name: "Pikachu",
		typeOneId: TEST_TYPES.electric.id,
		typeTwoId: null,
		yield: 10,
		img: "https://example.com/pikachu.png",
		sellPrice: 50,
		generation: 1,
		starter: false,
		pokedexNumber: 25,
		rarityId: TEST_RARITIES.common.id,
		shiny: false,
		regionId: TEST_REGIONS.kanto.id,
		habitatId: TEST_HABITATS.forest.id,
	},
} satisfies Record<string, typeof species.$inferSelect>;

export const TEST_SPECIES_IDS = Object.values(TEST_SPECIES).map((s) => s.id);
