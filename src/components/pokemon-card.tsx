"use client";

import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "~/lib/types";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import { z } from "zod";
import { getRarityColor } from "~/lib/get-rarity-color";
import { PokemonSheet } from "~/components/pokemon-sheet";

export default function PokemonCard(props: {
  children: ReactNode;
  caught?: boolean;
  pokemon: {
    id: string;
    pokedexNumber: number;
    name: string;
    rarity: string;
    yield: number;
    img: string;
    sellPrice: number;
    shiny: boolean;
    typeOne: string;
    typeTwo: string | null;
    generation: number;
    habitat: string;
    region: string;
  };
}) {
  const [open, setOpen] = useState(false);

  const pokemonSchema = z.object({
    id: z.string(),
    pokedexNumber: z.number(),
    name: z.string(),
    rarity: ZodRarity,
    yield: z.number(),
    img: z.string(),
    sellPrice: z.number(),
    shiny: z.boolean(),
    typeOne: ZodSpeciesType,
    typeTwo: ZodSpeciesType.nullable(),
    generation: z.number(),
    habitat: ZodHabitat,
    region: ZodRegion,
  });
  const pokemon = pokemonSchema.safeParse(props.pokemon);
  if (pokemon.error) {
    return <div>Something went wrong.</div>;
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`relative w-80 rounded-2xl border-2 border-solid border-black p-4 shadow-xl hover:cursor-pointer ${getRarityColor(pokemon.data.rarity)}`}
      >
        {props.caught && (
          <Image
            src={
              "https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/poke-ball.png"
            }
            alt="Caught"
            width={40}
            height={40}
            className="absolute left-0 top-0 z-10"
          />
        )}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={pokemon.data.img}
            alt={pokemon.data.name}
            width={100}
            height={100}
            className="pixelated"
          />
          <div className="font-lg font-semibold capitalize">
            {pokemon.data.shiny && "🌟"}{" "}
            {"#" + pokemon.data.pokedexNumber + ":"} {pokemon.data.name}
          </div>
          <div className="flex flex-col items-center gap-0">
            <div>Rarity: {pokemon.data.rarity}</div>
            <div>Yield: P{pokemon.data.yield.toLocaleString()}</div>
            <div>Sell Price: P{pokemon.data.sellPrice.toLocaleString()}</div>
          </div>
          {props.children}
        </div>
      </div>

      <PokemonSheet
        open={open}
        setOpen={setOpen}
        storage={false}
        pokemon={pokemon.data}
      />
    </>
  );
}
