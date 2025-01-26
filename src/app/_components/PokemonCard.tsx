"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/src/zod";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { z } from "zod";
import TypeButton from "./TypeButton";

export default function PokemonCard(props: {
  children: ReactNode;
  caught?: boolean;
  pokemon: {
    pokedexNumber: number;
    name: string;
    rarity: z.infer<typeof ZodRarity>;
    yield: number;
    img: string;
    sellPrice: number;
    shiny: boolean;
    typeOne: z.infer<typeof ZodSpeciesType>;
    typeTwo: z.infer<typeof ZodSpeciesType> | null;
    generation: number;
    habitat: z.infer<typeof ZodHabitat>;
    region: z.infer<typeof ZodRegion>;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`w-80 rounded-2xl border-2 border-solid border-black p-4 shadow-xl hover:cursor-pointer ${props.pokemon.rarity === `Common` && `bg-common-unfocus shadow-common-unfocus hover:bg-common-focus`} ${props.pokemon.rarity === `Rare` && `bg-rare-unfocus shadow-rare-unfocus hover:bg-rare-focus`} ${props.pokemon.rarity === `Epic` && `bg-epic-unfocus shadow-epic-unfocus hover:bg-epic-focus`} ${props.pokemon.rarity === `Legendary` && `bg-legendary-unfocus shadow-legendary-unfocus hover:bg-legendary-focus`} ${props.pokemon.rarity === `Mega` && `bg-mega-unfocus shadow-mega-unfocus hover:bg-mega-focus`} ${props.pokemon.rarity === `Ultra Beast` && `bg-ub-unfocus shadow-ub-unfocus hover:bg-ub-focus`} ${props.pokemon.rarity === `Gigantamax` && `bg-gmax-unfocus shadow-gmax-unfocus hover:bg-gmax-focus`}`}
      >
        {props.caught && (
          <Image
            src={
              "https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/poke-ball.png"
            }
            alt="Caught"
            width={40}
            height={40}
            className="relative left-0 top-0"
          />
        )}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={props.pokemon.img}
            alt={props.pokemon.name}
            width={100}
            height={100}
          />
          <div className="font-lg font-semibold capitalize">
            {props.pokemon.shiny && "🌟"}{" "}
            {"#" + props.pokemon.pokedexNumber + ":"} {props.pokemon.name}
          </div>
          <div className="flex flex-col items-center gap-0">
            <div>Rarity: {props.pokemon.rarity}</div>
            <div>Yield: P{props.pokemon.yield}</div>
            <div>Sell Price: P{props.pokemon.sellPrice}</div>
          </div>
          {props.children}
        </div>
      </div>

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent>
          <SheetHeader className="flex flex-col items-center">
            <SheetTitle className="font-2xl capitalize">
              {props.pokemon.shiny && "🌟"}{" "}
              {"#" + props.pokemon.pokedexNumber + ":"} {props.pokemon.name}
            </SheetTitle>
            <SheetDescription hidden={true}>
              A description of {props.pokemon.name}
            </SheetDescription>
            <div className="flex flex-col items-start text-lg">
              <Image
                src={props.pokemon.img}
                alt={props.pokemon.name}
                width={200}
                height={200}
              />

              <div className="flex gap-4 pb-5">
                <TypeButton type={props.pokemon.typeOne} />
                {props.pokemon.typeTwo && (
                  <TypeButton type={props.pokemon.typeTwo} />
                )}
              </div>
              <div>
                <b>Rarity:</b> {props.pokemon.rarity}
              </div>
              <div>
                <b>Yield:</b> P{props.pokemon.yield}
              </div>
              <div>
                <b>Sell Price:</b> P{props.pokemon.sellPrice}
              </div>
              <div>
                <b>Habitat:</b> {props.pokemon.habitat}
              </div>
              <div>
                <b>Region:</b> {props.pokemon.region}
              </div>
              <div>
                <b>Generation:</b> {props.pokemon.generation}
              </div>
              <div>
                <b>Shiny:</b> {props.pokemon.shiny ? "Shiny" : "Regular"}
              </div>
              <div>
                <b>Time of Day:</b>{" "}
                {props.pokemon.habitat === "Grassland"
                  ? "Day"
                  : props.pokemon.habitat === "Forest" ||
                      props.pokemon.habitat === "Cave"
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
