import Navbar from "@/src/components/Navbar";
import client from "@/prisma/script";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";
import { Instance } from "@prisma/client";
import Link from "next/link";
import { trpc } from "../utils/trpc";

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
  const instances = await client.instance.findMany({
    where: { userId: user.id.toString() }
  });
  const species = await client.species.findMany();

  return {
    props: {
      user,
      species,
      instances
    }
  };
};

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Variables associated with daily reward
  const [claimedDaily, setClaimedDaily] = useState(user.claimedDaily);
  const [dailyDisabled, setDailyDisabled] = useState(false);
  const dailyMutation = trpc.user.claimDaily.useMutation();

  const [cards, setCards] = useState(instances);
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);

  const instanceDeleteMutation = trpc.instance.deleteInstance.useMutation();
  const userDeleteMutation = trpc.user.updateSell.useMutation();

  const addStarter = (i: Instance) => {
    setCards((prevCards) => [...prevCards, i]);
  };

  const addStarterYield = () => {
    setTotalYield(20);
  };

  // Claim Daily Reward
  const claimDaily = async () => {
    setDailyDisabled(true);
    dailyMutation
      .mutateAsync({ balance: balance })
      .then((response) => {
        setClaimedDaily(true);
        setBalance(response.user.balance);
      })
      .catch((error) => {
        setDailyDisabled(false);
      });
  };

  // Delete an Instance
  const deleteInstance = (
    id: string,
    speciesYield: number,
    sellPrice: number
  ) => {
    instanceDeleteMutation
      .mutateAsync({ id: id })
      .then((instanceResponse) => {
        if (instanceResponse.error) {
          setError(instanceResponse.error);
          return;
        } else if (instanceResponse.instance) {
          userDeleteMutation
            .mutateAsync({
              speciesYield: speciesYield,
              userYield: totalYield,
              balance: balance,
              sellPrice: sellPrice
            })
            .then((userResponse) => {
              setCards((prevCards) =>
                prevCards.filter((c) => c.id !== instanceResponse.instance.id)
              );
              setTotalYield(userResponse.user.totalYield);
              setBalance(userResponse.user.balance);
              setError(null);
            })
            .catch((userError) => setError("Something went wrong. Try again."));
        }
      })
      .catch((instanceError) => setError("Something went wrong. Try again."));
  };

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/master-ball.png" />
      </Head>

      {/* Modal for New Players */}
      {instances.length === 0 && (
        <Start
          species={species}
          totalYield={totalYield}
          balance={balance}
          addStarter={addStarter}
          addStarterYield={addStarterYield}
        />
      )}

      {/* Main Game Screen */}
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Navbar />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span>Your current balance is P{balance}.</span>
            {claimedDaily ? (
              <span className="mr-28">
                You have already claimed your daily reward.
              </span>
            ) : (
              <button
                onClick={() => claimDaily()}
                disabled={dailyDisabled}
                className="mr-28 w-fit rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
                Claim Daily Reward
              </button>
            )}
          </div>
          <p>You will receive P{totalYield} on the next payout.</p>
          <div className="cards grid justify-center gap-5 pt-5">
            <div className="flex h-64 w-52 flex-col items-center justify-between border-2 border-black bg-slate-400">
              <Image
                src="/img/master-ball.png"
                alt="new_pokemon"
                width={100}
                height={100}
                className="pixelated mt-14"
              />
              <Link href="/shop">
                <button className="mb-2 rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                  Add Pokémon
                </button>
              </Link>
            </div>
            {cards.map((c) => (
              <Card
                key={c.id}
                instance={c}
                species={species.filter((s) => s.id === c.speciesId)[0]}
                deleteInstance={deleteInstance}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
