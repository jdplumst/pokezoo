"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/utils/zod";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import { z } from "zod";
import TypeButton from "@/components/TypeButton";

export default function PokemonCard(props: {
  children: ReactNode;
  caught?: boolean;
  pokemon: {
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
        className={`relative w-80 rounded-2xl border-2 border-solid border-black p-4 shadow-xl hover:cursor-pointer ${pokemon.data.rarity === `Common` && `bg-common-unfocus shadow-common-unfocus hover:bg-common-focus`} ${pokemon.data.rarity === `Rare` && `bg-rare-unfocus shadow-rare-unfocus hover:bg-rare-focus`} ${pokemon.data.rarity === `Epic` && `bg-epic-unfocus shadow-epic-unfocus hover:bg-epic-focus`} ${pokemon.data.rarity === `Legendary` && `bg-legendary-unfocus shadow-legendary-unfocus hover:bg-legendary-focus`} ${pokemon.data.rarity === `Mega` && `bg-mega-unfocus shadow-mega-unfocus hover:bg-mega-focus`} ${pokemon.data.rarity === `Ultra Beast` && `bg-ub-unfocus shadow-ub-unfocus hover:bg-ub-focus`} ${pokemon.data.rarity === `Gigantamax` && `bg-gmax-unfocus shadow-gmax-unfocus hover:bg-gmax-focus`}`}
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader className="flex flex-col items-center">
            <SheetTitle className="font-2xl capitalize">
              {pokemon.data.shiny && "🌟"}{" "}
              {"#" + pokemon.data.pokedexNumber + ":"} {pokemon.data.name}
            </SheetTitle>
            <SheetDescription hidden={true}>
              A description of {pokemon.data.name}
            </SheetDescription>
            <div className="flex flex-col items-start text-lg">
              <Image
                src={pokemon.data.img}
                alt={pokemon.data.name}
                width={200}
                height={200}
              />

              <div className="flex gap-4 pb-5">
                <TypeButton type={pokemon.data.typeOne} />
                {pokemon.data.typeTwo && (
                  <TypeButton type={pokemon.data.typeTwo} />
                )}
              </div>
              <div>
                <b>Rarity:</b> {pokemon.data.rarity}
              </div>
              <div>
                <b>Yield:</b> P{pokemon.data.yield}
              </div>
              <div>
                <b>Sell Price:</b> P{pokemon.data.sellPrice}
              </div>
              <div>
                <b>Habitat:</b> {pokemon.data.habitat}
              </div>
              <div>
                <b>Region:</b> {pokemon.data.region}
              </div>
              <div>
                <b>Generation:</b> {pokemon.data.generation}
              </div>
              <div>
                <b>Shiny:</b> {pokemon.data.shiny ? "Shiny" : "Regular"}
              </div>
              <div>
                <b>Time of Day:</b>{" "}
                {pokemon.data.habitat === "Grassland"
                  ? "Day"
                  : pokemon.data.habitat === "Forest" ||
                      pokemon.data.habitat === "Cave"
                    ? "Night"
                    : "Anytime"}
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
