import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../server/db";
import Card from "../components/Card";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const species = await prisma.species.findMany();

  return {
    props: {
      species
    }
  };
};

type Shiny = "Original" | "Shiny";
type Region = "All" | "Kanto" | "Johto";

export default function Pokedex({
  species
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cards, setCards] = useState(species.filter((s) => !s.shiny));
  const [shiny, setShiny] = useState<Shiny>("Original");
  const [region, setRegion] = useState<Region>("All");

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
    }
  };

  useEffect(() => {
    filterSpecies();
  }, [shiny, region]);

  return (
    <>
      <Head>
        <title>PokéZoo - Pokédex</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Sidebar page="Pokedex">
          <main className="p-4">
            <div className="flex justify-center gap-5">
              <button
                onClick={() => setShiny("Original")}
                className={`${
                  shiny === "Original"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Original
              </button>
              <button
                onClick={() => setShiny("Shiny")}
                className={`${
                  shiny === "Shiny"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Shiny
              </button>
            </div>
            <div className="flex justify-center gap-5 pt-5">
              <button
                onClick={() => setRegion("All")}
                className={`${
                  region === "All"
                    ? `bg-emerald-600`
                    : `bg-emerald-500 hover:bg-emerald-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                All
              </button>
              <button
                onClick={() => setRegion("Kanto")}
                className={`${
                  region === "Kanto"
                    ? `bg-emerald-600`
                    : `bg-emerald-500 hover:bg-emerald-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Kanto
              </button>
              <button
                onClick={() => setRegion("Johto")}
                className={`${
                  region === "Johto"
                    ? `bg-emerald-600`
                    : `bg-emerald-500 hover:bg-emerald-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Johto
              </button>
            </div>
            <div className="cards grid justify-center gap-5 pt-5">
              {cards.map((c) => (
                <Card key={c.id} species={c} />
              ))}
            </div>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
