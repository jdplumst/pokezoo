import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../server/db";
import Card from "../components/Card";
import { useState } from "react";

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
  const instances = await prisma.instance.findMany({
    where: { userId: user.id.toString() }
  });
  const species = await prisma.species.findMany();

  return {
    props: {
      user,
      species,
      instances
    }
  };
};

type Shiny = "Original" | "Shiny";

export default function Pokedex({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cards, setCards] = useState(species.filter((s) => !s.shiny));
  const [shiny, setShiny] = useState<Shiny>("Original");

  const changeShiny = (s: Shiny) => {
    if (s === "Original") {
      setShiny("Original");
      setCards(species.filter((s) => !s.shiny));
    } else if (s === "Shiny") {
      setShiny("Shiny");
      setCards(species.filter((s) => s.shiny));
    }
  };

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
          <div className="p-4">
            <div className="flex justify-center gap-5">
              <button
                onClick={() => changeShiny("Original")}
                className={`${
                  shiny === "Original"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Original
              </button>
              <button
                onClick={() => changeShiny("Shiny")}
                className={`${
                  shiny === "Shiny"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Shiny
              </button>
            </div>
            <div className="cards grid justify-center gap-5 pt-5">
              {cards.map((c) => (
                <Card key={c.id} species={c} />
              ))}
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
