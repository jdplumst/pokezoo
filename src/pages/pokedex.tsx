import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import React, { Fragment, useEffect, useState } from "react";
import Loading from "../components/Loading";
import DrowpdownItem from "../components/DropdownItem";
import Topbar from "../components/Topbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";
import { Habitat, Rarity, Region, Species, SpeciesType } from "@prisma/client";
import Modal from "../components/Modal";
import { useInView } from "react-intersection-observer";

const RegionsList: Region[] = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"];
const RaritiesList: Rarity[] = ["Common", "Rare", "Epic", "Legendary"];
const TypesList: SpeciesType[] = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water"
];
const HabitatList: Habitat[] = [
  "Cave",
  "Forest",
  "Grassland",
  "Mountain",
  "Rare",
  "RoughTerrain",
  "Sea",
  "Urban",
  "WatersEdge"
];

interface IPurchased {
  modal: boolean;
  species: Species | null;
}

interface IDropdowns {
  Caught: boolean;
  Shiny: boolean;
  Region: boolean;
  Rarity: boolean;
  Type: boolean;
  Habitat: boolean;
  [key: string]: boolean;
}

export default function Pokedex() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const utils = trpc.useContext();

  const { ref, inView } = useInView();

  const [time, setTime] = useState<Time>("night");
  const [timeLoading, setTimeLoading] = useState(true);

  const [purchased, setPurchased] = useState<IPurchased>({
    modal: false,
    species: null
  });

  const [commonCards, setCommonCards] = useState(0);
  const [rareCards, setRareCards] = useState(0);
  const [epicCards, setEpicCards] = useState(0);
  const [legendaryCards, setLegendaryCards] = useState(0);
  const [totalYield, setTotalYield] = useState(0);
  const [instanceCount, setInstanceCount] = useState(0);

  const [caught, setCaught] = useState({
    Caught: true,
    Uncaught: true
  });
  const [shiny, setShiny] = useState(false);
  const [regions, setRegions] = useState<Region[]>(RegionsList);
  const [rarities, setRarities] = useState<Rarity[]>(RaritiesList);
  const [types, setTypes] = useState<SpeciesType[]>(TypesList);
  const [habitats, setHabitats] = useState<Habitat[]>(HabitatList);

  // Dropdown open state
  const [dropdowns, setDropdowns] = useState<IDropdowns>({
    Caught: false,
    Shiny: false,
    Region: false,
    Rarity: false,
    Type: false,
    Habitat: false
  });

  const getPokedex = trpc.species.getPokedex.useInfiniteQuery(
    {
      limit: 50,
      caught: caught,
      shiny: shiny,
      regions: regions,
      rarities: rarities,
      types: types,
      habitats: habitats
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  // Set time
  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setTimeLoading(false);
  }, []);

  // Set user state
  useEffect(() => {
    if (!session) return;
    setCommonCards(session.user.commonCards);
    setRareCards(session.user.rareCards);
    setEpicCards(session.user.epicCards);
    setLegendaryCards(session.user.legendaryCards);
    setTotalYield(session.user.totalYield);
    setInstanceCount(session.user.instanceCount);
  }, [session]);

  // Infinite scroll
  useEffect(() => {
    if (inView && getPokedex.hasNextPage) {
      getPokedex.fetchNextPage();
    }
  }, [inView, getPokedex.hasNextPage]);

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
    const label = e.target.labels![0].htmlFor as Region;
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
    console.log(regions);
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as Rarity;
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
    const label = e.target.labels![0].htmlFor as SpeciesType;
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
    const label = e.target.labels![0].htmlFor as
      | Habitat
      | "Waters-Edge"
      | "Rough-Terrain";
    const checked = e.target.checked;
    if (label.startsWith("all") && habitats === HabitatList) {
      setHabitats([]);
    } else if (label.startsWith("all") && habitats !== HabitatList) {
      setHabitats(HabitatList);
    } else if (
      label !== "Waters-Edge" &&
      label !== "Rough-Terrain" &&
      habitats.includes(label)
    ) {
      setHabitats(habitats.filter((h) => h !== label));
    } else if (
      label === "Waters-Edge" &&
      !checked &&
      habitats.includes("WatersEdge")
    ) {
      setHabitats(habitats.filter((h) => h !== "WatersEdge"));
    } else if (
      label === "Rough-Terrain" &&
      !checked &&
      habitats.includes("RoughTerrain")
    ) {
      setHabitats(habitats.filter((h) => h !== "RoughTerrain"));
    } else if (
      label === "Waters-Edge" &&
      checked &&
      !habitats.includes("WatersEdge")
    ) {
      setHabitats([...habitats, "WatersEdge"]);
    } else if (
      label === "Rough-Terrain" &&
      checked &&
      !habitats.includes("RoughTerrain")
    ) {
      setHabitats([...habitats, "RoughTerrain"]);
    } else {
      setHabitats([...habitats, label as Habitat]);
    }
  };

  // Handle Purchase with Wildcards
  const handlePurchase = (species: Species) => {
    setPurchased({ modal: true, species: species });
    if (species.rarity === "Common" && !species.shiny) {
      setCommonCards((prev) => prev - 10);
    } else if (species.rarity === "Common" && species.shiny) {
      setCommonCards((prev) => prev - 100);
    } else if (species.rarity === "Rare" && !species.shiny) {
      setRareCards((prev) => prev - 10);
    } else if (species.rarity === "Rare" && species.shiny) {
      setRareCards((prev) => prev - 100);
    } else if (species.rarity === "Epic" && !species.shiny) {
      setEpicCards((prev) => prev - 10);
    } else if (species.rarity === "Epic" && species.shiny) {
      setEpicCards((prev) => prev - 100);
    } else if (species.rarity === "Legendary" && !species.shiny) {
      setLegendaryCards((prev) => prev - 10);
    } else if (species.rarity === "Legendary" && species.shiny) {
      setLegendaryCards((prev) => prev - 100);
    }
    setTotalYield((prev) => prev + species.yield);
    setInstanceCount((prev) => prev + 1);
    utils.instance.getInstances.invalidate();
  };

  if (status === "loading" || timeLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Pokédex</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Pokedex">
          <Topbar
            username={session.user.username}
            balance={session.user.balance}
            totalYield={totalYield}
            totalCards={instanceCount}
            commonCards={commonCards}
            rareCards={rareCards}
            epicCards={epicCards}
            legendaryCards={legendaryCards}
          />
          <main className="p-4">
            {session.user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <div className="flex justify-center gap-5">
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Caught"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-red-btn-unfocus p-2 font-bold outline-none">
                  Select Caught
                </button>
                {dropdowns.Caught && (
                  <ul className="absolute z-10 w-48">
                    <li>
                      <DrowpdownItem
                        label="Caught"
                        fn={handleCaught}
                        checked={caught.Caught}
                        colour="red"
                      />
                    </li>
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Uncaught"
                        fn={handleCaught}
                        checked={caught.Uncaught}
                        colour="red"
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Shiny"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-purple-btn-unfocus p-2 font-bold outline-none">
                  Select Shiny
                </button>
                {dropdowns.Shiny && (
                  <ul className="absolute z-10 w-48">
                    <li>
                      <DrowpdownItem
                        label={"Not Shiny"}
                        fn={handleShiny}
                        checked={!shiny}
                        colour="purple"
                      />
                    </li>
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Shiny"
                        fn={handleShiny}
                        checked={shiny}
                        colour="purple"
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Region"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-green-btn-unfocus p-2 font-bold outline-none">
                  Select Region
                </button>
                {dropdowns.Region && (
                  <ul className="absolute z-10 w-48">
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Select All"
                        fn={handleRegion}
                        checked={regions === RegionsList}
                        colour={"green"}
                      />
                    </li>
                    {Object.values(Region).map((r, index) => (
                      <li
                        className={`${
                          index === Object.values(Region).length - 1 &&
                          `border-b-2`
                        } border-black`}>
                        <DrowpdownItem
                          label={r}
                          fn={handleRegion}
                          checked={regions.includes(r)}
                          colour={"green"}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Rarity"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-orange-btn-unfocus p-2 font-bold outline-none">
                  Select Rarity
                </button>
                {dropdowns.Rarity && (
                  <ul className="absolute z-10 w-48">
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Select All"
                        fn={handleRarity}
                        checked={rarities === RaritiesList}
                        colour="orange"
                      />
                    </li>
                    {Object.values(Rarity).map((r, index) => (
                      <li
                        className={`${
                          index === Object.values(Rarity).length - 1 &&
                          `border-b-2 border-black`
                        }`}>
                        <DrowpdownItem
                          label={r}
                          fn={handleRarity}
                          checked={rarities.includes(r)}
                          colour="orange"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Type"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-blue-btn-unfocus p-2 font-bold outline-none">
                  Select Type
                </button>
                {dropdowns.Type && (
                  <ul className="absolute z-10 w-48">
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Select All"
                        fn={handleType}
                        checked={types === TypesList}
                        colour="blue"
                      />
                    </li>
                    {Object.values(SpeciesType).map((t, index) => (
                      <li
                        className={`${
                          index === Object.values(SpeciesType).length - 1 &&
                          `border-b-2 border-black`
                        }`}>
                        <DrowpdownItem
                          label={t}
                          fn={handleType}
                          checked={types.includes(t)}
                          colour="blue"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() =>
                    setDropdowns((p) => {
                      let res = Object.assign({}, p);
                      Object.keys(res).forEach((item) => {
                        item === "Habitat"
                          ? (res[item] = !res[item])
                          : (res[item] = false);
                      });
                      return res;
                    })
                  }
                  className="w-full border-2 border-black bg-lime-btn-unfocus p-2 font-bold outline-none">
                  Select Habitat
                </button>
                {dropdowns.Habitat && (
                  <ul className="absolute z-10 w-48">
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Select All"
                        fn={handleHabitat}
                        checked={habitats === HabitatList}
                        colour="lime"
                      />
                    </li>
                    {Object.values(Habitat).map((h, index) => (
                      <li
                        className={`${
                          index === Object.values(SpeciesType).length - 10 &&
                          `border-b-2 border-black`
                        }`}>
                        <DrowpdownItem
                          label={
                            h === "WatersEdge"
                              ? "Waters-Edge"
                              : h === "RoughTerrain"
                              ? "Rough-Terrain"
                              : h
                          }
                          fn={handleHabitat}
                          checked={habitats.includes(h)}
                          colour="lime"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {getPokedex.isInitialLoading && (
              <div className="mx-auto pt-5">
                <LoadingSpinner />
              </div>
            )}
            <div className="cards grid justify-center gap-x-3 gap-y-5 pt-5">
              {getPokedex.data?.pages.map((p) => (
                <Fragment key={p.nextCursor}>
                  {p.pokemon.map((c) => (
                    <Card
                      key={c.id}
                      species={c}
                      caught={c.instances.length > 0}
                      handlePurchase={handlePurchase}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
            {getPokedex.hasNextPage && (
              <div ref={ref} className="flex h-16 justify-center pt-4">
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
                className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                Got it!
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
