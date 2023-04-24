import client from "@/prisma/script";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";
import { Instance, Species } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";

enum Rarity {
  Common = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4
}

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

type Sort = "Oldest" | "Newest" | "Pokedex" | "Rarity";

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Variables associated with daily reward
  const [claimedDaily, setClaimedDaily] = useState(user.claimedDaily);
  const [dailyDisabled, setDailyDisabled] = useState(false);
  const dailyMutation = trpc.user.claimDaily.useMutation();

  let orderedInstances = instances;
  const [cards, setCards] = useState(instances);
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("Oldest");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSpecies, setDeleteSpecies] = useState<Species>(species[0]);
  const [deleteInstance, setDeleteInstance] = useState<Instance | null>(null);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const instanceDeleteMutation = trpc.instance.deleteInstance.useMutation();
  const userDeleteMutation = trpc.user.updateBalance.useMutation();

  const addStarter = (i: Instance) => {
    setCards((prevCards) => [...prevCards, i]);
    orderedInstances.push(i);
    setTotalYield(20);
  };

  // Claim Daily Reward
  const claimDaily = async () => {
    setDailyDisabled(true);
    dailyMutation
      .mutateAsync()
      .then((response) => {
        setClaimedDaily(true);
        setBalance(response.user.balance);
      })
      .catch((error) => {
        setDailyDisabled(false);
      });
  };

  // Change Card Sort Order
  const changeSort = (s: Sort) => {
    console.log(orderedInstances);
    if (s === "Oldest") {
      setSort("Oldest");
      setCards(orderedInstances.slice());
    } else if (s === "Newest") {
      setSort("Newest");
      setCards(orderedInstances.slice().reverse());
    } else if (s === "Pokedex") {
      setSort("Pokedex");
      setCards((prevCards) =>
        prevCards.sort((a, b) =>
          (species.find((s) => s.id === a.speciesId)?.pokedexNumber || 1) >=
          (species.find((s) => s.id === b.speciesId)?.pokedexNumber || 1)
            ? 1
            : -1
        )
      );
    } else if (s === "Rarity") {
      setSort("Rarity");
      setCards((prevCards) =>
        prevCards
          .sort((a, b) =>
            (species.find((s) => s.id === a.speciesId)?.pokedexNumber || 1) <=
            (species.find((s) => s.id === b.speciesId)?.pokedexNumber || 1)
              ? 1
              : -1
          )
          .sort((a, b) =>
            Rarity[species.find((s) => s.id === a.speciesId)?.rarity || 1] >=
            Rarity[species.find((s) => s.id === b.speciesId)?.rarity || 1]
              ? 1
              : -1
          )
      );
    }
  };

  // Open Delete Modal
  const openDelete = (species: Species, instance: Instance) => {
    setDeleteModal(true);
    window.scrollTo(0, 0);
    setDeleteSpecies(species);
    setDeleteInstance(instance);
    setDeleteDisabled(false);
  };

  // Delete an Instance
  const confirmDelete = (i: Instance) => {
    setDeleteDisabled(true);
    instanceDeleteMutation
      .mutateAsync({ id: i.id })
      .then((instanceResponse) => {
        userDeleteMutation
          .mutateAsync({
            speciesYield: deleteSpecies.yield * -1,
            cost: deleteSpecies.sellPrice * -1
          })
          .then((userResponse) => {
            if (userResponse.user) {
              setCards((prevCards) =>
                prevCards.filter((c) => c.id !== instanceResponse.instance.id)
              );
              orderedInstances = orderedInstances.filter(
                (o) => o.id !== instanceResponse.instance.id
              );
              setTotalYield(userResponse.user.totalYield);
              setBalance(userResponse.user.balance);
              setError(null);
              setDeleteModal(false);
            }
          })
          .catch((userError) => setError("Something went wrong. Try again."));
      })
      .catch((instanceError) => setError("Something went wrong. Try again."));
  };

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* Modal for New Players */}
      {cards.length === 0 && (
        <Start species={species} addStarter={addStarter} />
      )}

      {/* Modal for Deleting */}
      {deleteModal && (
        <Modal>
          <div className="text-center text-xl font-bold">
            You are about to delete a Pokémon
          </div>
          <div className="pb-4">
            Are you sure you want to delete{" "}
            <span className="capitalize">{deleteSpecies.name}</span>?
          </div>
          <Card species={deleteSpecies} />
          <div className="grid grid-cols-2 gap-5 pt-4">
            <button
              onClick={() => confirmDelete(deleteInstance as Instance)}
              disabled={deleteDisabled}
              className="mb-2 w-28 rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
              Yes
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              disabled={deleteDisabled}
              className="mb-2 w-28 rounded-lg border-2 border-black bg-green-500 p-2 font-bold hover:bg-green-600 ">
              No
            </button>
          </div>
        </Modal>
      )}

      {/* Main Game Screen */}
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Sidebar page="Game">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span>Your current balance is P{balance}.</span>
              {claimedDaily ? (
                <span>You have already claimed your daily reward.</span>
              ) : (
                <button
                  onClick={() => claimDaily()}
                  disabled={dailyDisabled}
                  className="mr-28 w-fit rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
                  Claim Daily Reward
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>You will receive P{totalYield} on the next payout.</span>
              <span>You have {cards.length} / 2000 Pokémon.</span>
            </div>
            {error && <p>{error}</p>}
            <div className="flex justify-center gap-5">
              <button
                onClick={() => changeSort("Oldest")}
                className={`${
                  sort === "Oldest"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Oldest
              </button>
              <button
                onClick={() => changeSort("Newest")}
                className={`${
                  sort === "Newest"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Newest
              </button>
              <button
                onClick={() => changeSort("Pokedex")}
                className={`${
                  sort === "Pokedex"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Pokédex #
              </button>
              <button
                onClick={() => changeSort("Rarity")}
                className={`${
                  sort === "Rarity"
                    ? `bg-violet-600`
                    : `bg-violet-500 hover:bg-violet-600`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Rarity
              </button>
            </div>
            <div className="cards grid justify-center gap-5 pt-5">
              {cards.map((c) => (
                <Card
                  key={c.id}
                  instance={c}
                  species={species.filter((s) => s.id === c.speciesId)[0]}
                  openDelete={openDelete}
                />
              ))}
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
