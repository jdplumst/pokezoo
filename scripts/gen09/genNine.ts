import { PokemonClient } from "pokenode-ts";
import { type z } from "zod";
import { capitalize } from "../helpers/capitalize";
import { db } from "~/server/db";
import { regions, species } from "~/server/db/schema";
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

const grassland = [
  915, 916, 917, 918, 921, 922, 923, 940, 941, 951, 952, 953, 954, 955, 956,
  967, 973, 981,
];
const forest = [
  906, 907, 908, 928, 929, 930, 942, 943, 944, 945, 946, 947, 948, 949, 971,
  972, 983, 1011, 1019,
];
const watersEdge = [912, 913, 914, 938, 939, 960, 961, 980];
const sea = [963, 964, 976, 977, 978];
const cave = [969, 970, 982, 1018];
const mountain = [
  909, 910, 911, 935, 936, 937, 962, 974, 975, 979, 996, 997, 998,
];
const roughTerrain = [919, 920, 932, 933, 934, 950, 965, 966, 968];
const urban = [924, 925, 926, 927, 931, 957, 958, 959, 999, 1000, 1012, 1013];
const rare = [1001, 1002, 1003, 1004, 1014, 1015, 1016, 1017, 1024, 1025];

// Script to populate Species collection
const populateGenNineDB = async () => {
  // Add Paldea Region
  await db.insert(regions).values({ id: 10, name: "Paldea" });

  const api = new PokemonClient();

  for (let i = 906; i <= 1025; i++) {
    // Skip Paradox Pokemon
    if (
      (i >= 984 && i <= 995) ||
      (i >= 1005 && i <= 1010) ||
      (i >= 1020 && i <= 1023)
    ) {
      continue;
    }

    const pokemonData = await api.getPokemonById(i);
    const speciesData = await api.getPokemonSpeciesById(i);

    let rarity = 1;
    let income = 0;
    let sell = 0;

    if (speciesData.is_legendary || speciesData.is_mythical) {
      rarity = 4;
      income = 1000;
      sell = 5000;
    } else if (speciesData.growth_rate.name === "medium") {
      rarity = 1;
      income = 10;
      sell = 50;
    } else if (
      speciesData.growth_rate.name === "medium-slow" ||
      speciesData.growth_rate.name === "fast"
    ) {
      rarity = 2;
      income = 50;
      sell = 250;
    } else if (
      speciesData.growth_rate.name === "slow" ||
      speciesData.growth_rate.name === "slow-then-very-fast" ||
      speciesData.growth_rate.name === "fast-then-very-slow"
    ) {
      rarity = 3;
      income = 300;
      sell = 1500;
    }

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

    console.log(pokemonData.name);
  }
};

void populateGenNineDB();
