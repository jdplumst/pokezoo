import Image from "next/image";
import { z } from "zod";
import TypeButton from "~/components/type-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "~/lib/types";

export function PokemonSheet(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
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
    <Sheet open={props.open} onOpenChange={props.setOpen}>
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
              <b>Yield:</b> P{pokemon.data.yield.toLocaleString()}
            </div>
            <div>
              <b>Sell Price:</b> P{pokemon.data.sellPrice.toLocaleString()}
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
  );
}
