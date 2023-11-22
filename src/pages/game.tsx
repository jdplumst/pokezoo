import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { useEffect, useState } from "react";
import { Instance, Region } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";
import Topbar from "../components/Topbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Sort = "Oldest" | "Newest" | "Pokedex" | "Rarity";

export default function Game() {
  const router = useRouter();

  const utils = trpc.useUtils();

  const {
    data: session,
    status,
    update: updateSession
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  // Variables associated with cards
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("Oldest");

  // Variables associated with daily/night rewards
  const [dailyReward, setDailyReward] = useState({
    modal: false,
    reward: 0,
    card: "Common"
  });
  const [nightlyReward, setNightlyReward] = useState({
    modal: false,
    reward: 0,
    card: "Common"
  });
  const rewardMutation = trpc.user.claimReward.useMutation();

  // Variables associated with selling an instance
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const sellMutation = trpc.instance.sellInstances.useMutation();

  // Variables associated with setting username
  const [username, setUsername] = useState("");
  const [usernameModal, setUsernameModal] = useState(false);
  const [usernameError, setUsernameError] = useState<null | string>(null);
  const usernameMutation = trpc.user.selectUsername.useMutation();

  const { data: speciesData, isLoading: speciesLoading } =
    trpc.species.getSpecies.useQuery({
      order: null
    });

  const { data: instanceData, isLoading: instanceLoading } =
    trpc.instance.getInstances.useQuery({
      distinct: false,
      order: sort
    });

  // Set time and user data
  useEffect(() => {
    if (status !== "authenticated") return;
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);
  }, [session]);

  // Display starter and updated yield
  const addStarter = (i: Instance, r: Region) => {
    utils.instance.getInstances.invalidate();
    updateSession();
  };

  // Claim Daily and Nightly Reward
  const claimReward = async () => {
    if (time === "day") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data, variables, context) {
            updateSession();
            setDailyReward({
              modal: true,
              reward: data.reward,
              card: data.card
            });
          }
        }
      );
    } else if (time === "night") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data, variables, context) {
            updateSession();
            setNightlyReward({
              modal: true,
              reward: data.reward,
              card: data.card
            });
          }
        }
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
    sellMutation.mutate(
      { ids: deleteList },
      {
        onSuccess(data, variables, context) {
          setError(null);
          setDeleteList([]);
          utils.instance.getInstances.invalidate();
          updateSession();
        },
        onError(error, variables, context) {
          setError(error.message);
        }
      }
    );
  };

  // Set username
  const handleUsername = (e: React.FormEvent) => {
    e.preventDefault();
    usernameMutation.mutate(
      { username: username },
      {
        onSuccess(data, variables, context) {
          setUsernameModal(false);
        },
        onError(error, variables, context) {
          setUsernameError(error.message);
        }
      }
    );
  };

  if (!session || loading) return <Loading />;

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
            username={session.user.username}
            balance={session.user.balance}
            totalYield={session.user.totalYield}
            totalCards={session.user.instanceCount}
            commonCards={session.user.commonCards}
            rareCards={session.user.rareCards}
            epicCards={session.user.epicCards}
            legendaryCards={session.user.legendaryCards}
          />
          {deleteList.length > 0 && (
            <div className="sticky top-0 flex items-center justify-between border-2 border-solid border-black bg-fuchsia-500 p-4">
              <span className="font-bold">
                You have selected {deleteList.length} Pokémon to delete.
              </span>

              <button
                onClick={() => handleDelete()}
                disabled={sellMutation.isLoading}
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
            {session.user.claimedDaily && time === "day" ? (
              <span>You have already claimed your daily reward.</span>
            ) : !session.user.claimedDaily && time === "day" ? (
              <button
                onClick={() => claimReward()}
                disabled={rewardMutation.isLoading}
                className="w-48 rounded-lg border-2 border-black bg-yellow-btn-unfocus p-2 font-bold hover:bg-yellow-btn-focus">
                {rewardMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Daily Reward"
                )}
              </button>
            ) : session.user.claimedNightly && time === "night" ? (
              <span>You have already claimed your nightly reward.</span>
            ) : !session.user.claimedNightly && time === "night" ? (
              <button
                onClick={() => claimReward()}
                disabled={rewardMutation.isLoading}
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
                onClick={() => setSort("Oldest")}
                className={`${
                  sort === "Oldest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Oldest
              </button>
              <button
                onClick={() => setSort("Newest")}
                className={`${
                  sort === "Newest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Newest
              </button>
              <button
                onClick={() => setSort("Pokedex")}
                className={`${
                  sort === "Pokedex"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-28 rounded-lg border-2 border-black p-2 font-bold`}>
                Pokédex #
              </button>
              <button
                onClick={() => setSort("Rarity")}
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
              <div className="cards grid justify-center gap-x-3 gap-y-5 pt-5">
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

      {/* Modal for Rewards */}
      {(dailyReward.modal || nightlyReward.modal) && (
        <Modal size="Small">
          <div className="p-2 text-3xl font-bold">
            You have claimed your {dailyReward.modal && `daily`}
            {""}
            {nightlyReward.modal && `nightly`} reward!
          </div>
          <div className="text-xl font-medium">
            You received P
            {dailyReward.modal && dailyReward.reward.toLocaleString()}
            {""}
            {nightlyReward.modal && nightlyReward.reward.toLocaleString()}!
          </div>
          <div className="flex">
            <div className="text-xl font-medium">
              You received 1 {dailyReward.modal && dailyReward.card}
              {""}
              {nightlyReward.modal && nightlyReward.card} wildcard!
            </div>
            <img
              src={
                (dailyReward.modal && dailyReward.card === "Common") ||
                (nightlyReward.modal && nightlyReward.card === "Common")
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png`
                  : (dailyReward.modal && dailyReward.card === "Rare") ||
                    (nightlyReward.modal && nightlyReward.card === "Rare")
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png`
                  : (dailyReward.modal && dailyReward.card === "Epic") ||
                    (nightlyReward.modal && nightlyReward.card === "Epic")
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png`
                  : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png`
              }
            />
          </div>
          <div className="pt-4">
            <button
              onClick={() => {
                setDailyReward({ ...dailyReward, modal: false });
                setNightlyReward({ ...nightlyReward, modal: false });
              }}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Username */}
      {usernameModal && (
        <Modal size="Small">
          <form
            onSubmit={(e) => handleUsername(e)}
            className="flex w-full flex-col items-center gap-5">
            <p className="text-xl font-bold">Enter a Username</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-black"></input>
            <button
              disabled={usernameMutation.isLoading}
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
      {speciesData && !session.user.johtoStarter && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Johto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Hoenn Starter */}
      {speciesData && !session.user.hoennStarter && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Hoenn"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Sinnoh Starter */}
      {speciesData && !session.user.sinnohStarter && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Sinnoh"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Unova Starter */}
      {speciesData && !session.user.unovaStarter && (
        <Start
          user={session.user}
          species={speciesData.species}
          region="Unova"
          addStarter={addStarter}
        />
      )}
    </>
  );
}
