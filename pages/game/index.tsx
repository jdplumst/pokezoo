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
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* Modal for New Players */}
      {instances.length === 0 && <Start species={species} />}
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Navbar />
        <div className="p-4">
          <p>Your current balance is {user.dollars} Pokemon dollars.</p>
          <p>
            You will receive {user.totalYield} Pokemon dollars on the next
            payout.
          </p>
          <div className="cards grid gap-y-5 pt-5">
            <div className="flex h-60 w-60 flex-col items-center justify-center border-2">
              <Image
                src="/favicon.png"
                alt="new_pokemon"
                width={180}
                height={180}
              />
              <button className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                Add Pokemon
              </button>
            </div>
            {instances.map((i) => (
              <Card
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
