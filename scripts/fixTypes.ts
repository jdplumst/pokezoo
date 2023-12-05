// @ts-nocheck

import { prisma } from "../src/server/db";

// Script to populate Species collection
const fixTypes = async () => {
  for (let i = 1; i <= 493; i++) {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${i}`
    );
    const pokemonData = await pokemonResponse.json();
    if (pokemonData.types.length === 2) {
      const species = await prisma.species.updateMany({
        where: { pokedexNumber: i },
        data: {
          typeOne:
            pokemonData.types[0].type.name[0].toUpperCase() +
            pokemonData.types[0].type.name.slice(1).toLowerCase(),
          typeTwo:
            pokemonData.types[1].type.name[0].toUpperCase() +
            pokemonData.types[1].type.name.slice(1).toLowerCase()
        }
      });
      console.log(species);
    } else {
      const species = await prisma.species.updateMany({
        where: { pokedexNumber: i },
        data: {
          typeOne:
            pokemonData.types[0].type.name[0].toUpperCase() +
            pokemonData.types[0].type.name.slice(1).toLowerCase()
        }
      });
      console.log(species);
    }
  }
};

fixTypes();
