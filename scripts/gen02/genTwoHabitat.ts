//@ts-nocheck

import { prisma } from "../src/server/db";

// Script to populate Species collection
const populateGenTwoHabitatDB = async () => {
  for (let i = 11; i <= 251; i++) {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${i}/`,
    );
    const speciesData = await speciesResponse.json();

    const species = await prisma.species.updateMany({
      where: { pokedexNumber: i },
      data: { habitat: speciesData.habitat.name },
    });

    console.log(species);
  }
};

populateGenTwoHabitatDB();
