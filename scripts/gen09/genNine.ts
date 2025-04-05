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
  }

  // Other forms/varieties
  await db.insert(species).values([
    {
      pokedexNumber: 916,
      name: "oinkologne-female",
      rarityId: 1,
      yield: 10,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10254.png",
      sellPrice: 50,
      shiny: false,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 1,
      regionId: 10,
    },
    {
      pokedexNumber: 916,
      name: "oinkologne-female",
      rarityId: 1,
      yield: 20,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10254.png",
      sellPrice: 100,
      shiny: true,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 1,
      regionId: 10,
    },
    {
      pokedexNumber: 964,
      name: "palafin-hero",
      rarityId: 3,
      yield: 300,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10256.png",
      sellPrice: 1500,
      shiny: false,
      typeOneId: 7,
      typeTwoId: null,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 964,
      name: "palafin-hero",
      rarityId: 3,
      yield: 600,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10256.png",
      sellPrice: 3000,
      shiny: true,
      typeOneId: 7,
      typeTwoId: null,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-blue-plumage",
      rarityId: 3,
      yield: 300,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10260.png",
      sellPrice: 1500,
      shiny: false,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-blue-plumage",
      rarityId: 3,
      yield: 600,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10260.png",
      sellPrice: 3000,
      shiny: true,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-yellow-plumage",
      rarityId: 3,
      yield: 300,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10261.png",
      sellPrice: 1500,
      shiny: false,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-yellow-plumage",
      rarityId: 3,
      yield: 600,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10261.png",
      sellPrice: 3000,
      shiny: true,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-white-plumage",
      rarityId: 3,
      yield: 300,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10262.png",
      sellPrice: 1500,
      shiny: false,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 931,
      name: "squawkabilly-white-plumage",
      rarityId: 3,
      yield: 600,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10262.png",
      sellPrice: 3000,
      shiny: true,
      typeOneId: 1,
      typeTwoId: 18,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 925,
      name: "maushold-family-of-three",
      rarityId: 2,
      yield: 50,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10257.png",
      sellPrice: 250,
      shiny: false,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 925,
      name: "maushold-family-of-three",
      rarityId: 2,
      yield: 100,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10257.png",
      sellPrice: 500,
      shiny: true,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 8,
      regionId: 10,
    },
    {
      pokedexNumber: 978,
      name: "tatsugiri-droopy",
      rarityId: 2,
      yield: 50,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10258.png",
      sellPrice: 250,
      shiny: false,
      typeOneId: 16,
      typeTwoId: 7,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 978,
      name: "tatsugiri-droopy",
      rarityId: 2,
      yield: 100,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10258.png",
      sellPrice: 500,
      shiny: true,
      typeOneId: 16,
      typeTwoId: 7,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 978,
      name: "tatsugiri-stretchy",
      rarityId: 2,
      yield: 50,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10259.png",
      sellPrice: 250,
      shiny: false,
      typeOneId: 16,
      typeTwoId: 7,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 978,
      name: "tatsugiri-stretchy",
      rarityId: 2,
      yield: 100,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10259.png",
      sellPrice: 500,
      shiny: true,
      typeOneId: 16,
      typeTwoId: 7,
      generation: 9,
      habitatId: 4,
      regionId: 10,
    },
    {
      pokedexNumber: 982,
      name: "dudunsparce-three-segment",
      rarityId: 1,
      yield: 10,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10255.png",
      sellPrice: 50,
      shiny: false,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 5,
      regionId: 10,
    },
    {
      pokedexNumber: 982,
      name: "dudunsparce-three-segment",
      rarityId: 1,
      yield: 20,
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10255.png",
      sellPrice: 100,
      shiny: true,
      typeOneId: 1,
      typeTwoId: null,
      generation: 9,
      habitatId: 5,
      regionId: 10,
    },
  ]);

  console.log("done!");
};

void populateGenNineDB();
