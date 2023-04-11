import Navbar from "@/src/components/Navbar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";
import client from "@/prisma/script";
import { useState } from "react";
import BallCard from "@/src/components/BallCard";
import { Ball, Rarity, Species } from "@prisma/client";
import { Box, Modal, Typography } from "@mui/material";
import Card from "@/src/components/Card";
import { trpc } from "../utils/trpc";

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
  const balls = await client.ball.findMany();
  const species = await client.species.findMany();
  const commonSpecies = species.filter(
    (s) => s.rarity === Rarity.Common && !s.shiny
  );
  const rareSpecies = species.filter(
    (s) => s.rarity === Rarity.Rare && !s.shiny
  );
  const epicSpecies = species.filter(
    (s) => s.rarity === Rarity.Epic && !s.shiny
  );
  const legendarySpecies = species.filter(
    (s) => s.rarity === Rarity.Legendary && !s.shiny
  );
  const commonShinySpecies = species.filter(
    (s) => s.rarity === Rarity.Common && s.shiny
  );
  const rareShinySpecies = species.filter(
    (s) => s.rarity === Rarity.Rare && s.shiny
  );
  const epicShinySpecies = species.filter(
    (s) => s.rarity === Rarity.Epic && s.shiny
  );
  const legendaryShinySpecies = species.filter(
    (s) => s.rarity === Rarity.Legendary && s.shiny
  );
  return {
    props: {
      user,
      balls,
      species,
      commonSpecies,
      rareSpecies,
      epicSpecies,
      legendarySpecies,
      commonShinySpecies,
      rareShinySpecies,
      epicShinySpecies,
      legendaryShinySpecies
    }
  };
};

export default function Shop({
  user,
  balls,
  species,
  commonSpecies,
  rareSpecies,
  epicSpecies,
  legendarySpecies,
  commonShinySpecies,
  rareShinySpecies,
  epicShinySpecies,
  legendaryShinySpecies
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const userMutation = trpc.user.updateBuy.useMutation();
  const instanceMutation = trpc.instance.createInstance.useMutation();

  // Modal variables
  const [openModal, setOpenModal] = useState(false);
  const [newSpecies, setNewSpecies] = useState<Species>(commonSpecies[0]);

  const purchaseBall = async (ball: Ball) => {
    // Disable all purchase buttons
    setDisabled(true);

    // Determine if shiny
    const shinyRandomizer = Math.floor(Math.random() * 4096) + 1;
    console.log(shinyRandomizer);
    let shiny = false;
    if (shinyRandomizer === 8) {
      shiny = true;
    } else {
      shiny = false;
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
    let newInstance = commonSpecies[0];
    if (rarity === "Common" && !shiny) {
      newInstance =
        commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
    } else if (rarity === "Rare" && !shiny) {
      newInstance = rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
    } else if (rarity === "Epic" && !shiny) {
      newInstance = epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
    } else if (rarity === "Legendary" && !shiny) {
      newInstance =
        legendarySpecies[Math.floor(Math.random() * legendarySpecies.length)];
    } else if (rarity === "Common" && shiny) {
      newInstance =
        commonShinySpecies[Math.floor(Math.random() * commonSpecies.length)];
    } else if (rarity === "Rare" && shiny) {
      newInstance =
        rareShinySpecies[Math.floor(Math.random() * rareSpecies.length)];
    } else if (rarity === "Epic" && shiny) {
      newInstance =
        epicShinySpecies[Math.floor(Math.random() * epicSpecies.length)];
    } else if (rarity === "Legendary" && shiny) {
      newInstance =
        legendaryShinySpecies[
          Math.floor(Math.random() * legendarySpecies.length)
        ];
    }

    // Create new instance
    userMutation
      .mutateAsync({
        speciesYield: newInstance.yield,
        userYield: totalYield,
        balance: balance,
        cost: ball.cost
      })
      .then((userResponse) => {
        if (userResponse.error) {
          setError(userResponse.error);
          setDisabled(false);
          return;
        } else if (userResponse.user) {
          instanceMutation
            .mutateAsync({ speciesId: newInstance.id })
            .then((instanceResponse) => {
              setBalance(userResponse.user.balance);
              setTotalYield(userResponse.user.totalYield);
              setNewSpecies(
                species.filter(
                  (s) => s.id === instanceResponse.instance.speciesId
                )[0]
              );
              setOpenModal(true);
              setDisabled(false);
            })
            .catch((error) => setError("Something went wrong. Try again."));
        }
      })
      .catch((error) => setError("Something went wrong. Try again"));
  };

  return (
    <>
      <Head>
        <title>PokéZoo - Shop</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/master-ball.png" />
      </Head>

      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center font-bold text-white">
            {"aeiou".includes(newSpecies.name[0]) ? (
              <div>
                You got an{" "}
                {newSpecies.name[0].toUpperCase() +
                  newSpecies.name.slice(1).toLowerCase()}
                !{" "}
              </div>
            ) : (
              <div>
                You got a{" "}
                {newSpecies.name[0].toUpperCase() +
                  newSpecies.name.slice(1).toLowerCase()}
                !
              </div>
            )}
          </Typography>
          <Card species={newSpecies} />
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setOpenModal(false)}
              className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
              Got it!
            </button>
          </div>
        </Box>
      </Modal>

      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Navbar />
        <div className="p-4">
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
        </div>
      </div>
    </>
  );
}
