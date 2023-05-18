import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../server/db";
import { useEffect, useState } from "react";
import BallCard from "@/src/components/BallCard";
import { Ball, Rarity, Species } from "@prisma/client";
import Card from "@/src/components/Card";
import { trpc } from "../utils/trpc";
import Modal from "@/src/components/Modal";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

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
  const balls = await prisma.ball.findMany();
  const species = await prisma.species.findMany();

  return {
    props: {
      user,
      balls,
      species
    }
  };
};

export default function Shop({
  user,
  balls,
  species
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const purchaseMutation = trpc.instance.purchaseInstance.useMutation();

  // Modal variables
  const [openModal, setOpenModal] = useState(false);
  const [newSpecies, setNewSpecies] = useState<Species>(species[0]);

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

  const purchaseBall = async (ball: Ball) => {
    // Disable all purchase buttons
    setDisabled(true);

    // Determine if shiny
    const shinyRandomizer = Math.floor(Math.random() * 4096) + 1;
    let shiny = false;
    if (shinyRandomizer === 8) {
      shiny = true;
    }

    // Filter species based on time
    let timeSpecies = species.slice();
    if (time === "day") {
      timeSpecies = species.filter(
        (s) => s.habitat !== "cave" && s.habitat !== "forest"
      );
    } else if (time === "night") {
      timeSpecies = species.filter((s) => s.habitat !== "grassland");
    }

    // Filter species based on ball
    let filteredSpecies = timeSpecies.slice();
    if (ball.name === "Net") {
      filteredSpecies = timeSpecies.filter(
        (s) =>
          s.typeOne === "water" ||
          s.typeTwo === "water" ||
          s.typeOne === "bug" ||
          s.typeTwo === "bug"
      );
    } else if (ball.name === "Dusk") {
      filteredSpecies = timeSpecies.filter(
        (s) =>
          s.typeOne === "dark" ||
          s.typeTwo === "dark" ||
          s.typeOne === "ghost" ||
          s.typeTwo === "ghost"
      );
    } else if (ball.name === "Dive") {
      filteredSpecies = timeSpecies.filter(
        (s) => s.habitat === "waters-edge" || s.habitat === "sea"
      );
    }

    // Determine rarity
    const randomizer: Rarity[] = [];
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
    let newInstance = species[0];
    if (rarity === "Common" && !shiny) {
      const commonSpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Common && !s.shiny
      );
      newInstance =
        commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
    } else if (rarity === "Rare" && !shiny) {
      const rareSpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Rare && !s.shiny
      );
      newInstance = rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
    } else if (rarity === "Epic" && !shiny) {
      const epicSpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Epic && !s.shiny
      );
      newInstance = epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
    } else if (rarity === "Legendary" && !shiny) {
      const legendarySpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Legendary && !s.shiny
      );
      newInstance =
        legendarySpecies[Math.floor(Math.random() * legendarySpecies.length)];
    } else if (rarity === "Common" && shiny) {
      const commonShinySpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Common && s.shiny
      );
      newInstance =
        commonShinySpecies[
          Math.floor(Math.random() * commonShinySpecies.length)
        ];
    } else if (rarity === "Rare" && shiny) {
      const rareShinySpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Rare && s.shiny
      );
      newInstance =
        rareShinySpecies[Math.floor(Math.random() * rareShinySpecies.length)];
    } else if (rarity === "Epic" && shiny) {
      const epicShinySpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Epic && s.shiny
      );
      newInstance =
        epicShinySpecies[Math.floor(Math.random() * epicShinySpecies.length)];
    } else if (rarity === "Legendary" && shiny) {
      const legendaryShinySpecies = filteredSpecies.filter(
        (s) => s.rarity === Rarity.Legendary && s.shiny
      );
      newInstance =
        legendaryShinySpecies[
          Math.floor(Math.random() * legendaryShinySpecies.length)
        ];
    }

    // Create new instance
    purchaseMutation.mutate(
      { speciesId: newInstance.id, cost: ball.cost },
      {
        onSuccess(data, variables, context) {
          setBalance(data.user.balance);
          setTotalYield(data.user.totalYield);
          setNewSpecies(
            species.filter((s) => s.id === data.instance.speciesId)[0]
          );
          setOpenModal(true);
          window.scrollTo(0, 0);
          setDisabled(false);
          setError(null);
        },
        onError(error, variables, context) {
          setDisabled(false);
          setError(error.message);
        }
      }
    );
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Shop</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div
        className={`z-0 min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Shop">
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
            <p>Your current balance is P{balance}.</p>
            <p>You will receive P{totalYield} on the next payout.</p>
            {error && <p className="font-bold text-red-500">{error}</p>}
            <div className="balls grid justify-center gap-10 pt-5">
              {balls.map((b) => (
                <BallCard
                  key={b.id}
                  ball={b}
                  disabled={disabled}
                  purchaseBall={purchaseBall}
                />
              ))}
            </div>
          </main>
        </Sidebar>
      </div>

      {openModal && (
        <Modal>
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
              className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
              Got it!
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
