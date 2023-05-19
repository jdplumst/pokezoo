import { prisma } from "../server/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import { Instance, Species } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

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

type Sort = "Oldest" | "Newest" | "Pokedex" | "Rarity";
type JohtoStarter = "Chikorita" | "Cyndaquil" | "Totodile";

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  // Variables associated with daily and nightly rewards
  const [claimedDaily, setClaimedDaily] = useState(user.claimedDaily);
  const [dailyDisabled, setDailyDisabled] = useState(false);
  const [claimedNightly, setClaimedNightly] = useState(user.claimedNightly);
  const [nightlyDisabled, setNightlyDisabled] = useState(false);
  const rewardMutation = trpc.user.claimReward.useMutation();

  // Variables associated with cards
  const [originalInstances, setOriginalInstances] = useState(instances.slice());
  const [cards, setCards] = useState(instances.slice());
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("Oldest");

  // Variables associated with selling an instance
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSpecies, setDeleteSpecies] = useState<Species>(species[0]);
  const [deleteInstance, setDeleteInstance] = useState<Instance | null>(null);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const sellMutation = trpc.instance.sellInstance.useMutation();

  // Variables associated with starters
  const [claimedJohto, setClaimedJohto] = useState(user.johtoStarter);
  const [claimedHoenn, setClaimedHoenn] = useState(user.hoennStarter);

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

  // Display starter and updated yield
  const addStarter = (i: Instance, r: Region) => {
    setCards((prevCards) => [...prevCards, i]);
    setOriginalInstances((prevOriginalInstances) => [
      ...prevOriginalInstances,
      i
    ]);
    setTotalYield((prevTotalYield) => prevTotalYield + 50);

    if (r === "Johto") {
      setClaimedJohto(true);
    } else if (r === "Hoenn") {
      setClaimedHoenn(true);
    }
  };

  // Claim Daily and Nightly Reward
  const claimReward = async () => {
    setDailyDisabled(true);
    if (time === "day") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data, variables, context) {
            setClaimedDaily(true);
            setBalance(data.user.balance);
          },
          onError(error, variables, context) {
            setDailyDisabled(false);
          }
        }
      );
    } else if (time === "night") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data, variables, context) {
            setClaimedNightly(true);
            setBalance(data.user.balance);
          },
          onError(error, variables, context) {
            setNightlyDisabled(false);
          }
        }
      );
    }
  };

  // Change Card Sort Order
  const changeSort = (s: Sort) => {
    if (s === "Oldest") {
      setSort("Oldest");
      setCards(originalInstances.slice());
    } else if (s === "Newest") {
      setSort("Newest");
      setCards(originalInstances.slice().reverse());
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
    sellMutation.mutate(
      { id: i.id },
      {
        onSuccess(data, variables, context) {
          setCards((prevCards) =>
            prevCards.filter((c) => c.id !== data.instance.id)
          );
          setOriginalInstances((prevOriginalInstances) =>
            prevOriginalInstances.filter((o) => o.id !== data.instance.id)
          );
          setTotalYield(data.user.totalYield);
          setBalance(data.user.balance);
          setError(null);
          setDeleteModal(false);
        },
        onError(error, variables, context) {
          setError(error.message);
        }
      }
    );
  };

  if (loading) return <Loading />;

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
        <Start
          user={user}
          species={species}
          region="Kanto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Johto Starter */}
      {!claimedJohto && (
        <Start
          user={user}
          species={species}
          region="Johto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Hoenn Starter */}
      {!claimedHoenn && (
        <Start
          user={user}
          species={species}
          region="Hoenn"
          addStarter={addStarter}
        />
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
              className="mb-2 w-28 rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
              Yes
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              disabled={deleteDisabled}
              className="mb-2 w-28 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus ">
              No
            </button>
          </div>
        </Modal>
      )}

      {/* Main Game Screen */}
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Game">
          <main className="p-4">
            {user.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <div className="flex items-end justify-between px-4">
              <span>Your current balance is P{balance}.</span>
              {claimedDaily && time === "day" ? (
                <span>You have already claimed your daily reward.</span>
              ) : !claimedDaily && time === "day" ? (
                <button
                  onClick={() => claimReward()}
                  disabled={dailyDisabled}
                  className="w-fit rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
                  Claim Daily Reward
                </button>
              ) : claimedNightly && time === "night" ? (
                <span>You have already claimed your nightly reward.</span>
              ) : !claimedNightly && time === "night" ? (
                <button
                  onClick={() => claimReward()}
                  disabled={dailyDisabled}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Claim Nightly Reward
                </button>
              ) : (
                <></>
              )}
            </div>
            <div className="flex items-center justify-between px-4">
              <span>You will receive P{totalYield} on the next payout.</span>
              <span>You have {cards.length} / 2000 Pokémon.</span>
            </div>
            {error && <p>{error}</p>}
            <div className="flex justify-center gap-5">
              <button
                onClick={() => changeSort("Oldest")}
                className={`${
                  sort === "Oldest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Oldest
              </button>
              <button
                onClick={() => changeSort("Newest")}
                className={`${
                  sort === "Newest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Newest
              </button>
              <button
                onClick={() => changeSort("Pokedex")}
                className={`${
                  sort === "Pokedex"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Pokédex #
              </button>
              <button
                onClick={() => changeSort("Rarity")}
                className={`${
                  sort === "Rarity"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
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
          </main>
        </Sidebar>
      </div>
    </>
  );
}
