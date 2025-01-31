"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "@/utils/constants";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/utils/zod";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import React, { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import PokemonCard from "./PokemonCard";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function GameGrid() {
  const { open } = useSidebar();

  const { toast } = useToast();

  const router = useRouter();

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

  const [sellIds, setSellIds] = useState<string[]>([]);

  const pokemon = useInfiniteQuery({
    queryKey: ["pokemon", sortedBy, shiny, regions, rarities, types, habitats],
    queryFn: async () => {
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
          cursor: {},
        }),
      });

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

      const check = resSchema.parse(await res.json());
      return check;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sell = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/pokemon/sell", {
        method: "POST",
        body: JSON.stringify({
          ids: ids,
        }),
      });

      const resSchema = z.union([
        z.object({ message: z.string(), error: z.undefined() }),
        z.object({ message: z.undefined(), error: z.string() }),
      ]);

      const check = resSchema.parse(await res.json().catch());
      return check;
    },
    onSuccess(data) {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        setSellIds([]);
        router.refresh();
        void pokemon.refetch();
      }
    },
    onError() {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      void pokemon.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.fetchNextPage, inView]);

  return (
    <>
      {sellIds.length > 0 && (
        <div className="sticky top-0 z-10 flex items-center justify-between border-2 border-solid border-black bg-secondary p-4">
          <span className="font-bold">
            You have selected {sellIds.length} Pokémon to sell.
          </span>

          <Button
            onClick={() => sell.mutate(sellIds)}
            disabled={sell.isLoading}
            className="rounded-lg border-2 border-black p-2 font-bold"
          >
            {sell.isLoading ? <LoadingSpinner /> : "Confirm Sell"}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{sortedBy}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={sortedBy}
                // @ts-expect-error expects string but is specific string
                onValueChange={setSortedBy}
              >
                {sortValues.map((s) => (
                  <DropdownMenuRadioItem key={s} value={s}>
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
                // @ts-expect-error expects string but is specific string
                onValueChange={setShiny}
              >
                <DropdownMenuRadioItem key={"Regular"} value={"Regular"}>
                  {"Regular"}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem key={"Shiny"} value={"Shiny"}>
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
              {p.instancesData.map((i) => (
                <PokemonCard key={i.instance.id} pokemon={i}>
                  {sellIds.some((s) => s === i.instance.id) ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSellIds(sellIds.filter((s) => s !== i.instance.id));
                      }}
                    >
                      Unsell
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSellIds([...sellIds, i.instance.id]);
                      }}
                      variant="destructive"
                    >
                      Sell
                    </Button>
                  )}
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
