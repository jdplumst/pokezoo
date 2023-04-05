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
import { SpeciesInstances } from "@prisma/client";
import Tooltip, { Ball } from "@/components/Tooltip";

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
  return {
    props: { user, species, instances }
  };
};

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [add, setAdd] = useState(false);
  const [ball, setBall] = useState<Ball | null>(null);
  const [addError, setAddError] = useState<any>(null);

  const [instancesState, setInstancesState] = useState(instances);

  const addStarter = (i: SpeciesInstances) => {
    setInstancesState((prevInstancesState) => [...prevInstancesState, i]);
  };

  const closeAdd = () => {
    if (ball) {
      setAdd(false);
      setAddError(null);
      setBall(null);
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
        <Start species={species} user={user} addStarter={addStarter} />
      )}

      {/* Modal to Add New Pokémon */}
      {add && (
        <Modal
          open={add}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4 text-white">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center">
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
              </Tooltip>
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => closeAdd()}
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
          <p>Your current balance is P{user.balance}.</p>
          <p>You will receive P{user.totalYield} on the next payout.</p>
          <div className="cards grid gap-5 pt-5">
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
            {instancesState.map((i) => (
              <Card
                key={i.id}
                instance={i}
                species={species.filter((s) => s.id === i.speciesId)[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
