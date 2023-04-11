import client from "../prisma/script";
import { Rarity } from "@prisma/client";

// Script to populate Species collection
const populateGenOneShinyDB = async () => {
  for (let i = 1; i <= 151; i++) {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${i}/`
    );
    const speciesData = await speciesResponse.json();
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${i}`
    );
    const pokemonData = await pokemonResponse.json();
    let rarity: Rarity = "Common";
    let income = 0;
    if (speciesData.is_legendary || speciesData.is_mythical) {
      rarity = "Legendary";
      income = 100;
    } else if (speciesData.growth_rate.name === "medium") {
      rarity = "Common";
      income = 10;
    } else if (
      speciesData.growth_rate.name === "medium-slow" ||
      speciesData.growth_rate.name === "fast"
    ) {
      rarity = "Rare";
      income = 20;
    } else if (
      speciesData.growth_rate.name === "slow" ||
      speciesData.growth_rate.name === "slow-then-very-fast" ||
      speciesData.growth_rate.name === "fast-then-very-slow"
    ) {
      rarity = "Epic";
      income = 50;
    }
    const species = await client.species.create({
      data: {
        pokedexNumber: i,
        name: pokemonData.name,
        rarity: rarity,
        yield: income * 2,
        img: pokemonData.sprites.front_shiny,
        sellPrice: income * 10,
        shiny: true
      }
    });
    console.log(species);
  }
};

populateGenOneShinyDB();
