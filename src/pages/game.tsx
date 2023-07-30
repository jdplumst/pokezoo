import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { useEffect, useState } from "react";
import { Instance } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";
import Topbar from "../components/Topbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

enum Rarity {
  Common = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4
}

type Sort = "Oldest" | "Newest" | "Pokedex" | "Rarity";

export default function Game() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const { data: speciesData, isLoading: speciesLoading } =
    trpc.species.getSpecies.useQuery({
      order: null
    });

  const { data: instanceData, isLoading: instanceLoading } =
    trpc.instance.getInstances.useQuery({
      distinct: false
    });

  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  // Variables associated with cards
  const [cards, setCards] = useState<Instance[]>();
  const [balance, setBalance] = useState(0);
  const [totalYield, setTotalYield] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("Oldest");

  // Variables associated with daily/night rewards
  const [claimedDaily, setClaimedDaily] = useState(true);
  const [dailyDisabled, setDailyDisabled] = useState(false);
  const [claimedNightly, setClaimedNightly] = useState(true);
  const [nightlyDisabled, setNightlyDisabled] = useState(false);
  const rewardMutation = trpc.user.claimReward.useMutation();

  // Variables associated with selling an instance
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const sellMutation = trpc.instance.sellInstances.useMutation();

  // Variables associated with starters
  const [claimedJohto, setClaimedJohto] = useState(true);
  const [claimedHoenn, setClaimedHoenn] = useState(true);
  const [claimedSinnoh, setClaimedSinnoh] = useState(true);

  // Variables associated with setting username
  const [usernameModal, setUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameDisabled, setUsernameDisabled] = useState(false);
  const [usernameError, setUsernameError] = useState<null | string>(null);
  const usernameMutation = trpc.user.selectUsername.useMutation();

  // Set time and user data
  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }

    if (status !== "authenticated") return;
    setBalance(session.user.balance);
    setTotalYield(session.user.totalYield);
    setClaimedDaily(session.user.claimedDaily);
    setClaimedNightly(session.user.claimedNightly);
    setClaimedJohto(session.user.johtoStarter);
    setClaimedHoenn(session.user.hoennStarter);
    setClaimedSinnoh(session.user.sinnohStarter);
    setUsernameModal(session.user.username ? false : true);
    setUsername(session.user.username ? session.user.username : "");

    setLoading(false);
  }, [session]);

  // Set cards
  useEffect(() => {
    if (!instanceData) return;
    setCards(instanceData.instances);
  }, [instanceData]);

  // Display starter and updated yield
  const addStarter = (i: Instance, r: Region) => {
    setCards((p) => [...p!, i]);
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
      setCards((p) =>
        p?.sort((a, b) => (a.createDate > b.createDate ? 1 : -1))
      );
    } else if (s === "Newest") {
      setSort("Newest");
      setCards((p) =>
        p?.sort((a, b) => (a.createDate < b.createDate ? 1 : -1))
      );
    } else if (s === "Pokedex") {
      setSort("Pokedex");
      setCards((p) =>
        p?.sort((a, b) =>
          (speciesData?.species.find((s) => s.id === a.speciesId)
            ?.pokedexNumber || 1) >=
          (speciesData?.species.find((s) => s.id === b.speciesId)
            ?.pokedexNumber || 1)
            ? 1
            : -1
        )
      );
    } else if (s === "Rarity") {
      setSort("Rarity");
      setCards((p) =>
        p
          ?.sort((a, b) =>
            (speciesData?.species.find((s) => s.id === a.speciesId)
              ?.pokedexNumber || 1) <=
            (speciesData?.species.find((s) => s.id === b.speciesId)
              ?.pokedexNumber || 1)
              ? 1
              : -1
          )
          .sort((a, b) =>
            Rarity[
              speciesData?.species.find((s) => s.id === a.speciesId)?.rarity ||
                1
            ] >=
            Rarity[
              speciesData?.species.find((s) => s.id === b.speciesId)?.rarity ||
                1
            ]
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
          setCards((p) => p?.filter((c) => !data.instances.includes(c.id)));
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
  const handleUsername = (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading || status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* Main Game Screen */}
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Game">
          <Topbar
            username={username}
            balance={balance}
            totalYield={totalYield}
            totalCards={instanceData?.instances.length ?? 0}
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
            {session.user.admin && (
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
            {instanceLoading || speciesLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="cards grid justify-center gap-5 pt-5">
                {instanceData?.instances.map((c) => (
                  <Card
                    key={c.id}
                    instance={c}
                    species={
                      speciesData?.species.filter(
                        (s) => s.id === c.speciesId
                      )[0]!
                    }
                    modifyDeleteList={modifyDeleteList}
                  />
                ))}
              </div>
            )}
          </main>
        </Sidebar>
      </div>

      {/* Modal for New Players */}
      {speciesData && instanceData?.instances.length === 0 && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Kanto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Username */}
      {usernameModal && (
        <Modal>
          <form
            onSubmit={(e) => handleUsername(e)}
            className="flex w-full flex-col items-center gap-5">
            <p className="text-xl font-bold">Enter a Username</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-black"></input>
            <button
              disabled={usernameDisabled}
              className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 text-xl font-bold hover:bg-red-btn-focus">
              {usernameMutation.isLoading ? <LoadingSpinner /> : "Confirm"}
            </button>
          </form>
          {usernameError && (
            <div className="flex justify-center font-bold text-red-500">
              {usernameError}
            </div>
          )}
        </Modal>
      )}

      {/* Modal for Johto Starter */}
      {speciesData && !claimedJohto && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Johto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Hoenn Starter */}
      {speciesData && !claimedHoenn && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Hoenn"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Sinnoh Starter */}
      {speciesData && !claimedSinnoh && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Sinnoh"
          addStarter={addStarter}
        />
      )}
    </>
  );
}
