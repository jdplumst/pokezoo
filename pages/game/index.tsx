import Navbar from "@/components/Navbar";
import client from "@/prisma/script";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Head from "next/head";
import Card from "@/components/Card";
import Start from "@/components/Start";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }

  const user = session.user;
  const species = await client.species.findMany();
  const instances = await client.speciesInstances.findMany({
    where: { userId: user.id.toString() }
  });
  return {
    props: { user, species, instances }
  };
};

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/master-ball.png" />
      </Head>

      {/* Modal for New Players */}
      {instances.length === 0 && <Start species={species} user={user} />}
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Navbar />
        <div className="p-4">
          <p>Your current balance is P{user.dollars}.</p>
          <p>You will receive P{user.totalYield} on the next payout.</p>
          <div className="cards grid gap-5 pt-5">
            <div className="flex h-52 w-52 flex-col items-center justify-evenly border-2 border-black bg-slate-400">
              <Image
                src="/img/master-ball.png"
                alt="new_pokemon"
                width={100}
                height={100}
              />
              <button className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                Add Pokemon
              </button>
            </div>
            {instances.map((i) => (
              <Card
                key={i.id}
                instance={i}
                species={species.filter((s) => s.id === i.speciesId)[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
