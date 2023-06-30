import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../server/db";
import Card from "../components/Card";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import DrowpdownItem from "../components/DropdownItem";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }
  const user = session.user;
  const species = await prisma.species.findMany();
  const instances = await prisma.instance.findMany({
    where: { userId: user.id },
    distinct: ["speciesId"]
  });
  const parsedInstances: typeof instances = JSON.parse(
    JSON.stringify(instances)
  );

  return {
    props: {
      user,
      species,
      instances: parsedInstances
    }
  };
};

interface Shiny {
  "Not Shiny": boolean;
  "Shiny": boolean;
}

interface Region {
  Kanto: boolean;
  Johto: boolean;
  Hoenn: boolean;
}

interface Rarity {
  Common: boolean;
  Rare: boolean;
  Epic: boolean;
  Legendary: boolean;
}

export default function Pokedex({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState(species.filter((s) => !s.shiny));
  const [shiny, setShiny] = useState<Shiny>({
    "Not Shiny": true,
    "Shiny": false
  });
  const [region, setRegion] = useState<Region>({
    Kanto: true,
    Johto: true,
    Hoenn: true
  });
  const [rarity, setRarity] = useState<Rarity>({
    Common: true,
    Rare: true,
    Epic: true,
    Legendary: true
  });

  // Dropdown open states
  const [shinyOpen, setShinyOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [rarityOpen, setRarityOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);
  }, []);

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
    if (label === "Kanto") {
      setRegion({ ...region, Kanto: checked });
    } else if (label === "Johto") {
      setRegion({ ...region, Johto: checked });
    } else if (label === "Hoenn") {
      setRegion({ ...region, Hoenn: checked });
    }
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Common") {
      setRarity({ ...rarity, Common: checked });
    } else if (label === "Rare") {
      setRarity({ ...rarity, Rare: checked });
    } else if (label === "Epic") {
      setRarity({ ...rarity, Epic: checked });
    } else if (label === "Legendary") {
      setRarity({ ...rarity, Legendary: checked });
    }
  };

  const filterSpecies = () => {
    // Filter based on shiny
    if (shiny.Shiny) {
      setCards(species.filter((s) => s.shiny));
    } else if (shiny["Not Shiny"]) {
      setCards(species.filter((s) => !s.shiny));
    }

    // Filter based on region
    setCards((p) =>
      p.filter((s) => {
        let generations = [];
        if (region.Kanto) {
          generations.push(1);
        }
        if (region.Johto) {
          generations.push(2);
        }
        if (region.Hoenn) {
          generations.push(3);
        }
        return generations.includes(s.generation);
      })
    );

    // Filter based on rarity
    setCards((p) =>
      p.filter((s) => {
        let rarities = [];
        if (rarity.Common) {
          rarities.push("Common");
        }
        if (rarity.Rare) {
          rarities.push("Rare");
        }
        if (rarity.Epic) {
          rarities.push("Epic");
        }
        if (rarity.Legendary) {
          rarities.push("Legendary");
        }
        return rarities.includes(s.rarity);
      })
    );
  };

  useEffect(() => {
    filterSpecies();
  }, [shiny, region, rarity]);

  if (loading) return <Loading />;

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
          <main className="p-4">
            {user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <div className="flex justify-center gap-5">
              <div className="w-60">
                <button
                  onClick={() => setShinyOpen((p) => !p)}
                  className="w-full border-2 border-black bg-purple-500 p-2 font-bold">
                  Select Shiny/Not Shiny
                </button>
                {shinyOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Not Shiny"}
                        fn={handleShiny}
                        checked={shiny["Not Shiny"]}
                        colour="purple"
                      />
                    </li>
                    <li>
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
              <div className="w-60">
                <button
                  onClick={() => setRegionOpen((p) => !p)}
                  className="w-full border-2 border-black bg-green-500 p-2 font-bold">
                  Select Region
                </button>
                {regionOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Kanto"}
                        fn={handleRegion}
                        checked={region.Kanto}
                        colour={"green"}
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Johto"
                        fn={handleRegion}
                        checked={region.Johto}
                        colour={"green"}
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Hoenn"
                        fn={handleRegion}
                        checked={region.Hoenn}
                        colour={"green"}
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-60">
                <button
                  onClick={() => setRarityOpen((p) => !p)}
                  className="w-full border-2 border-black bg-orange-500 p-2 font-bold">
                  Select Rarity
                </button>
                {rarityOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Common"}
                        fn={handleRarity}
                        checked={rarity.Common}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Rare"
                        fn={handleRarity}
                        checked={rarity.Rare}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Epic"
                        fn={handleRarity}
                        checked={rarity.Epic}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Legendary"
                        fn={handleRarity}
                        checked={rarity.Legendary}
                        colour="orange"
                      />
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="cards grid justify-center gap-5 pt-5">
              {cards.map((c) => (
                <Card
                  key={c.id}
                  species={c}
                  caught={instances.some((i) => i.speciesId === c.id)}
                />
              ))}
            </div>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
