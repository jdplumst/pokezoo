"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useSidebar } from "@/src/components/ui/sidebar";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "@/src/constants";
import { useToast } from "@/src/hooks/use-toast";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/src/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import PokemonCard from "./PokemonCard";
import Image from "next/image";

export default function PokedexGrid() {
  const { open } = useSidebar();

  const { toast } = useToast();

  const router = useRouter();

  const [caught, setCaught] = useState<
    "All Pokémon" | "Only Uncaught" | "Only Caught"
  >("All Pokémon");
  const [shiny, setShiny] = useState<"Regular" | "Shiny">("Regular");
  const [regions, setRegions] = useState(RegionsList);
  const [rarities, setRarities] = useState(RaritiesList);
  const [types, setTypes] = useState(TypesList);
  const [habitats, setHabitats] = useState(HabitatList);

  const pokemon = useInfiniteQuery({
    queryKey: ["pokemon", caught, shiny, regions, rarities, types, habitats],
    queryFn: async ({ pageParam = {} }) => {
      const res = await fetch("/api/pokedex", {
        method: "POST",
        body: JSON.stringify({
          limit: 50,
          caught: {
            Caught: caught === "All Pokémon" || caught === "Only Caught",
            Uncaught: caught === "All Pokémon" || caught === "Only Uncaught",
          },
          shiny: shiny === "Shiny" ? true : false,
          regions: regions,
          rarities: rarities,
          types: types,
          habitats: habitats,
          cursor: pageParam,
        }),
      });
      const data = await res.json();

      const resSchema = z.object({
        pokemon: z.array(
          z.object({
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
            instance: z.string().nullish(),
          }),
        ),
        nextCursor: z
          .object({
            pokedexNumber: z.number().nullish(),
            name: z.string().nullish(),
          })
          .nullish(),
      });

      const check = resSchema.parse(data);
      return check;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      pokemon.fetchNextPage();
    }
  }, [pokemon.fetchNextPage, inView]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{caught}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={caught}
                // @ts-ignore
                onValueChange={setCaught}
              >
                <DropdownMenuRadioItem value="All Pokémon">
                  All Pokémon
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Only Caught">
                  "Only Caught"
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Only Uncaught">
                  "Only Uncaught"
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{shiny}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={shiny}
                // @ts-ignore
                onValueChange={setShiny}
              >
                <DropdownMenuRadioItem
                  key={"Regular"}
                  value={"Regular"}
                >
                  {"Regular"}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  key={"Shiny"}
                  value={"Shiny"}
                >
                  {"Shiny"}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Regions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-72 w-56 overflow-y-scroll">
              <DropdownMenuLabel>Select Regions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {RegionsList.map((r) => (
                <DropdownMenuCheckboxItem
                  key={r}
                  checked={regions.some((region) => region === r)}
                  onCheckedChange={() => {
                    const i = regions.findIndex((region) => region === r);
                    if (i === -1) {
                      setRegions([...regions, r]);
                    } else {
                      setRegions(regions.filter((region) => region !== r));
                    }
                  }}
                >
                  {r}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Rarities</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-72 overflow-y-scroll">
              <DropdownMenuLabel>Select Rarities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {RaritiesList.map((r) => (
                <DropdownMenuCheckboxItem
                  key={r}
                  checked={rarities.some((rarity) => rarity === r)}
                  onCheckedChange={() => {
                    const i = rarities.findIndex((rarity) => rarity === r);
                    if (i === -1) {
                      setRarities([...rarities, r]);
                    } else {
                      setRarities(rarities.filter((rarity) => rarity !== r));
                    }
                  }}
                >
                  {r}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Types</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-72 overflow-y-scroll">
              <DropdownMenuLabel>Select Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {TypesList.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={types.some((type) => type === t)}
                  onCheckedChange={() => {
                    const i = types.findIndex((type) => type === t);
                    if (i === -1) {
                      setTypes([...types, t]);
                    } else {
                      setTypes(types.filter((type) => type !== t));
                    }
                  }}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Habitats</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-72 overflow-y-scroll">
              <DropdownMenuLabel>Select Habitats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {HabitatList.map((h) => (
                <DropdownMenuCheckboxItem
                  key={h}
                  checked={habitats.some((habitat) => habitat === h)}
                  onCheckedChange={() => {
                    const i = habitats.findIndex((habitat) => habitat === h);
                    if (i === -1) {
                      setHabitats([...habitats, h]);
                    } else {
                      setHabitats(habitats.filter((habitat) => habitat !== h));
                    }
                  }}
                >
                  {h}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-10">
        {pokemon.isInitialLoading && <LoadingSpinner />}
        <div
          className={`grid ${open ? `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` : `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`} gap-10`}
        >
          {pokemon.data?.pages.map((p, idx) => (
            <Fragment key={idx}>
              {p.pokemon.map((p) => (
                <PokemonCard
                  key={String(p.shiny) + p.pokedexNumber + p.name}
                  pokemon={p}
                  caught={!!p.instance}
                >
                  <div>Wildcard purchase here!</div>
                </PokemonCard>
              ))}
            </Fragment>
          ))}
        </div>
        <div ref={ref}>
          {pokemon.hasNextPage && pokemon.isFetchingNextPage && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
}
