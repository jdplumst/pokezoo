import { prisma } from "@/src/server/db";

// Script to populate Species collection
const populateGenOneDB = async () => {
  for (let i = 1; i <= 151; i++) {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${i}`
    );
    const pokemonData = await pokemonResponse.json();
    let species;
    if (pokemonData.types.length === 2) {
      species = await prisma.species.updateMany({
        where: { pokedexNumber: i },
        data: {
          typeOne: pokemonData.types[0].type.name,
          typeTwo: pokemonData.types[1].type.name
        }
      });
    } else {
      species = await prisma.species.updateMany({
        where: { pokedexNumber: i },
        data: { typeOne: pokemonData.types[0].type.name }
      });
    }
    console.log(species);
  }
};

populateGenOneDB();
