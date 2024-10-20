import Head from "next/head";
import Card from "@/src/components/Card";
import Start from "@/src/components/Start";
import { Fragment, useContext, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";
import Topbar from "../components/Topbar";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { type z } from "zod";
import {
  type ZodSpecies,
  type ZodHabitat,
  type ZodRarity,
  type ZodRegion,
  type ZodSort,
  type ZodSpeciesType,
} from "@/src/zod";
import Dropdown, { type IDropdowns } from "../components/Dropdown";
import {
  RegionsList,
  RaritiesList,
  TypesList,
  HabitatList,
} from "../constants";
import { type selectInstanceSchema } from "../server/db/schema";
import { ThemeContext } from "../components/ThemeContextProvider";
import ThemeWrapper from "../components/ThemeWrapper";

export default function Game() {
  const { status } = useSession({
    required: true,
  });

  const utils = trpc.useUtils();

  const { ref, inView } = useInView();

  const { time } = useContext(ThemeContext);

  // Variables associated with cards
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<z.infer<typeof ZodSort>>("Oldest");

  // Variables associated with daily/night rewards
  const [dailyReward, setDailyReward] = useState({
    modal: false,
    reward: 0,
    cards: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  });
  const [nightlyReward, setNightlyReward] = useState({
    modal: false,
    reward: 0,
    cards: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  });
  const rewardMutation = trpc.profile.claimReward.useMutation();

  // Variables associated with event rewards
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const [eventModal, setEventModal] = useState<{
    modal: boolean;
    reward: null | z.infer<typeof ZodSpecies>;
    // reward: null | inferRouterOutputs<AppRouter>["instance"]["claimEvent"];
  }>({
    modal: false,
    reward: null,
  });
  const eventMutation = trpc.instance.claimEvent.useMutation();

  // Variables associated with selling an instance
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const sellMutation = trpc.instance.sellInstances.useMutation();

  // Variables associated with setting username
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<null | string>(null);
  const usernameMutation = trpc.profile.selectUsername.useMutation();

  const [shiny, setShiny] = useState(false);
  const [regions, setRegions] =
    useState<z.infer<typeof ZodRegion>[]>(RegionsList);
  const [rarities, setRarities] =
    useState<z.infer<typeof ZodRarity>[]>(RaritiesList);
  const [types, setTypes] =
    useState<z.infer<typeof ZodSpeciesType>[]>(TypesList);
  const [habitats, setHabitats] =
    useState<z.infer<typeof ZodHabitat>[]>(HabitatList);

  // Dropdown open state
  const [dropdowns, setDropdowns] = useState<IDropdowns>({
    Caught: false,
    Shiny: false,
    Region: false,
    Rarity: false,
    Type: false,
    Habitat: false,
  });

  const getGame = trpc.instance.getGame.useInfiniteQuery(
    {
      limit: 50,
      order: sort,
      shiny: shiny,
      regions: regions,
      rarities: rarities,
      types: types,
      habitats: habitats,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const getProfile = trpc.profile.getProfile.useQuery();

  // Infinite scroll
  useEffect(() => {
    if (inView && getGame.hasNextPage) {
      void getGame.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, getGame.hasNextPage]);

  // Display starter and updated yield
  const addStarter = () => {
    void utils.instance.getGame.invalidate();
    void utils.profile.getProfile.invalidate();
  };

  // Claim Daily and Nightly Reward
  const claimReward = () => {
    if (time === "day") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data) {
            void utils.profile.getProfile.invalidate();
            setDailyReward({
              modal: true,
              reward: data.reward,
              cards: data.cards,
            });
          },
        },
      );
    } else if (time === "night") {
      rewardMutation.mutate(
        { time: time },
        {
          onSuccess(data) {
            void utils.profile.getProfile.invalidate();
            setNightlyReward({
              modal: true,
              reward: data.reward,
              cards: data.cards,
            });
          },
        },
      );
    }
  };

  // Claim Event Reward
  const claimEvent = () => {
    eventMutation.mutate(undefined, {
      onSuccess(data) {
        void utils.profile.getProfile.invalidate();
        void utils.instance.getGame.invalidate();
        setEventModal({ modal: true, reward: data.reward });
      },
      onError(error) {
        setError(error.message);
      },
    });
  };

  // Add or remove instances from array of instances to be deleted
  const modifyDeleteList = (
    i: z.infer<typeof selectInstanceSchema>,
    sell: boolean,
  ) => {
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
        onSuccess() {
          setError(null);
          setDeleteList([]);
          void utils.instance.getGame.invalidate();
          void utils.profile.getProfile.invalidate();
        },
        onError(error) {
          setError(error.message);
        },
      },
    );
  };

  // Set username
  const handleUsername = (e: React.FormEvent) => {
    e.preventDefault();
    usernameMutation.mutate(
      { username: username },
      {
        onSuccess() {
          void utils.profile.getProfile.invalidate();
        },
        onError(error) {
          setUsernameError(error.message);
        },
      },
    );
  };

  // Handle Dropdowns State
  const handleDropdowns = (d: string) => {
    if (dropdowns[d]) {
      const newDropdowns: IDropdowns = {} as IDropdowns;
      Object.keys(dropdowns).forEach((x) => (newDropdowns[x] = false));
      setDropdowns(newDropdowns);
    } else {
      const newDropdowns: IDropdowns = {} as IDropdowns;
      Object.keys(dropdowns).forEach((x) =>
        x === d ? (newDropdowns[x] = true) : (newDropdowns[x] = false),
      );
      setDropdowns(newDropdowns);
    }
  };

  // Handle Shiny State
  const handleShiny = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if ((label === "Not Shiny" && checked) || (label === "Shiny" && !checked)) {
      setShiny(false);
    } else {
      setShiny(true);
    }
  };

  // Handle Region State
  const handleRegion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodRegion>;
    const checked = e.target.checked;
    if (label.startsWith("all") && regions === RegionsList) {
      setRegions([]);
    } else if (label.startsWith("all") && regions !== RegionsList) {
      setRegions(RegionsList);
    } else if (!checked && regions.includes(label)) {
      setRegions(regions.filter((r) => r !== label));
    } else {
      setRegions([...regions, label]);
    }
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodRarity>;
    const checked = e.target.checked;
    if (label.startsWith("all") && rarities === RaritiesList) {
      setRarities([]);
    } else if (label.startsWith("all") && rarities !== RaritiesList) {
      setRarities(RaritiesList);
    } else if (!checked && rarities.includes(label)) {
      setRarities(rarities.filter((r) => r !== label));
    } else {
      setRarities([...rarities, label]);
    }
  };

  // Handle Type State
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodSpeciesType>;
    const checked = e.target.checked;
    if (label.startsWith("all") && types === TypesList) {
      setTypes([]);
    } else if (label.startsWith("all") && types !== TypesList) {
      setTypes(TypesList);
    } else if (!checked && types.includes(label)) {
      setTypes(types.filter((t) => t !== label));
    } else {
      setTypes([...types, label]);
    }
  };

  // Handle Habitat State
  const handleHabitat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor as z.infer<typeof ZodHabitat>;
    const checked = e.target.checked;
    if (label.startsWith("all") && habitats === HabitatList) {
      setHabitats([]);
    } else if (label.startsWith("all") && habitats !== HabitatList) {
      setHabitats(HabitatList);
    } else if (!checked && habitats.includes(label)) {
      setHabitats(habitats.filter((h) => h !== label));
    } else {
      setHabitats([...habitats, label]);
    }
  };

  if (status === "loading" || getProfile.isInitialLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta
          name="description"
          content="PokéZoo"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>

      {/* Main Game Screen */}
      <ThemeWrapper>
        <Sidebar page="Game">
          <Topbar />
          {deleteList.length > 0 && (
            <div className="sticky top-0 z-10 flex items-center justify-between border-2 border-solid border-black bg-fuchsia-500 p-4">
              <span className="font-bold">
                You have selected {deleteList.length} Pokémon to delete.
              </span>

              <button
                onClick={() => handleDelete()}
                disabled={sellMutation.isLoading}
                className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
              >
                {sellMutation.isLoading ? <LoadingSpinner /> : "Confirm Delete"}
              </button>
            </div>
          )}
          <main className="p-4">
            {getProfile.data?.claimedDaily && time === "day" ? (
              <span>You have already claimed your daily reward.</span>
            ) : !getProfile.data?.claimedDaily && time === "day" ? (
              <button
                onClick={() => claimReward()}
                disabled={rewardMutation.isLoading}
                className="w-48 rounded-lg border-2 border-black bg-yellow-btn-unfocus p-2 font-bold hover:bg-yellow-btn-focus"
              >
                {rewardMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Daily Reward"
                )}
              </button>
            ) : getProfile.data?.claimedNightly && time === "night" ? (
              <span>You have already claimed your nightly reward.</span>
            ) : !getProfile.data?.claimedNightly && time === "night" ? (
              <button
                onClick={() => claimReward()}
                disabled={rewardMutation.isLoading}
                className="w-48 rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus"
              >
                {rewardMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Nightly Reward"
                )}
              </button>
            ) : (
              <></>
            )}
            {day >= 25 &&
              month === 12 &&
              (!getProfile.data?.claimedEvent ? (
                <div className="pt-4">
                  <button
                    onClick={() => claimEvent()}
                    disabled={eventMutation.isLoading}
                    className="w-60 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold"
                  >
                    {eventMutation.isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      "Claim Christmas Present"
                    )}
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <div className="candy-cane pb-4 text-center text-7xl">
                    Merry Christmas!
                  </div>
                </div>
              ))}
            {day <= 7 &&
              month === 1 &&
              (!getProfile.data?.claimedEvent ? (
                <div className="pt-4">
                  <button
                    onClick={() => claimEvent()}
                    disabled={eventMutation.isLoading}
                    className="w-60 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold"
                  >
                    {eventMutation.isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      "Claim New Year's Present"
                    )}
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <div className="new-year pb-4 text-center text-7xl">
                    Happy New Year!
                  </div>
                </div>
              ))}
            {day >= 5 &&
              day <= 12 &&
              month === 4 &&
              (!getProfile.data?.claimedEvent ? (
                <div className="pt-4">
                  <button
                    onClick={() => claimEvent()}
                    disabled={eventMutation.isLoading}
                    className="w-60 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold"
                  >
                    {eventMutation.isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      "Claim PokéZoo Day Present"
                    )}
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <div
                    className="pokezoo pb-4 text-center text-7xl"
                    data-text="Happy PokéZoo Day!"
                  >
                    <span style={{ "--i": 1 } as React.CSSProperties}>H</span>
                    <span style={{ "--i": 2 } as React.CSSProperties}>a</span>
                    <span style={{ "--i": 3 } as React.CSSProperties}>p</span>
                    <span style={{ "--i": 4 } as React.CSSProperties}>p</span>
                    <span style={{ "--i": 5 } as React.CSSProperties}>y</span>
                    <span
                      style={{ "--i": 6 } as React.CSSProperties}
                      className="ml-4"
                    >
                      P
                    </span>
                    <span style={{ "--i": 7 } as React.CSSProperties}>o</span>
                    <span style={{ "--i": 8 } as React.CSSProperties}>k</span>
                    <span style={{ "--i": 9 } as React.CSSProperties}>é</span>
                    <span style={{ "--i": 10 } as React.CSSProperties}>Z</span>
                    <span style={{ "--i": 11 } as React.CSSProperties}>o</span>
                    <span style={{ "--i": 12 } as React.CSSProperties}>o</span>
                    <span
                      style={{ "--i": 13 } as React.CSSProperties}
                      className="ml-4"
                    >
                      D
                    </span>
                    <span style={{ "--i": 14 } as React.CSSProperties}>a</span>
                    <span style={{ "--i": 15 } as React.CSSProperties}>y</span>
                    <span style={{ "--i": 16 } as React.CSSProperties}>!</span>
                  </div>
                </div>
              ))}
            {error && <p>{error}</p>}
            <Dropdown
              dropdowns={dropdowns}
              handleDropdowns={handleDropdowns}
              shiny={shiny}
              regions={regions}
              rarities={rarities}
              types={types}
              habitats={habitats}
              handleShiny={handleShiny}
              handleRegion={handleRegion}
              handleRarity={handleRarity}
              handleType={handleType}
              handleHabitat={handleHabitat}
            />
            <div className="flex justify-center gap-5 pt-5">
              <button
                onClick={() => setSort("Oldest")}
                className={`${
                  sort === "Oldest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="oldest-sort"
              >
                Oldest
              </button>
              <button
                onClick={() => setSort("Newest")}
                className={`${
                  sort === "Newest"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="newest-sort"
              >
                Newest
              </button>
              <button
                onClick={() => setSort("Pokedex")}
                className={`${
                  sort === "Pokedex"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="pokedex-sort"
              >
                Pokédex #
              </button>
              <button
                onClick={() => setSort("PokedexDesc")}
                className={`${
                  sort === "PokedexDesc"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="pokedex-desc-sort"
              >
                Pokédex # Desc.
              </button>
              <button
                onClick={() => setSort("Rarity")}
                className={`${
                  sort === "Rarity"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="rarity-sort"
              >
                Rarity
              </button>
              <button
                onClick={() => setSort("RarityDesc")}
                className={`${
                  sort === "RarityDesc"
                    ? `bg-purple-btn-focus`
                    : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
                } w-40 rounded-lg border-2 border-black p-2 font-bold`}
                data-testid="rarity-desc-sort"
              >
                Rarity Desc.
              </button>
            </div>
            {getGame.isInitialLoading && (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            )}
            <div className="cards grid justify-center gap-x-5 gap-y-5 pt-5">
              {getGame.data?.pages.map((p, index) => (
                <Fragment key={index}>
                  {p.instancesData.map((c) => (
                    <Card
                      key={c.instance.id}
                      instance={c.instance}
                      species={c}
                      modifyDeleteList={modifyDeleteList}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
            {getGame.hasNextPage && (
              <div
                ref={ref}
                className="flex h-16 justify-center pt-4"
              >
                {getGame.isFetchingNextPage && <LoadingSpinner />}
              </div>
            )}
          </main>
        </Sidebar>
      </ThemeWrapper>

      {/* Modal for New Players */}
      {getProfile.data?.instanceCount === 0 && (
        <Start
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
          {dailyReward.modal &&
            Object.keys(dailyReward.cards).map((key) => {
              return (
                <div
                  key={key}
                  className="flex"
                >
                  {dailyReward.cards[key as keyof typeof dailyReward.cards] >
                    0 && (
                    <>
                      <div className="text-xl font-medium">
                        You received{" "}
                        {
                          dailyReward.cards[
                            key as keyof typeof dailyReward.cards
                          ]
                        }{" "}
                        {key} wildcard
                        {dailyReward.cards[
                          key as keyof typeof dailyReward.cards
                        ] > 1 && "s"}
                        !
                      </div>
                      <img
                        src={
                          key === "Common"
                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png`
                            : key === "Rare"
                              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png`
                              : key === "Epic"
                                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png`
                                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png`
                        }
                        alt={
                          key === "Common"
                            ? `common-wildcard`
                            : key === "Rare"
                              ? `rare-wildcard`
                              : key === "Epic"
                                ? `epic-wildcard`
                                : `legendary-wildcard`
                        }
                      />
                    </>
                  )}
                </div>
              );
            })}
          {nightlyReward.modal &&
            Object.keys(nightlyReward.cards).map((key) => {
              return (
                <div
                  key={key}
                  className="flex"
                >
                  {nightlyReward.cards[
                    key as keyof typeof nightlyReward.cards
                  ] > 0 && (
                    <>
                      <div className="text-xl font-medium">
                        You received{" "}
                        {
                          nightlyReward.cards[
                            key as keyof typeof nightlyReward.cards
                          ]
                        }{" "}
                        {key} wildcard
                        {nightlyReward.cards[
                          key as keyof typeof nightlyReward.cards
                        ] > 1 && "s"}
                        !
                      </div>
                      <img
                        src={
                          key === "Common"
                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png`
                            : key === "Rare"
                              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png`
                              : key === "Epic"
                                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png`
                                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png`
                        }
                        alt={
                          key === "Common"
                            ? `common-wildcard`
                            : key === "Rare"
                              ? `rare-wildcard`
                              : key === "Epic"
                                ? `epic-wildcard`
                                : `legendary-wildcard`
                        }
                      />
                    </>
                  )}
                </div>
              );
            })}
          <div className="pt-4">
            <button
              onClick={() => {
                setDailyReward({ ...dailyReward, modal: false });
                setNightlyReward({ ...nightlyReward, modal: false });
              }}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Event Reward */}
      {eventModal.modal && eventModal.reward && (
        <Modal size="Small">
          {day >= 25 && month === 12 && (
            <div className="candy-cane p-2 text-3xl font-bold">
              Merry Christmas!
            </div>
          )}
          {day <= 7 && month === 1 && (
            <div className="new-year p-2 text-3xl font-bold">
              Happy New Year!
            </div>
          )}
          {"aeiou".includes(eventModal.reward.name[0]) ? (
            <div className="text-center text-xl font-bold">
              You got an{" "}
              {eventModal.reward.name[0].toUpperCase() +
                eventModal.reward.name.slice(1).toLowerCase()}
              !{" "}
            </div>
          ) : (
            <div className="text-center text-xl font-bold">
              You got a{" "}
              {eventModal.reward.name[0].toUpperCase() +
                eventModal.reward.name.slice(1).toLowerCase()}
              !
            </div>
          )}
          <Card species={eventModal.reward} />
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setEventModal({ modal: false, reward: null })}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Username */}
      {!getProfile.data?.username && (
        <Modal size="Small">
          <form
            onSubmit={(e) => handleUsername(e)}
            className="flex w-full flex-col items-center gap-5"
          >
            <p className="text-xl font-bold">Enter a Username</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-black"
            ></input>
            <button
              disabled={usernameMutation.isLoading}
              className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 text-xl font-bold hover:bg-red-btn-focus"
            >
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
      {!getProfile.data?.johtoStarter && (
        <Start
          region="Johto"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Hoenn Starter */}
      {!getProfile.data?.hoennStarter && (
        <Start
          region="Hoenn"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Sinnoh Starter */}
      {!getProfile.data?.sinnohStarter && (
        <Start
          region="Sinnoh"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Unova Starter */}
      {!getProfile.data?.unovaStarter && (
        <Start
          region="Unova"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Kalos Starter */}
      {!getProfile.data?.kalosStarter && (
        <Start
          region="Kalos"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Alola Starter */}
      {!getProfile.data?.alolaStarter && (
        <Start
          region="Alola"
          addStarter={addStarter}
        />
      )}

      {/* Modal for Galar Starter */}
      {!getProfile.data?.galarStarter && (
        <Start
          region="Galar"
          addStarter={addStarter}
        />
      )}
    </>
  );
}
