import { PokemonClient } from "pokenode-ts";
import { type ZodSpeciesType } from "@/src/zod";
import { z } from "zod";
import { capitalize } from "../helpers/capitalize";
import { db } from "@/src/server/db";
import { species } from "@/src/server/db/schema";

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

// Script to populate Species collection
const populateGenSevenDB = async () => {
  const api = new PokemonClient();

  for (let i = 722; i <= 809; i++) {
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
      generation: 7,
      habitatId: 1,
      regionId: 7,
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
      generation: 7,
      habitatId: 1,
      regionId: 7,
    });
  }
};

populateGenSevenDB();
