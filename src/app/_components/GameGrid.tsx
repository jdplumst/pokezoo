"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useSidebar } from "@/src/components/ui/sidebar";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "@/src/constants";
import {
  ZodHabitat,
  ZodRarity,
  ZodRegion,
  ZodSort,
  ZodSpeciesType,
} from "@/src/zod";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import PokemonCard from "./PokemonCard";

export default function GameGrid() {
  const { open } = useSidebar();

  const sortValues = [
    "Newest",
    "Oldest",
    "Pokedex",
    "Pokedex Desc.",
    "Rarity",
    "Rarity Desc.",
  ] as const;

  const [sortedBy, setSortedBy] =
    useState<(typeof sortValues)[number]>("Newest");

  const [shiny, setShiny] = useState<"Regular" | "Shiny">("Regular");
  const [regions, setRegions] = useState(RegionsList);
  const [rarities, setRarities] = useState(RaritiesList);
  const [types, setTypes] = useState(TypesList);
  const [habitats, setHabitats] = useState(HabitatList);

  const pokemon = useInfiniteQuery({
    queryKey: ["pokemon", sortedBy, shiny, regions, rarities, types, habitats],
    queryFn: async ({ pageParam = {} }) => {
      const res = await fetch("/api/game", {
        method: "POST",
        body: JSON.stringify({
          limit: 50,
          order: sortedBy,
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
        instancesData: z.array(
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
            instance: z.object({
              id: z.string(),
              userId: z.string(),
              speciesId: z.string(),
              createDate: z.string(),
              modifyDate: z.string(),
            }),
          }),
        ),
        nextCursor: z
          .object({
            modifyDate: z.string(),
            pokedexNumber: z.number().nullish(),
            name: z.string().nullish(),
            rarity: z.string().nullish(),
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
              <Button variant="outline">{sortedBy}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={sortedBy}
                // @ts-ignore
                onValueChange={setSortedBy}
              >
                {sortValues.map((s) => (
                  <DropdownMenuRadioItem
                    key={s}
                    value={s}
                  >
                    {s}
                  </DropdownMenuRadioItem>
                ))}
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
      <div className="flex items-center justify-center">
        <div
          className={`grid ${open ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` : `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`} gap-10`}
        >
          {pokemon.data?.pages.map((p, idx) => (
            <Fragment key={idx}>
              {p.instancesData.map((i) => (
                <PokemonCard
                  key={i.instance.id}
                  pokemon={i}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("yo");
                    }}
                    variant="destructive"
                  >
                    Sell
                  </Button>
                </PokemonCard>
              ))}
            </Fragment>
          ))}
          <div ref={ref}></div>
        </div>
      </div>
    </>
  );
}
