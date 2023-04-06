import Navbar from "@/components/Navbar";
import client from "@/prisma/script";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Head from "next/head";
import Card from "@/components/Card";
import Start from "@/components/Start";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Rarity, Species, SpeciesInstances } from "@prisma/client";
import Tooltip, { Ball } from "@/components/Tooltip";
import { AiFillCloseCircle } from "react-icons/ai";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }

  const user = session.user;
  const species = await client.species.findMany();
  const instances = await client.speciesInstances.findMany({
    where: { userId: user.id.toString() }
  });
  const commonSpecies = species.filter((s) => s.rarity === Rarity.Common);
  const rareSpecies = species.filter((s) => s.rarity === Rarity.Rare);
  const epicSpecies = species.filter((s) => s.rarity === Rarity.Epic);
  const legendarySpecies = species.filter((s) => s.rarity === Rarity.Legendary);
  return {
    props: {
      user,
      species,
      instances,
      commonSpecies,
      rareSpecies,
      epicSpecies,
      legendarySpecies
    }
  };
};

export default function Game({
  user,
  species,
  instances,
  commonSpecies,
  rareSpecies,
  epicSpecies,
  legendarySpecies
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Variables associated with add modal
  const [add, setAdd] = useState(false);
  const [ball, setBall] = useState<Ball | null>(null);
  const [addError, setAddError] = useState<any>(null);
  const pokeAmt = 100;
  const greatAmt = 1000;
  const ultraAmt = 10000;
  const masterAmt = 100000;

  const [cards, setCards] = useState(instances);
  const [balance, setBalance] = useState(user.balance);
  const [totalYield, setTotalYield] = useState(user.totalYield);

  const addStarter = (i: SpeciesInstances) => {
    setCards((prevCards) => [...prevCards, i]);
  };

  const addStarterYield = () => {
    setTotalYield(20);
  };

  // Send POST request to add new instance
  const addInstance = async (newInstance: Species, cost: number) => {
    const response = await fetch("api/instances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        speciesId: newInstance.id,
        newYield: newInstance.yield,
        totalYield: totalYield,
        balance: balance,
        cost: cost
      })
    });
    const data = await response.json();
    return { response, data };
  };

  const confirmAdd = async () => {
    if (ball) {
      if (
        // Set error if user can't afford to buy the ball
        (ball === "Poke" && balance < pokeAmt) ||
        (ball === "Great" && balance < greatAmt) ||
        (ball === "Ultra" && balance < ultraAmt) ||
        (ball === "Master" && balance < masterAmt)
      ) {
        setAddError("Cannot afford this ball at this time");
      } else {
        // Logic to determine what species the user gets
        if (ball === "Poke") {
          const random = Math.floor(Math.random() * 100);
          let newInstance = species[0];
          if (random <= 80) {
            newInstance =
              commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
          } else if (random <= 95) {
            newInstance =
              rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
          } else {
            newInstance =
              epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
          }
          const { response, data } = await addInstance(newInstance, pokeAmt);
          if (response.ok) {
            setCards((prevCards) => [...prevCards, data.instance]);
            setBalance((prevBalance) => prevBalance - pokeAmt);
            setTotalYield(
              (prevTotalYield) => prevTotalYield + newInstance.yield
            );
          } else if (!response.ok) {
            setAddError("Something went wrong. Try again.");
            return;
          }
        } else if (ball === "Great") {
          const random = Math.floor(Math.random() * 100);
          let newInstance = species[0];
          if (random <= 60) {
            newInstance =
              commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
          } else if (random <= 90) {
            newInstance =
              rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
          } else {
            newInstance =
              epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
          }
          const { response, data } = await addInstance(newInstance, greatAmt);
          if (response.ok) {
            setCards((prevCards) => [...prevCards, data.instance]);
            setBalance((prevBalance) => prevBalance - greatAmt);
            setTotalYield(
              (prevTotalYield) => prevTotalYield + newInstance.yield
            );
          } else if (!response.ok) {
            setAddError("Something went wrong. Try again.");
            return;
          }
        } else if (ball === "Ultra") {
          const random = Math.floor(Math.random() * 100);
          let newInstance = species[0];
          if (random <= 40) {
            newInstance =
              commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
          } else if (random <= 80) {
            newInstance =
              rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
          } else if (random <= 98) {
            newInstance =
              epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
          } else {
            newInstance =
              legendarySpecies[
                Math.floor(Math.random() * legendarySpecies.length)
              ];
          }
          const { response, data } = await addInstance(newInstance, ultraAmt);
          if (response.ok) {
            setCards((prevCards) => [...prevCards, data.instance]);
            setBalance((prevBalance) => prevBalance - ultraAmt);
            setTotalYield(
              (prevTotalYield) => prevTotalYield + newInstance.yield
            );
          } else if (!response.ok) {
            setAddError("Something went wrong. Try again.");
            return;
          }
        } else if (ball === "Master") {
          const random = Math.floor(Math.random() * 100);
          let newInstance = species[0];
          if (random <= 25) {
            newInstance =
              commonSpecies[Math.floor(Math.random() * commonSpecies.length)];
          } else if (random <= 60) {
            newInstance =
              rareSpecies[Math.floor(Math.random() * rareSpecies.length)];
          } else if (random <= 95) {
            newInstance =
              epicSpecies[Math.floor(Math.random() * epicSpecies.length)];
          } else {
            newInstance =
              legendarySpecies[
                Math.floor(Math.random() * legendarySpecies.length)
              ];
          }
          const { response, data } = await addInstance(newInstance, masterAmt);
          if (response.ok) {
            setCards((prevCards) => [...prevCards, data.instance]);
            setBalance((prevBalance) => prevBalance - masterAmt);
            setTotalYield(
              (prevTotalYield) => prevTotalYield + newInstance.yield
            );
          } else if (!response.ok) {
            setAddError("Something went wrong. Try again.");
            return;
          }
        }
        setAdd(false);
        setAddError(null);
        setBall(null);
      }
    } else if (!ball) {
      setAddError("Must select a ball");
    }
  };

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/master-ball.png" />
      </Head>

      {/* Modal for New Players */}
      {instances.length === 0 && (
        <Start
          species={species}
          totalYield={totalYield}
          balance={balance}
          addStarter={addStarter}
          addStarterYield={addStarterYield}
        />
      )}

      {/* Modal to Add New Pokémon */}
      {add && (
        <Modal
          open={add}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4 text-white">
            <AiFillCloseCircle
              onClick={() => setAdd(false)}
              className="absolute top-4 right-4 hover:cursor-pointer"
            />
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="pt-2 text-center">
              <strong>Unlock a New Pokémon</strong>
            </Typography>
            <Typography
              id="modal-modal-description"
              className="pt-2 text-center">
              Please select which Pokéball you'd like to open
            </Typography>
            <div className="flex gap-10 pt-4">
              <Tooltip ball="Poke">
                <div
                  className={`${
                    ball === "Poke" ? `border-red-500` : `border-black`
                  } border-4 bg-slate-400`}>
                  <button
                    onClick={() => setBall("Poke")}
                    className="hover:cursor-pointer">
                    <Image
                      src="/img/poke-ball.png"
                      alt="poke-ball"
                      width={100}
                      height={100}
                      className="pixelated"
                    />
                  </button>
                </div>
                <div className="text-center">
                  P{pokeAmt.toLocaleString("en-US")}
                </div>
              </Tooltip>
              <Tooltip ball="Great">
                <div
                  className={`${
                    ball === "Great" ? `border-red-500` : `border-black`
                  } border-4 bg-slate-400`}>
                  <button
                    onClick={() => setBall("Great")}
                    className="hover:cursor-pointer">
                    <Image
                      src="/img/great-ball.png"
                      alt="great-ball"
                      width={100}
                      height={100}
                      className="pixelated"
                    />
                  </button>
                </div>
                <div className="text-center">
                  P{greatAmt.toLocaleString("en-US")}
                </div>
              </Tooltip>
              <Tooltip ball="Ultra">
                <div
                  className={`${
                    ball === "Ultra" ? `border-red-500` : `border-black`
                  } border-4 bg-slate-400`}>
                  <button
                    onClick={() => setBall("Ultra")}
                    className="hover:cursor-pointer">
                    <Image
                      src="/img/ultra-ball.png"
                      alt="ultra-ball"
                      width={100}
                      height={100}
                      className="pixelated"
                    />
                  </button>
                </div>
                <div className="text-center">
                  P{ultraAmt.toLocaleString("en-US")}
                </div>
              </Tooltip>
              <Tooltip ball="Master">
                <div
                  className={`${
                    ball === "Master" ? `border-red-500` : `border-black`
                  } border-4 bg-slate-400`}>
                  <button
                    onClick={() => setBall("Master")}
                    className="hover:cursor-pointer">
                    <Image
                      src="/img/master-ball.png"
                      alt="master-ball"
                      width={100}
                      height={100}
                      className="pixelated"
                    />
                  </button>
                </div>
                <div className="text-center">
                  P{masterAmt.toLocaleString("en-US")}
                </div>
              </Tooltip>
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => confirmAdd()}
                className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                Confirm Selection
              </button>
            </div>
            {addError && (
              <div className="flex justify-center pt-4 text-red-500">
                {addError}
              </div>
            )}
          </Box>
        </Modal>
      )}

      {/* Main Game Screen */}
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Navbar />
        <div className="p-4">
          <p>Your current balance is P{balance}.</p>
          <p>You will receive P{totalYield} on the next payout.</p>
          <div className="cards grid justify-center gap-5 pt-5">
            <div className="flex h-52 w-52 flex-col items-center justify-evenly border-2 border-black bg-slate-400">
              <Image
                src="/img/master-ball.png"
                alt="new_pokemon"
                width={100}
                height={100}
                className="pixelated"
              />
              <button
                onClick={() => setAdd(true)}
                className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
                Add Pokemon
              </button>
            </div>
            {cards.map((c) => (
              <Card
                key={c.id}
                instance={c}
                species={species.filter((s) => s.id === c.speciesId)[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
