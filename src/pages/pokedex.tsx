import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../server/db";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

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
  const instances = await prisma.instance.findMany({ distinct: ["speciesId"] });
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

type Shiny = "Original" | "Shiny";
type Rarity = "All" | "Common" | "Rare" | "Epic" | "Legendary";

export default function Pokedex({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState(species.filter((s) => !s.shiny));
  const [shiny, setShiny] = useState<Shiny>("Original");
  const [region, setRegion] = useState<Region>("All");
  const [rarity, setRarity] = useState<Rarity>("All");

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

  const filterSpecies = () => {
    // Filter based on shiny
    if (shiny === "Original") {
      setCards(species.filter((s) => !s.shiny));
    } else if (shiny === "Shiny") {
      setCards(species.filter((s) => s.shiny));
    }

    // Filter based on region
    if (region === "Kanto") {
      setCards((prevCards) => prevCards.filter((s) => s.generation === 1));
    } else if (region === "Johto") {
      setCards((prevCards) => prevCards.filter((s) => s.generation === 2));
    } else if (region === "Hoenn") {
      setCards((prevCards) => prevCards.filter((s) => s.generation === 3));
    }

    // Filter based on rarity
    if (rarity === "Common") {
      setCards((prevCards) => prevCards.filter((s) => s.rarity === "Common"));
    } else if (rarity === "Rare") {
      setCards((prevCards) => prevCards.filter((s) => s.rarity === "Rare"));
    } else if (rarity === "Epic") {
      setCards((prevCards) => prevCards.filter((s) => s.rarity === "Epic"));
    } else if (rarity === "Legendary") {
      setCards((prevCards) =>
        prevCards.filter((s) => s.rarity === "Legendary")
      );
    }
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
              <button
                onClick={() => setShiny("Original")}
                className={`${
                  shiny === "Original"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Original
              </button>
              <button
                onClick={() => setShiny("Shiny")}
                className={`${
                  shiny === "Shiny"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Shiny
              </button>
            </div>
            <div className="flex justify-center gap-5 pt-5">
              <button
                onClick={() => setRegion("All")}
                className={`${
                  region === "All"
                    ? `bg-green-btn-focus`
                    : `bg-green-btn-unfocus hover:bg-green-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                All
              </button>
              <button
                onClick={() => setRegion("Kanto")}
                className={`${
                  region === "Kanto"
                    ? `bg-green-btn-focus`
                    : `bg-green-btn-unfocus hover:bg-green-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Kanto
              </button>
              <button
                onClick={() => setRegion("Johto")}
                className={`${
                  region === "Johto"
                    ? `bg-green-btn-focus`
                    : `bg-green-btn-unfocus hover:bg-green-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Johto
              </button>
              <button
                onClick={() => setRegion("Hoenn")}
                className={`${
                  region === "Hoenn"
                    ? `bg-green-btn-focus`
                    : `bg-green-btn-unfocus hover:bg-green-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Hoenn
              </button>
            </div>
            <div className="flex justify-center gap-5 pt-5">
              <button
                onClick={() => setRarity("All")}
                className={`${
                  rarity === "All"
                    ? `bg-orange-btn-focus`
                    : `bg-orange-btn-unfocus hover:bg-orange-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                All
              </button>
              <button
                onClick={() => setRarity("Common")}
                className={`${
                  rarity === "Common"
                    ? `bg-orange-btn-focus`
                    : `bg-orange-btn-unfocus hover:bg-orange-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Common
              </button>
              <button
                onClick={() => setRarity("Rare")}
                className={`${
                  rarity === "Rare"
                    ? `bg-orange-btn-focus`
                    : `bg-orange-btn-unfocus hover:bg-orange-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Rare
              </button>
              <button
                onClick={() => setRarity("Epic")}
                className={`${
                  rarity === "Epic"
                    ? `bg-orange-btn-focus`
                    : `bg-orange-btn-unfocus hover:bg-orange-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Epic
              </button>
              <button
                onClick={() => setRarity("Legendary")}
                className={`${
                  rarity === "Legendary"
                    ? `bg-orange-btn-focus`
                    : `bg-orange-btn-unfocus hover:bg-orange-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Legendary
              </button>
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
