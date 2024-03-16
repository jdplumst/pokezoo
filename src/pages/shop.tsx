import Head from "next/head";
import { useContext, useRef, useState } from "react";
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
import { type ZodRegion, type ZodRarity, type ZodSpecies } from "@/src/zod";
import {
  type selectCharmSchema,
  type selectBallSchema
} from "../server/db/schema";
import { ThemeContext } from "../components/ThemeContextProvider";
import ThemeWrapper from "../components/ThemeWrapper";
import { RegionsList } from "../constants";
import Wildcard from "../components/Wildcard";

export default function Shop() {
  const { status } = useSession({
    required: true
  });

  const utils = trpc.useUtils();

  const { time } = useContext(ThemeContext);

  const { data: speciesData } = trpc.species.getSpecies.useQuery({
    order: null
  });

  const { data: ballData, isLoading: ballLoading } =
    trpc.ball.getBalls.useQuery();

  const { data: charmData, isLoading: charmLoading } =
    trpc.charm.getCharms.useQuery();

  const { data: userCharmData, isLoading: userCharmLoading } = trpc.charm.getUserCharms.useQuery();

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
  const [purchasedWildcard, setPurchasedWildcard] = useState<z.infer<typeof ZodRarity> | null>(null)

  // Premier Ball
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionCurr, setRegionCurr] = useState<z.infer<
    typeof ZodRegion
  > | null>(null);
  const [regionError, setRegionError] = useState(false);
  const premierRef = useRef<HTMLButtonElement>(null);

  const purchaseBall = (ball: z.infer<typeof selectBallSchema>) => {
    setBoughtBall(ball);

    if (ball.name === "Premier" && !regionCurr) {
      setRegionError(true);
      return;
    }

    setRegionError(false);

    // Determine if shiny
    const shinyRandomizer = Math.floor(Math.random() * 4096) + 1;
    let shiny = false;
    if (shinyRandomizer === 8) {
      shiny = true;
    }

    // Filter species based on time
    let timeSpecies = speciesData?.species.slice();
    if (time === "day") {
      timeSpecies = speciesData?.species.filter(
        (s) => s.habitat !== "Cave" && s.habitat !== "Forest"
      );
    } else if (time === "night") {
      timeSpecies = speciesData?.species.filter(
        (s) => s.habitat !== "Grassland"
      );
    }

    // Filter species based on ball
    let filteredSpecies = timeSpecies?.slice();
    if (ball.name === "Net") {
      filteredSpecies = timeSpecies?.filter(
        (s) =>
          s.typeOne === "Water" ||
          s.typeTwo === "Water" ||
          s.typeOne === "Bug" ||
          s.typeTwo === "Bug"
      );
    } else if (ball.name === "Dusk") {
      filteredSpecies = timeSpecies?.filter(
        (s) =>
          s.typeOne === "Dark" ||
          s.typeTwo === "Dark" ||
          s.typeOne === "Ghost" ||
          s.typeTwo === "Ghost"
      );
    } else if (ball.name === "Dive") {
      filteredSpecies = timeSpecies?.filter(
        (s) => s.habitat === "WatersEdge" || s.habitat === "Sea"
      );
    } else if (ball.name === "Safari") {
      filteredSpecies = timeSpecies?.filter(
        (s) => s.habitat === "Mountain" || s.habitat === "RoughTerrain"
      );
    } else if (ball.name === "Premier") {
      filteredSpecies = timeSpecies?.filter((s) => s.region === regionCurr);
    }

    // Determine rarity
    const randomizer: z.infer<typeof ZodRarity>[] = [];
    for (let i = 0; i < ball.commonChance; i++) {
      randomizer.push("Common");
    }
    for (let i = 0; i < ball.rareChance; i++) {
      randomizer.push("Rare");
    }
    for (let i = 0; i < ball.epicChance; i++) {
      randomizer.push("Epic");
    }
    for (let i = 0; i < ball.legendaryChance; i++) {
      randomizer.push("Legendary");
    }
    for (let i = 0; i < ball.megaChance; i++) {
      randomizer.push("Mega");
    }
    const rarity = randomizer[Math.floor(Math.random() * 100)];

    // Determine the new species the user gets
    let newInstance = speciesData?.species[0];
    if (rarity === "Common" && !shiny) {
      const commonSpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Common" && !s.shiny
      );
      newInstance =
        commonSpecies![Math.floor(Math.random() * commonSpecies!.length)];
    } else if (rarity === "Rare" && !shiny) {
      const rareSpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Rare" && !s.shiny
      );
      newInstance =
        rareSpecies![Math.floor(Math.random() * rareSpecies!.length)];
    } else if (rarity === "Epic" && !shiny) {
      const epicSpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Epic" && !s.shiny
      );
      newInstance =
        epicSpecies![Math.floor(Math.random() * epicSpecies!.length)];
    } else if (rarity === "Legendary" && !shiny) {
      const legendarySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Legendary" && !s.shiny
      );
      newInstance =
        legendarySpecies![Math.floor(Math.random() * legendarySpecies!.length)];
    } else if (rarity === "Mega" && !shiny) {
      const megaSpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Mega" && !s.shiny
      );
      newInstance =
        megaSpecies![Math.floor(Math.random() * megaSpecies!.length)];
    } else if (rarity === "Common" && shiny) {
      const commonShinySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Common" && s.shiny
      );
      newInstance =
        commonShinySpecies![
        Math.floor(Math.random() * commonShinySpecies!.length)
        ];
    } else if (rarity === "Rare" && shiny) {
      const rareShinySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Rare" && s.shiny
      );
      newInstance =
        rareShinySpecies![Math.floor(Math.random() * rareShinySpecies!.length)];
    } else if (rarity === "Epic" && shiny) {
      const epicShinySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Epic" && s.shiny
      );
      newInstance =
        epicShinySpecies![Math.floor(Math.random() * epicShinySpecies!.length)];
    } else if (rarity === "Legendary" && shiny) {
      const legendaryShinySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Legendary" && s.shiny
      );
      newInstance =
        legendaryShinySpecies![
        Math.floor(Math.random() * legendaryShinySpecies!.length)
        ];
    } else if (rarity === "Mega" && shiny) {
      const megaShinySpecies = filteredSpecies?.filter(
        (s) => s.rarity === "Mega" && s.shiny
      );
      newInstance =
        megaShinySpecies![Math.floor(Math.random() * megaShinySpecies!.length)];
    }

    // Create new instance
    ballMutation.mutate(
      { speciesId: newInstance!.id, cost: ball.cost },
      {
        onSuccess(data) {
          void utils.profile.getProfile.invalidate();
          setNewSpecies(
            speciesData?.species.filter(
              (s) => s.id === data.instance.speciesId
            )[0]
          );
          setOpenModal(true);
          setError(null);
        },
        onError(error) {
          setError(error.message);
        }
      }
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
        }
      }
    );
  };

  const purchaseWildcard = (tradedCard: z.infer<typeof ZodRarity>, purchasedCard: z.infer<typeof ZodRarity>) => {
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
          setError(error.message)
        }
      }
    )
  }

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Shop</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
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
                    <Tooltip ball={b} key={b.id}>
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
                                ref={premierRef}
                                onClick={() => {
                                  setRegionOpen((p) => !p);
                                }}
                                className={`w-24 rounded-lg border-2 ${regionError ? "border-red-500" : "border-black"
                                  } bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus`}>
                                {regionCurr ?? "Region"}
                              </button>
                            )}
                            <button
                              onClick={() => purchaseBall(b)}
                              disabled={ballMutation.isLoading}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
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
                    <Tooltip key={c.id} charm={c}>
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
                          {userCharmData?.charmsData.some(u => u.charm?.id === c.id) ?
                            <p className="text-center text-xl">
                              You have already purchased this charm
                            </p>
                            :
                            <button
                              onClick={() => purchaseCharm(c)}
                              disabled={charmMutation.isLoading}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                              {charmMutation.isLoading && boughtCharm === c ? (
                                <LoadingSpinner />
                              ) : (
                                "Buy"
                              )}
                            </button>
                          }
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
                <div className="balls grid justify-center gap-10 pt-5">
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard wildcard="Common" width={112} height={112} />
                      <p className="text-center text-3xl font-bold">Common Wildcard</p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Rare", "Common")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Rare" height={25} width={25} /></div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Common")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Epic" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Legendary", "Common")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Legendary" height={25} width={25} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard wildcard="Rare" width={112} height={112} />
                      <p className="text-center text-3xl font-bold">Rare Wildcard</p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Common", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center"><span>2</span>
                            <Wildcard wildcard="Common" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Epic" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Legendary", "Rare")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Legendary" height={25} width={25} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard wildcard="Epic" width={112} height={112} />
                      <p className="text-center text-3xl font-bold">Epic Wildcard</p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Common", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center"><span>4</span>
                            <Wildcard wildcard="Common" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Rare", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>2</span>
                            <Wildcard wildcard="Rare" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Legendary", "Epic")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>1</span>
                            <Wildcard wildcard="Legendary" height={25} width={25} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-72 border-2 border-black bg-ball p-2">
                    <div className="flex h-full flex-col items-center justify-around">
                      <Wildcard wildcard="Legendary" width={112} height={112} />
                      <p className="text-center text-3xl font-bold">Legendary Wildcard</p>
                      <div className="flex gap-5">
                        <button
                          onClick={() => purchaseWildcard("Common", "Legendary")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center"><span>50</span>
                            <Wildcard wildcard="Common" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Rare", "Legendary")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>35</span>
                            <Wildcard wildcard="Rare" height={25} width={25} />
                          </div>
                        </button>
                        <button
                          onClick={() => purchaseWildcard("Epic", "Legendary")}
                          disabled={wildcardMutation.isLoading}
                          className="w-14 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                          <div className="flex justify-center">
                            <span>15</span>
                            <Wildcard wildcard="Epic" height={25} width={25} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </Sidebar >
      </ThemeWrapper >

      {/* Modal for Bought Instance */}
      {
        openModal && newSpecies && (
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
                className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                Got it!
              </button>
            </div>
          </Modal>
        )
      }

      {/* Modal for Premier Ball */}
      {
        regionOpen && (
          <Modal size="Small">
            <p className="text-xl font-bold">Select a Region</p>
            <div className="flex gap-5 pt-5">
              {RegionsList.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRegionCurr(r);
                    setRegionOpen(false);
                    premierRef.current!.scrollIntoView();
                  }}
                  className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                  {r}
                </button>
              ))}
            </div>
          </Modal>
        )
      }

      {/* Modal for Bought Charm */}
      {
        openModal && !newSpecies && boughtCharm && (
          <Modal size="Small">
            <div className="flex flex-col items-center gap-4">
              <div className="text-xl font-bold text-center">
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
                className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                Got it!
              </button>
            </div>
          </Modal>
        )
      }

      {/* Modal for Purchased Wildcard */}
      {
        openModal && purchasedWildcard && (
          <Modal size="Small">
            <div className="flex flex-col items-center gap-4">
              <div className="text-xl font-bold text-center">
                You Have Purchased a {purchasedWildcard} Wildcard!
              </div>
              <Wildcard wildcard={purchasedWildcard} width={112} height={112} />
              <button onClick={() => {
                setOpenModal(false);
                setPurchasedWildcard(null);
              }}
                className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                Got it!
              </button>
            </div>
          </Modal>
        )
      }
    </>
  );
}
