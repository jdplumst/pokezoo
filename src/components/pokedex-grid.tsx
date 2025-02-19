"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "~/lib/constants";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Fragment, useActionState, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "~/components/loading-spinner";
import PokemonCard from "~/components/pokemon-card";
import Wildcard from "~/components/wildcard";
import { purchasePokemonAction } from "~/server/actions/pokedex";
import { api } from "~/trpc/react";

export default function PokedexGrid() {
  const { open } = useSidebar();

  const { toast } = useToast();

  const router = useRouter();

  const utils = api.useUtils();

  const [caught, setCaught] = useState<
    "All Pokémon" | "Only Uncaught" | "Only Caught"
  >("All Pokémon");
  const [shiny, setShiny] = useState<"Regular" | "Shiny">("Regular");
  const [regions, setRegions] = useState(RegionsList);
  const [rarities, setRarities] = useState(RaritiesList);
  const [types, setTypes] = useState(TypesList);
  const [habitats, setHabitats] = useState(HabitatList);

  const pokemon = api.pokedex.getPokedex.useInfiniteQuery(
    {
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
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && pokemon.hasNextPage) {
      void pokemon.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon.fetchNextPage, inView, pokemon.hasNextPage]);

  const [data, action, isPending] = useActionState(
    purchasePokemonAction,
    undefined,
  );
  const [purchaseId, setPurhcaseId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      if ("error" in data) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.message) {
        toast({
          title: "Success!",
          description: data.message,
        });
        setPurhcaseId(null);
        router.refresh();
        void utils.pokedex.getPokedex.invalidate();
        void utils.game.getPokemon.invalidate();
      }
    }
  }, [data, toast, router, utils.pokedex.getPokedex, utils.game.getPokemon]);

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
                // @ts-expect-error expects string but is specific string
                onValueChange={setCaught}
              >
                <DropdownMenuRadioItem value="All Pokémon">
                  All Pokémon
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Only Caught">
                  Only Caught
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Only Uncaught">
                  Only Uncaught
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
              <DropdownMenuCheckboxItem
                checked={regions === RegionsList}
                onCheckedChange={() => {
                  setRegions((prev) =>
                    prev === RegionsList ? [] : RegionsList,
                  );
                }}
              >
                Select All
              </DropdownMenuCheckboxItem>
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
              <DropdownMenuCheckboxItem
                checked={rarities === RaritiesList}
                onCheckedChange={() => {
                  setRarities((prev) =>
                    prev === RaritiesList ? [] : RaritiesList,
                  );
                }}
              >
                Select All
              </DropdownMenuCheckboxItem>
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
              <DropdownMenuCheckboxItem
                checked={types === TypesList}
                onCheckedChange={() => {
                  setTypes((prev) => (prev === TypesList ? [] : TypesList));
                }}
              >
                Select All
              </DropdownMenuCheckboxItem>
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
              <DropdownMenuCheckboxItem
                checked={habitats === HabitatList}
                onCheckedChange={() => {
                  setHabitats((prev) =>
                    prev === HabitatList ? [] : HabitatList,
                  );
                }}
              >
                Select All
              </DropdownMenuCheckboxItem>
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
                  {p.rarity === "Common" ||
                  p.rarity === "Rare" ||
                  p.rarity === "Epic" ||
                  p.rarity === "Legendary" ? (
                    <form action={action}>
                      <input type="hidden" name="speciesId" value={p.id} />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPurhcaseId(p.id);
                        }}
                        type="submit"
                        variant="destructive"
                        disabled={isPending && purchaseId === p.id}
                        className="font-lg flex gap-1 font-semibold"
                      >
                        <Wildcard wildcard={p.rarity} width={25} height={25} />
                        {p.shiny ? `100` : `10`}
                      </Button>
                    </form>
                  ) : (
                    <Button variant="destructive">N/A</Button>
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
