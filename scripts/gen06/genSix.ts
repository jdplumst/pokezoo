// @ts-nocheck

import { PokemonClient } from "pokenode-ts";
import { type ZodRarity, type ZodSpeciesType } from "@/src/zod";
import { z } from "zod";
import { capitalize } from "../helpers/capitalize";
import { db } from "@/src/server/db";
import { species } from "@/src/server/db/schema";

// Script to populate Species collection
const populateGenSixDB = async () => {
  const api = new PokemonClient();

  for (let i = 650; i <= 721; i++) {
    const pokemonData = await api.getPokemonById(i);
    const speciesData = await api.getPokemonSpeciesById(i);

    let rarity: z.infer<typeof ZodRarity> = "Common";
    let income = 0;
    let sell = 0;

    if (speciesData.is_legendary || speciesData.is_mythical) {
      rarity = "Legendary";
      income = 1000;
      sell = 5000;
    } else if (speciesData.growth_rate.name === "medium") {
      rarity = "Common";
      income = 10;
      sell = 50;
    } else if (
      speciesData.growth_rate.name === "medium-slow" ||
      speciesData.growth_rate.name === "fast"
    ) {
      rarity = "Rare";
      income = 50;
      sell = 250;
    } else if (
      speciesData.growth_rate.name === "slow" ||
      speciesData.growth_rate.name === "slow-then-very-fast" ||
      speciesData.growth_rate.name === "fast-then-very-slow"
    ) {
      rarity = "Epic";
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

    await db.insert(species).values({
      pokedexNumber: i,
      name: pokemonData.name,
      rarity: rarity,
      yield: income,
      img: pokemonData.sprites.front_default!,
      sellPrice: sell,
      shiny: false,
      typeOne: typeOne,
      typeTwo: typeTwo,
      generation: 6,
      habitat: "Cave",
      region: "Kalos",
    });

    await db.insert(species).values({
      pokedexNumber: i,
      name: pokemonData.name,
      rarity: rarity,
      yield: income * 2,
      img: pokemonData.sprites.front_shiny!,
      sellPrice: sell * 2,
      shiny: true,
      typeOne: typeOne,
      typeTwo: typeTwo,
      generation: 6,
      habitat: "Cave",
      region: "Kalos",
    });
  }
};

populateGenSixDB();
