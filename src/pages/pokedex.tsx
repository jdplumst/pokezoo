import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import DrowpdownItem from "../components/DropdownItem";
import Topbar from "../components/Topbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";
import { Habitat, Rarity, Region, Species, SpeciesType } from "@prisma/client";

interface ICaught {
  Caught: boolean;
  Uncaught: boolean;
}
interface IShiny {
  "Not Shiny": boolean;
  "Shiny": boolean;
}

interface IRegion {
  All: boolean;
  Kanto: boolean;
  Johto: boolean;
  Hoenn: boolean;
  Sinnoh: boolean;
  Unova: boolean;
}

interface IRarity {
  All: boolean;
  Common: boolean;
  Rare: boolean;
  Epic: boolean;
  Legendary: boolean;
}

interface IType {
  All: boolean;
  Normal: boolean;
  Grass: boolean;
  Bug: boolean;
  Fire: boolean;
  Electric: boolean;
  Ground: boolean;
  Water: boolean;
  Fighting: boolean;
  Poison: boolean;
  Rock: boolean;
  Ice: boolean;
  Ghost: boolean;
  Psychic: boolean;
  Fairy: boolean;
  Dark: boolean;
  Dragon: boolean;
  Steel: boolean;
  Flying: boolean;
}

interface IHabitat {
  "All": boolean;
  "Grassland": boolean;
  "Forest": boolean;
  "Waters-Edge": boolean;
  "Sea": boolean;
  "Cave": boolean;
  "Mountain": boolean;
  "Rough-Terrain": boolean;
  "Urban": boolean;
  "Rare": boolean;
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

  const { data: speciesData } = trpc.species.getSpecies.useQuery({
    order: "pokedex"
  });

  const { data: instanceData, isLoading: instanceLoading } =
    trpc.instance.getInstances.useQuery({
      distinct: true,
      order: "Oldest"
    });

  const [time, setTime] = useState<Time>("night");
  const [timeLoading, setTimeLoading] = useState(true);

  const [cards, setCards] = useState<Species[]>();
  const [cardsLoading, setCardsLoading] = useState(true);

  const [caught, setCaught] = useState<ICaught>({
    Caught: true,
    Uncaught: true
  });
  const [shiny, setShiny] = useState<IShiny>({
    "Not Shiny": true,
    "Shiny": false
  });
  const [regions, setRegions] = useState<IRegion>({
    All: true,
    Kanto: true,
    Johto: true,
    Hoenn: true,
    Sinnoh: true,
    Unova: true
  });
  const [rarities, setRarities] = useState<IRarity>({
    All: true,
    Common: true,
    Rare: true,
    Epic: true,
    Legendary: true
  });
  const [types, setTypes] = useState<IType>({
    All: true,
    Normal: true,
    Grass: true,
    Bug: true,
    Fire: true,
    Electric: true,
    Ground: true,
    Water: true,
    Fighting: true,
    Poison: true,
    Rock: true,
    Ice: true,
    Ghost: true,
    Psychic: true,
    Fairy: true,
    Dark: true,
    Dragon: true,
    Steel: true,
    Flying: true
  });
  const [habitats, setHabitats] = useState<IHabitat>({
    "All": true,
    "Grassland": true,
    "Forest": true,
    "Waters-Edge": true,
    "Sea": true,
    "Cave": true,
    "Mountain": true,
    "Rough-Terrain": true,
    "Urban": true,
    "Rare": true
  });

  // Dropdown open state
  const [dropdowns, setDropdowns] = useState<IDropdowns>({
    Caught: false,
    Shiny: false,
    Region: false,
    Rarity: false,
    Type: false,
    Habitat: false
  });

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

  // Set intitial cards
  useEffect(() => {
    if (!speciesData) return;
    setCards(speciesData!.species!.filter((s) => !s.shiny));
    setCardsLoading(false);
  }, [speciesData]);

  // Handle Caught State
  const handleCaught = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    setCaught({ ...caught, [label]: checked });
  };

  // Handle Shiny State
  const handleShiny = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Not Shiny") {
      setShiny({ "Shiny": !checked, "Not Shiny": checked });
    } else if (label === "Shiny") {
      setShiny({ "Shiny": checked, "Not Shiny": !checked });
    }
  };

  // Handle Region State
  const handleRegion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label.startsWith("all")) {
      setRegions({
        All: checked,
        Kanto: checked,
        Johto: checked,
        Hoenn: checked,
        Sinnoh: checked,
        Unova: checked
      });
    } else {
      setRegions({ ...regions, [label]: checked });
    }
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label.startsWith("all")) {
      setRarities({
        All: checked,
        Common: checked,
        Rare: checked,
        Epic: checked,
        Legendary: checked
      });
    } else {
      setRarities({ ...rarities, [label]: checked });
    }
  };

  // Handle Type State
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label.startsWith("all")) {
      setTypes({
        All: checked,
        Normal: checked,
        Grass: checked,
        Bug: checked,
        Fire: checked,
        Electric: checked,
        Ground: checked,
        Water: checked,
        Fighting: checked,
        Poison: checked,
        Rock: checked,
        Ice: checked,
        Ghost: checked,
        Psychic: checked,
        Fairy: checked,
        Dark: checked,
        Dragon: checked,
        Steel: checked,
        Flying: checked
      });
    } else {
      setTypes({ ...types, [label]: checked });
    }
  };

  // Handle Habitat State
  const handleHabitat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label.startsWith("all")) {
      setHabitats({
        "All": checked,
        "Grassland": checked,
        "Forest": checked,
        "Waters-Edge": checked,
        "Sea": checked,
        "Cave": checked,
        "Mountain": checked,
        "Rough-Terrain": checked,
        "Urban": checked,
        "Rare": checked
      });
    } else {
      setHabitats({ ...habitats, [label]: checked });
    }
  };

  const filterSpecies = () => {
    // Filter based on shiny
    if (shiny.Shiny) {
      setCards(speciesData?.species.filter((s) => s.shiny));
    } else if (shiny["Not Shiny"]) {
      setCards(speciesData?.species.filter((s) => !s.shiny));
    }

    // Filter based on caught
    if (caught.Caught && caught.Uncaught) {
      setCards((p) => p);
    } else if (caught.Caught) {
      const instanceMap = instanceData?.instances.map((i) => i.speciesId);
      setCards((p) => {
        return p?.filter((item) => instanceMap?.includes(item.id));
      });
    } else if (caught.Uncaught) {
      const instanceMap = instanceData?.instances.map((i) => i.speciesId);
      setCards((p) => {
        return p?.filter((item) => !instanceMap?.includes(item.id));
      });
    } else if (!caught.Caught && !caught.Uncaught) {
      setCards([]);
    }

    // Filter based on region
    setCards((p) =>
      p?.filter((s) => {
        let r = [];
        let key: keyof IRegion;
        for (key in regions) {
          if (regions[key]) r.push(key);
        }
        return r.includes(s.region);
      })
    );

    // Filter based on rarity
    setCards((p) =>
      p?.filter((s) => {
        let r = [];
        let key: keyof IRarity;
        for (key in rarities) {
          if (rarities[key]) r.push(key);
        }
        return r.includes(s.rarity);
      })
    );

    // Filter based on type
    setCards((p) =>
      p?.filter((s) => {
        let t = [];
        let key: keyof IType;
        for (key in types) {
          if (types[key]) t.push(key);
        }
        return t.includes(s.typeOne) || t.includes(s.typeTwo!);
      })
    );

    // Filter based on habitat
    setCards((p) =>
      p?.filter((s) => {
        let h = [];
        let key: keyof IHabitat;
        for (key in habitats) {
          if (habitats[key])
            key === "Waters-Edge"
              ? h.push("WatersEdge")
              : key === "Rough-Terrain"
              ? h.push("RoughTerrain")
              : h.push(key);
        }
        return h.includes(s.habitat);
      })
    );
  };

  // Apply filters
  useEffect(() => {
    filterSpecies();
  }, [caught, shiny, regions, rarities, types, habitats]);

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
            totalYield={session.user.totalYield}
            totalCards={session.user.instanceCount}
            commonCards={session.user.commonCards}
            rareCards={session.user.rareCards}
            epicCards={session.user.epicCards}
            legendaryCards={session.user.legendaryCards}
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
                        checked={shiny["Not Shiny"]}
                        colour="purple"
                      />
                    </li>
                    <li className="border-b-2 border-black">
                      <DrowpdownItem
                        label="Shiny"
                        fn={handleShiny}
                        checked={shiny.Shiny}
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
                        checked={regions["All"]}
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
                          checked={regions[r]}
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
                        checked={rarities.All}
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
                          checked={rarities[r]}
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
                        checked={types.All}
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
                          checked={types[t]}
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
                        checked={habitats.All}
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
                          checked={
                            h === "WatersEdge"
                              ? habitats["Waters-Edge"]
                              : h === "RoughTerrain"
                              ? habitats["Rough-Terrain"]
                              : habitats[h]
                          }
                          colour="lime"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {instanceLoading || cardsLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="cards grid justify-center gap-x-3 gap-y-5 pt-5">
                {cards?.map((c) => (
                  <Card
                    key={c.id}
                    species={c}
                    caught={instanceData?.instances.some(
                      (i) => i.speciesId === c.id
                    )}
                  />
                ))}
              </div>
            )}
          </main>
        </Sidebar>
      </div>
    </>
  );
}
