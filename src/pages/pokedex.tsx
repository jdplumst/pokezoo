import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import React, { Fragment, useEffect, useState } from "react";
import Loading from "../components/Loading";
import Topbar from "../components/Topbar";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useInView } from "react-intersection-observer";
import Dropdown, { type IDropdowns } from "../components/Dropdown";
import {
  RegionsList,
  RaritiesList,
  TypesList,
  HabitatList,
} from "../constants";
import { type z } from "zod";
import {
  type ZodSpecies,
  type ZodHabitat,
  type ZodRarity,
  type ZodRegion,
  type ZodSpeciesType,
} from "@/src/zod";
import ThemeWrapper from "../components/ThemeWrapper";

interface IPurchased {
  modal: boolean;
  species: z.infer<typeof ZodSpecies> | null;
}

export default function Pokedex() {
  const { status } = useSession({
    required: true,
  });

  const utils = trpc.useUtils();

  const { ref, inView } = useInView();

  const [purchased, setPurchased] = useState<IPurchased>({
    modal: false,
    species: null,
  });

  const [caught, setCaught] = useState({
    Caught: true,
    Uncaught: true,
  });
  const [shiny, setShiny] = useState(false);
  const [regions, setRegions] =
    useState<z.infer<typeof ZodRegion>[]>(RegionsList);
  const [rarities, setRarities] =
    useState<z.infer<typeof ZodRarity>[]>(RaritiesList);
  const [types, setTypes] =
    useState<z.infer<typeof ZodSpeciesType>[]>(TypesList);
  const [habitats, setHabitats] =
    useState<z.infer<typeof ZodHabitat>[]>(HabitatList);

  // Dropdown open state
  const [dropdowns, setDropdowns] = useState<IDropdowns>({
    Caught: false,
    Shiny: false,
    Region: false,
    Rarity: false,
    Type: false,
    Habitat: false,
  });

  const getPokedex = trpc.species.getPokedex.useInfiniteQuery(
    {
      limit: 50,
      caught: caught,
      shiny: shiny,
      regions: regions,
      rarities: rarities,
      types: types,
      habitats: habitats,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  // Infinite scroll
  useEffect(() => {
    if (inView && getPokedex.hasNextPage) {
      void getPokedex.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, getPokedex.hasNextPage]);

  // Handle Dropdowns State
  const handleDropdowns = (d: string) => {
    if (dropdowns[d]) {
      const newDropdowns: IDropdowns = {} as IDropdowns;
      Object.keys(dropdowns).forEach((x) => (newDropdowns[x] = false));
      setDropdowns(newDropdowns);
    } else {
      const newDropdowns: IDropdowns = {} as IDropdowns;
      Object.keys(dropdowns).forEach((x) =>
        x === d ? (newDropdowns[x] = true) : (newDropdowns[x] = false),
      );
      setDropdowns(newDropdowns);
    }
  };

  // Handle Caught State
  const handleCaught = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Uncaught" && !checked && !caught.Caught) {
      setCaught({ Caught: true, Uncaught: true });
    } else if (label === "Caught" && !checked && !caught.Uncaught) {
      setCaught({ Caught: true, Uncaught: true });
    } else {
      setCaught({ ...caught, [label]: checked });
    }
  };

  // Handle Shiny State
  const handleShiny = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if ((label === "Not Shiny" && checked) || (label === "Shiny" && !checked)) {
      setShiny(false);
    } else {
      setShiny(true);
    }
  };

  // Handle Region State
  const handleRegion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodRegion>;
    const checked = e.target.checked;
    if (label.startsWith("all") && regions === RegionsList) {
      setRegions([]);
    } else if (label.startsWith("all") && regions !== RegionsList) {
      setRegions(RegionsList);
    } else if (!checked && regions.includes(label)) {
      setRegions(regions.filter((r) => r !== label));
    } else {
      setRegions([...regions, label]);
    }
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodRarity>;
    const checked = e.target.checked;
    if (label.startsWith("all") && rarities === RaritiesList) {
      setRarities([]);
    } else if (label.startsWith("all") && rarities !== RaritiesList) {
      setRarities(RaritiesList);
    } else if (!checked && rarities.includes(label)) {
      setRarities(rarities.filter((r) => r !== label));
    } else {
      setRarities([...rarities, label]);
    }
  };

  // Handle Type State
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodSpeciesType>;
    const checked = e.target.checked;
    if (label.startsWith("all") && types === TypesList) {
      setTypes([]);
    } else if (label.startsWith("all") && types !== TypesList) {
      setTypes(TypesList);
    } else if (!checked && types.includes(label)) {
      setTypes(types.filter((t) => t !== label));
    } else {
      setTypes([...types, label]);
    }
  };

  // Handle Habitat State
  const handleHabitat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodHabitat>;
    const checked = e.target.checked;
    if (label.startsWith("all") && habitats === HabitatList) {
      setHabitats([]);
    } else if (label.startsWith("all") && habitats !== HabitatList) {
      setHabitats(HabitatList);
    } else if (!checked && habitats.includes(label)) {
      setHabitats(habitats.filter((h) => h !== label));
    } else {
      setHabitats([...habitats, label]);
    }
  };

  // Handle Purchase with Wildcards
  const handlePurchase = (species: z.infer<typeof ZodSpecies>) => {
    setPurchased({ modal: true, species: species });
    void utils.profile.getProfile.invalidate();
    void utils.species.getPokedex.invalidate();
  };

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Pokédex</title>
        <meta
          name="description"
          content="PokéZoo"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>
      <ThemeWrapper>
        <Sidebar page="Pokedex">
          <Topbar />
          <main className="p-4">
            <Dropdown
              dropdowns={dropdowns}
              handleDropdowns={handleDropdowns}
              caught={caught}
              shiny={shiny}
              regions={regions}
              rarities={rarities}
              types={types}
              habitats={habitats}
              handleCaught={handleCaught}
              handleShiny={handleShiny}
              handleRegion={handleRegion}
              handleRarity={handleRarity}
              handleType={handleType}
              handleHabitat={handleHabitat}
            />
            {getPokedex.isInitialLoading && (
              <div className="mx-auto pt-5">
                <LoadingSpinner />
              </div>
            )}
            <div className="cards grid justify-center gap-x-5 gap-y-5 pt-5">
              {getPokedex.data?.pages.map((p, index) => (
                <Fragment key={index}>
                  {p.pokemon.map((c) => (
                    <Card
                      key={c.id}
                      species={c}
                      caught={!!c.instance}
                      handlePurchase={handlePurchase}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
            {getPokedex.hasNextPage && (
              <div
                ref={ref}
                className="flex h-16 justify-center pt-4"
              >
                {getPokedex.isFetchingNextPage && <LoadingSpinner />}
              </div>
            )}
          </main>
        </Sidebar>
        {purchased.modal && (
          <Modal size={"Small"}>
            {"aeiou".includes(purchased.species!.name[0]) ? (
              <div className="text-center text-xl font-bold">
                You got an{" "}
                {purchased.species!.name[0].toUpperCase() +
                  purchased.species!.name.slice(1).toLowerCase()}
                !{" "}
              </div>
            ) : (
              <div className="text-center text-xl font-bold">
                You got a{" "}
                {purchased.species!.name[0].toUpperCase() +
                  purchased.species!.name.slice(1).toLowerCase()}
                !
              </div>
            )}
            <Card species={purchased.species!} />
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPurchased({ modal: false, species: null })}
                className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
              >
                Got it!
              </button>
            </div>
          </Modal>
        )}
      </ThemeWrapper>
    </>
  );
}
