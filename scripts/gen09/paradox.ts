import { PokemonClient } from "pokenode-ts";
import { type z } from "zod";
import { capitalize } from "../helpers/capitalize";
import { db } from "~/server/db";
import { balls, rarities, species } from "~/server/db/schema";
import { type ZodSpeciesType } from "~/lib/types";
import { getHabitat } from "../helpers/get-habitat";

const TypesMap = {
  Normal: 1,
  Grass: 2,
  Bug: 3,
  Fire: 4,
  Electric: 5,
  Ground: 6,
  Water: 7,
  Fighting: 8,
  Poison: 9,
  Rock: 10,
  Ice: 11,
  Ghost: 12,
  Psychic: 13,
  Fairy: 14,
  Dark: 15,
  Dragon: 16,
  Steel: 17,
  Flying: 18,
};

const grassland = [985, 1009, 1020, 1021];
const forest = [986];
const watersEdge = [0];
const sea = [0];
const cave = [987, 993];
const mountain = [991, 992, 995];
const roughTerrain = [984, 989, 990, 1005];
const urban = [1006];
const rare = [988, 994, 1007, 1008, 1010, 1022, 1023];

// Script to populate Species collection
const paradoxPokemon = async () => {
  // Add Paradox Rarity
  await db.insert(rarities).values({ id: 8, name: "Paradox" });

  // Add Stange Ball
  await db.insert(balls).values({
    name: "Strange",
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/lastrange-ball.png",
    cost: 8000000,
    commonChance: 0,
    rareChance: 0,
    epicChance: 0,
    legendaryChance: 93,
    megaChance: 0,
    ubChance: 0,
    gmaxChance: 0,
    paradoxChance: 9,
  });

  const api = new PokemonClient();

  for (let i = 984; i <= 1023; i++) {
    // Skip Non-Paradox Pokemon
    if ((i > 995 && i < 1005) || (i > 1010 && i < 1020)) {
      continue;
    }

    const pokemonData = await api.getPokemonById(i);

    const rarity = 8;
    const income = 8000;
    const sell = 40000;

    const typeOne = capitalize(pokemonData.types[0].type.name) as z.infer<
      typeof ZodSpeciesType
    >;
    const typeTwo = pokemonData.types[1]
      ? (capitalize(pokemonData.types[1].type.name) as z.infer<
          typeof ZodSpeciesType
        >)
      : null;

    const habitat = getHabitat(
      i,
      grassland,
      forest,
      watersEdge,
      sea,
      cave,
      mountain,
      roughTerrain,
      urban,
      rare,
    );

    await db.insert(species).values({
      pokedexNumber: i,
      name: pokemonData.name,
      rarityId: rarity,
      yield: income,
      img: pokemonData.sprites.front_default!,
      sellPrice: sell,
      shiny: false,
      typeOneId: TypesMap[typeOne],
      typeTwoId: typeTwo ? TypesMap[typeTwo] : null,
      generation: 9,
      habitatId: habitat,
      regionId: 10,
      starter: i === 906 || i === 909 || i === 912,
    });

    await db.insert(species).values({
      pokedexNumber: i,
      name: pokemonData.name,
      rarityId: rarity,
      yield: income * 2,
      img: pokemonData.sprites.front_shiny!,
      sellPrice: sell * 2,
      shiny: true,
      typeOneId: TypesMap[typeOne],
      typeTwoId: typeTwo ? TypesMap[typeTwo] : null,
      generation: 9,
      habitatId: habitat,
      regionId: 10,
    });
  }

  console.log("done!");
};

void paradoxPokemon();
