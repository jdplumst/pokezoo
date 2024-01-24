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
import { type ZodRegion, type ZodRarity } from "@/src/zod";
import {
  type selectBallSchema,
  type selectSpeciesSchema
} from "../server/db/schema";
import { ThemeContext } from "../components/ThemeContextProvider";
import ThemeWrapper from "../components/ThemeWrapper";
import { RegionsList } from "../constants";

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

  const [error, setError] = useState<string | null>(null);
  const [boughtBall, setBoughtBall] =
    useState<z.infer<typeof selectBallSchema>>();
  const purchaseMutation = trpc.instance.purchaseInstanceWithBall.useMutation();

  // Modal variables
  const [openModal, setOpenModal] = useState(false);
  const [newSpecies, setNewSpecies] =
    useState<z.infer<typeof selectSpeciesSchema>>();

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
    }

    // Create new instance
    purchaseMutation.mutate(
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
            {ballLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
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
                              className={`w-24 rounded-lg border-2 ${
                                regionError ? "border-red-500" : "border-black"
                              } bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus`}>
                              {regionCurr ?? "Region"}
                            </button>
                          )}
                          <button
                            onClick={() => purchaseBall(b)}
                            disabled={purchaseMutation.isLoading}
                            className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                            {purchaseMutation.isLoading && boughtBall === b ? (
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
            )}
          </main>
        </Sidebar>
      </ThemeWrapper>

      {/* Modal for Bought Instance */}
      {openModal && newSpecies && (
        <Modal size="Small">
          {"aeiou".includes(newSpecies.name[0]) ? (
            <div className="text-center text-xl font-bold">
              You got an{" "}
              {newSpecies.name[0].toUpperCase() +
                newSpecies.name.slice(1).toLowerCase()}
              !{" "}
            </div>
          ) : (
            <div className="text-center text-xl font-bold">
              You got a{" "}
              {newSpecies.name[0].toUpperCase() +
                newSpecies.name.slice(1).toLowerCase()}
              !
            </div>
          )}
          <Card species={newSpecies} />
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setOpenModal(false)}
              className="pointer-events-auto rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
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
      )}
    </>
  );
}
