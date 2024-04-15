//@ts-nocheck

import { prisma } from "../../src/server/db";
import { Rarity } from "@prisma/client";

// Script to populate Species collection
const populateGenFourDB = async () => {
  for (let i = 387; i <= 493; i++) {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${i}/`,
    );
    const speciesData = await speciesResponse.json();
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${i}`,
    );
    const pokemonData = await pokemonResponse.json();
    let rarity: Rarity = "Common";
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
    if (pokemonData.types.length === 2) {
      const species = await prisma.species.create({
        data: {
          pokedexNumber: i,
          name: pokemonData.name,
          rarity: rarity,
          yield: income,
          img: pokemonData.sprites.front_default,
          sellPrice: sell,
          shiny: false,
          typeOne: pokemonData.types[0].type.name,
          typeTwo: pokemonData.types[1].type.name,
          generation: 4,
          habitat: "null",
        },
      });
      const shinySpecies = await prisma.species.create({
        data: {
          pokedexNumber: i,
          name: pokemonData.name,
          rarity: rarity,
          yield: income * 2,
          img: pokemonData.sprites.front_shiny,
          sellPrice: sell * 2,
          shiny: true,
          typeOne: pokemonData.types[0].type.name,
          typeTwo: pokemonData.types[1].type.name,
          generation: 4,
          habitat: "null",
        },
      });
      console.log(species);
      console.log(shinySpecies);
    } else {
      const species = await prisma.species.create({
        data: {
          pokedexNumber: i,
          name: pokemonData.name,
          rarity: rarity,
          yield: income,
          img: pokemonData.sprites.front_default,
          sellPrice: sell,
          shiny: false,
          typeOne: pokemonData.types[0].type.name,
          generation: 4,
          habitat: "null",
        },
      });
      const shinySpecies = await prisma.species.create({
        data: {
          pokedexNumber: i,
          name: pokemonData.name,
          rarity: rarity,
          yield: income * 2,
          img: pokemonData.sprites.front_shiny,
          sellPrice: sell * 2,
          shiny: true,
          typeOne: pokemonData.types[0].type.name,
          generation: 4,
          habitat: "null",
        },
      });
      console.log(species);
      console.log(shinySpecies);
    }
  }
};

populateGenFourDB();
