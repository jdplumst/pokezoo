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
import LoadingSpinner from "../components/LoadingSpinner";
import Topbar from "../components/Topbar";

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
  let parsedInstances: Instance[] = JSON.parse(JSON.stringify(instances));
  return {
    props: {
      user,
      species,
      instances: parsedInstances
    }
  };
};

type Sort = "Oldest" | "Newest" | "Pokedex" | "Rarity";

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  // Variables associated with cards
  const [cards, setCards] = useState(instances.slice());
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("Oldest");

  // Variables associated with daily/night rewards
  const [claimedDaily, setClaimedDaily] = useState(user.claimedDaily);
  const [dailyDisabled, setDailyDisabled] = useState(false);
  const [claimedNightly, setClaimedNightly] = useState(user.claimedNightly);
  const [nightlyDisabled, setNightlyDisabled] = useState(false);
  const rewardMutation = trpc.user.claimReward.useMutation();

  // Variables associated with selling an instance
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const sellMutation = trpc.instance.sellInstances.useMutation();

  // Variables associated with starters
  const [claimedJohto, setClaimedJohto] = useState(user.johtoStarter);
  const [claimedHoenn, setClaimedHoenn] = useState(user.hoennStarter);
  const [claimedSinnoh, setClaimedSinnoh] = useState(user.sinnohStarter);

  // Variables associated with setting username
  const [usernameModal, setUsernameModal] = useState(
    user.username ? false : true
  );
  const [username, setUsername] = useState(user.username ? user.username : "");
  const [usernameDisabled, setUsernameDisabled] = useState(false);
  const [usernameError, setUsernameError] = useState<null | string>(null);
  const usernameMutation = trpc.user.selectUsername.useMutation();

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);

    // For when cards are added and deleted
    changeSort(sort);
  }, [cards]);

  // Display starter and updated yield
  const addStarter = (i: Instance, r: Region) => {
    setCards((prevCards) => [...prevCards, i]);
    setTotalYield((prevTotalYield) => prevTotalYield + 50);

    if (r === "Johto") {
      setClaimedJohto(true);
    } else if (r === "Hoenn") {
      setClaimedHoenn(true);
    } else if (r === "Sinnoh") {
      setClaimedSinnoh(true);
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
      setCards((prevCards) =>
        prevCards.sort((a, b) => (a.createDate > b.createDate ? 1 : -1))
      );
    } else if (s === "Newest") {
      setSort("Newest");
      setCards((prevCards) =>
        prevCards.sort((a, b) => (a.createDate < b.createDate ? 1 : -1))
      );
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

  // Add or remove instances from array of instances to be deleted
  const modifyDeleteList = (i: Instance, sell: boolean) => {
    if (sell) {
      setDeleteList([...deleteList, i.id]);
    } else {
      setDeleteList(deleteList.filter((x) => x !== i.id));
    }
  };

  // Sell instance
  const handleDelete = () => {
    setDeleteDisabled(true);
    sellMutation.mutate(
      { ids: deleteList },
      {
        onSuccess(data, variables, context) {
          setCards((prevCards) =>
            prevCards.filter((c) => !data.instances.includes(c.id))
          );
          setTotalYield(data.user.totalYield);
          setBalance(data.user.balance);
          setError(null);
          setDeleteList([]);
          setDeleteDisabled(false);
        },
        onError(error, variables, context) {
          setError(error.message);
          setDeleteDisabled(false);
        }
      }
    );
  };

  // Set username
  const handleUsername = () => {
    setUsernameDisabled(true);
    usernameMutation.mutate(
      { username: username },
      {
        onSuccess(data, variables, context) {
          setUsernameModal(false);
        },
        onError(error, variables, context) {
          setUsernameError(error.message);
          setUsernameDisabled(false);
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

      {/* Modal for Username */}
      {usernameModal && (
        <Modal>
          <div className="flex w-full flex-col items-center gap-5">
            <p className="text-xl font-bold">Enter a Username</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-black"></input>
            <button
              onClick={() => handleUsername()}
              disabled={usernameDisabled}
              className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 text-xl font-bold hover:bg-red-btn-focus">
              {usernameMutation.isLoading ? <LoadingSpinner /> : "Confirm"}
            </button>
            {usernameError && (
              <div className="flex justify-center text-red-500">
                {usernameError}
              </div>
            )}
          </div>
        </Modal>
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

      {/* Modal for Sinnoh Starter */}
      {!claimedSinnoh && (
        <Start
          user={user}
          species={species}
          region="Sinnoh"
          addStarter={addStarter}
        />
      )}

      {/* Main Game Screen */}
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Game">
          <Topbar
            username={username}
            balance={balance}
            totalYield={totalYield}
            totalCards={cards.length}
          />
          {deleteList.length > 0 && (
            <div className="sticky top-0 flex items-center justify-between border-2 border-solid border-black bg-fuchsia-500 p-4">
              <span className="font-bold">
                You have selected {deleteList.length} Pokémon to delete.
              </span>

              <button
                onClick={() => handleDelete()}
                disabled={deleteDisabled}
                className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                {sellMutation.isLoading ? <LoadingSpinner /> : "Confirm Delete"}
              </button>
            </div>
          )}
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
            {claimedDaily && time === "day" ? (
              <span>You have already claimed your daily reward.</span>
            ) : !claimedDaily && time === "day" ? (
              <button
                onClick={() => claimReward()}
                disabled={dailyDisabled}
                className="w-48 rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
                {rewardMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Daily Reward"
                )}
              </button>
            ) : claimedNightly && time === "night" ? (
              <span>You have already claimed your nightly reward.</span>
            ) : !claimedNightly && time === "night" ? (
              <button
                onClick={() => claimReward()}
                disabled={nightlyDisabled}
                className="w-48 rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                {rewardMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Nightly Reward"
                )}
              </button>
            ) : (
              <></>
            )}
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
                  modifyDeleteList={modifyDeleteList}
                />
              ))}
            </div>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
