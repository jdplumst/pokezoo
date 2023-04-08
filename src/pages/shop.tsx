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
  const commonSpecies = species.filter((s) => s.rarity === Rarity.Common);
  const rareSpecies = species.filter((s) => s.rarity === Rarity.Rare);
  const epicSpecies = species.filter((s) => s.rarity === Rarity.Epic);
  const legendarySpecies = species.filter((s) => s.rarity === Rarity.Legendary);
  return {
    props: {
      user,
      balls,
      species,
      commonSpecies,
      rareSpecies,
      epicSpecies,
      legendarySpecies
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
  legendarySpecies
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  // Modal variables
  const [openModal, setOpenModal] = useState(false);
  const [newSpecies, setNewSpecies] = useState<Species>(commonSpecies[0]);

  const purchaseBall = async (ball: Ball) => {
    // Disable all purchase buttons
    setDisabled(true);

    // Check that user can afford ball
    if (balance < ball.cost) {
      setError("You cannot afford this ball.");
      return;
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
    if (rarity === "Common") {
      newInstance =
        commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
    } else if (rarity === "Rare") {
      newInstance = rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
    } else if (rarity === "Epic") {
      newInstance = epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
    } else {
      newInstance =
        legendarySpecies[Math.floor(Math.random() * legendarySpecies.length)];
    }

    // Create new instance
    try {
      const response = await fetch("api/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speciesId: newInstance.id,
          newYield: newInstance.yield,
          totalYield: totalYield,
          balance: balance,
          cost: ball.cost
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setDisabled(false);
      } else if (response.ok) {
        setBalance((prevBalance) => prevBalance - ball.cost);
        setTotalYield((prevTotalYield) => prevTotalYield + newInstance.yield);
        setNewSpecies(
          species.filter((s) => s.id === data.instance.speciesId)[0]
        );
        setOpenModal(true);
        setDisabled(false);
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
      setDisabled(false);
    }
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
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center font-bold text-white">
            You got a {newSpecies.name}!
          </Typography>
          <Card species={newSpecies} />
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
