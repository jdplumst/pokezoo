import Head from "next/head";
import { useContext, useState } from "react";
import Card from "@/src/components/Card";
import { trpc } from "../utils/trpc";
import Modal from "@/src/components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import Tooltip from "../components/Tooltip";
import Image from "next/image";
import LoadingSpinner from "../components/LoadingSpinner";
import Topbar from "../components/Topbar";
import { useSession } from "next-auth/react";
import { type z } from "zod";
import { type ZodRarity, type ZodSpecies } from "@/src/zod";
import {
  type selectCharmSchema,
  type selectBallSchema,
} from "../server/db/schema";
import { ThemeContext } from "../components/ThemeContextProvider";
import ThemeWrapper from "../components/ThemeWrapper";
import { RegionsList } from "../constants";
import Wildcard from "../components/Wildcard";

export default function Shop() {
  const { status } = useSession({
    required: true,
  });

  const utils = trpc.useUtils();

  const { time } = useContext(ThemeContext);

  const { data: speciesData } = trpc.species.getSpecies.useQuery({
    order: null,
  });

  const { data: ballData, isLoading: ballLoading } =
    trpc.ball.getBalls.useQuery();

  const { data: charmData, isLoading: charmLoading } =
    trpc.charm.getCharms.useQuery();

  const { data: userCharmData, isLoading: userCharmLoading } =
    trpc.charm.getUserCharms.useQuery();

  const [error, setError] = useState<string | null>(null);

  const [boughtBall, setBoughtBall] =
    useState<z.infer<typeof selectBallSchema>>();
  const ballMutation = trpc.instance.purchaseInstanceWithBall.useMutation();

  const [boughtCharm, setBoughtCharm] =
    useState<z.infer<typeof selectCharmSchema>>();
  const charmMutation = trpc.charm.purchaseCharm.useMutation();

  const wildcardMutation = trpc.profile.purchaseWildcards.useMutation();

  // Modal variables
  const [openModal, setOpenModal] = useState(false);
  const [newSpecies, setNewSpecies] = useState<
    z.infer<typeof ZodSpecies> | null | undefined
  >(null);
  const [purchasedWildcard, setPurchasedWildcard] = useState<z.infer<
    typeof ZodRarity
  > | null>(null);

  // Premier Ball
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionCurr, setRegionCurr] = useState<number | null>(null);

  const purchaseBall = (ball: z.infer<typeof selectBallSchema>) => {
    setBoughtBall(ball);

    // Create new instance
    ballMutation.mutate(
      {
        ballId: ball.id,
        regionId: regionCurr !== null ? regionCurr + 1 : regionCurr,
        time: time,
      },
      {
        onSuccess(data) {
          void utils.profile.getProfile.invalidate();
          setNewSpecies(
            speciesData?.species.find((s) => s.id === data.instance.speciesId),
          );
          setOpenModal(true);
          setError(null);
        },
        onError(error) {
          window.scrollTo(0, 0);
          switch (error.data?.code) {
            case "NOT_FOUND":
            case "BAD_REQUEST":
              setError(
                "Make sure to to purchase a real ball or select the region if purchasing a Premier Ball",
              );
              break;
            case "CONFLICT":
              setError(error.message);
              break;
            default:
              setError("Something went wrong. Please try again.");
              break;
          }
        },
      },
    );
  };

  const purchaseCharm = (c: z.infer<typeof selectCharmSchema>) => {
    setBoughtCharm(c);
    charmMutation.mutate(
      { charmId: c.id },
      {
        onSuccess() {
          void utils.profile.getProfile.invalidate();
          setOpenModal(true);
          setError(null);
        },
        onError(error) {
          setError(error.message);
        },
      },
    );
  };

  const purchaseWildcard = (
    tradedCard: z.infer<typeof ZodRarity>,
    purchasedCard: z.infer<typeof ZodRarity>,
  ) => {
    wildcardMutation.mutate(
      { tradedCard: tradedCard, purchasedCard: purchasedCard },
      {
        onSuccess() {
          void utils.profile.getProfile.invalidate();
          setOpenModal(true);
          setPurchasedWildcard(purchasedCard);
          setError(null);
        },
        onError(error) {
          setError(error.message);
        },
      },
    );
  };

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Shop</title>
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
      <ThemeWrapper>
        <Sidebar page="Shop">
          <Topbar />
          <main className="p-4">
            {error && <p className="font-bold text-red-500">{error}</p>}
            {ballLoading || charmLoading || userCharmLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="flex flex-col gap-20">
                <div className="balls grid justify-center gap-10 pt-5">
                  {ballData?.balls.map((b) => (
                    <Tooltip
                      ball={b}
                      key={b.id}
                    >
                      <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                        <div className="flex h-full flex-col items-center justify-around">
                          <Image
                            src={b.img}
                            alt={b.name}
                            width={112}
                            height={112}
                            className="pixelated"
                          />
                          <p className="text-center text-3xl font-bold">
                            {b.name} Ball
                          </p>
                          <p className="text-center text-2xl font-bold">
                            P{b.cost.toLocaleString()}
                          </p>
                          <div className="flex gap-5">
                            {b.name === "Premier" && (
                              <button
                                onClick={() => {
                                  setRegionOpen((p) => !p);
                                }}
                                className={`w-24 rounded-lg border-2 ${"border-black"} bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus`}
                              >
                                {RegionsList[regionCurr ?? -1] ?? "Region"}
                              </button>
                            )}
                            <button
                              onClick={() => purchaseBall(b)}
                              disabled={ballMutation.isLoading}
                              data-testid={`${b.name}-button`}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                            >
                              {ballMutation.isLoading && boughtBall === b ? (
                                <LoadingSpinner />
                              ) : (
                                "Buy"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
                <div className="balls grid justify-center gap-10 pt-5">
                  {charmData?.charms.map((c) => (
                    <Tooltip
                      key={c.id}
                      charm={c}
                    >
                      <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                        <div className="flex h-full flex-col items-center justify-around">
                          <img
                            src={c.img}
                            alt={c.name}
                            width={112}
                            height={112}
                            className="pixelated"
                          />
                          <p className="text-center text-3xl font-bold">
                            {c.name} Charm
                          </p>
                          <p className="text-center text-2xl font-bold">
                            P{c.cost.toLocaleString()}
                          </p>
                          {userCharmData?.charmsData.some(
                            (u) => u.charm?.id === c.id,
                          ) ? (
                            <p className="text-center text-xl">
                              You have already purchased this charm
                            </p>
                          ) : (
                            <button
                              onClick={() => purchaseCharm(c)}
                              disabled={charmMutation.isLoading}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                            >
                              {charmMutation.isLoading && boughtCharm === c ? (
                                <LoadingSpinner />
                              ) : (
                                "Buy"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
                <div className="balls grid justify-center gap-10 pt-5">
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard
                        wildcard="Common"
                        width={112}
                        height={112}
                      />
                      <p className="text-center text-3xl font-bold">
                        Common Wildcard
                      </p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Rare", "Common")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Rare"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Common")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Epic"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() =>
                            purchaseWildcard("Legendary", "Common")
                          }
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Legendary"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard
                        wildcard="Rare"
                        width={112}
                        height={112}
                      />
                      <p className="text-center text-3xl font-bold">
                        Rare Wildcard
                      </p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Common", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>2</span>
                            <Wildcard
                              wildcard="Common"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Epic"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Legendary", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Legendary"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard
                        wildcard="Epic"
                        width={112}
                        height={112}
                      />
                      <p className="text-center text-3xl font-bold">
                        Epic Wildcard
                      </p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Common", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>4</span>
                            <Wildcard
                              wildcard="Common"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Rare", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>2</span>
                            <Wildcard
                              wildcard="Rare"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Legendary", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard
                              wildcard="Legendary"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard
                        wildcard="Legendary"
                        width={112}
                        height={112}
                      />
                      <p className="text-center text-3xl font-bold">
                        Legendary Wildcard
                      </p>
                      <div className="flex gap-5">
                        <button
                          onClick={() =>
                            purchaseWildcard("Common", "Legendary")
                          }
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>50</span>
                            <Wildcard
                              wildcard="Common"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Rare", "Legendary")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>35</span>
                            <Wildcard
                              wildcard="Rare"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Legendary")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                        >
                          <div className="flex justify-center">
                            <span>15</span>
                            <Wildcard
                              wildcard="Epic"
                              height={25}
                              width={25}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </Sidebar>
      </ThemeWrapper>

      {/* Modal for Bought Instance */}
      {openModal && newSpecies && (
        <Modal size="Small">
          {"aeiou".includes(newSpecies.name[0]) ? (
            <div className="text-center text-xl font-bold">
              You got an <span className="capitalize">{newSpecies.name}!</span>{" "}
            </div>
          ) : (
            <div className="text-center text-xl font-bold">
              You got a <span className="capitalize">{newSpecies.name}!</span>
            </div>
          )}
          <Card species={newSpecies} />
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setOpenModal(false);
                setNewSpecies(null);
              }}
              data-testid="confirm-ball-button"
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Premier Ball */}
      {regionOpen && (
        <Modal size="Small">
          <p className="text-xl font-bold">Select a Region</p>
          <div className="flex gap-5 pt-5">
            {RegionsList.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRegionCurr(RegionsList.indexOf(r));
                  setRegionOpen(false);
                }}
                className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
              >
                {r}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal for Bought Charm */}
      {openModal && !newSpecies && boughtCharm && (
        <Modal size="Small">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-xl font-bold">
              You Have Obtained the {boughtCharm?.name} Charm!
            </div>
            <img
              src={boughtCharm.img}
              alt={boughtCharm.name}
              width={112}
              height={112}
              className="pixelated"
            />
            <button
              onClick={() => {
                setOpenModal(false);
                setNewSpecies(null);
              }}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Purchased Wildcard */}
      {openModal && purchasedWildcard && (
        <Modal size="Small">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-xl font-bold">
              You Have Purchased a {purchasedWildcard} Wildcard!
            </div>
            <Wildcard
              wildcard={purchasedWildcard}
              width={112}
              height={112}
            />
            <button
              onClick={() => {
                setOpenModal(false);
                setPurchasedWildcard(null);
              }}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
