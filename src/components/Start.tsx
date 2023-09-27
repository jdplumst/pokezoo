import { useState } from "react";
import Card from "./Card";
import { Species, Instance, Region } from "@prisma/client";
import Modal from "./Modal";
import { trpc } from "../utils/trpc";
import { User } from "next-auth";

interface IStarter {
  user: User;
  species: Species[];
  region: Region;
  addStarter: (i: Instance, r: Region) => void;
}

export default function Start({ user, species, region, addStarter }: IStarter) {
  const [starter, setStarter] = useState<Starter | null>(null);
  const [error, setError] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);
  const purchaseMutation = trpc.instance.purchaseInstance.useMutation(); // Kanto
  const starterMutation = trpc.instance.getStarter.useMutation();

  const grassStarter =
    region === "Kanto"
      ? "bulbasaur"
      : region === "Johto"
      ? "chikorita"
      : region === "Hoenn"
      ? "treecko"
      : region === "Sinnoh"
      ? "turtwig"
      : "snivy";

  const fireStarter =
    region === "Kanto"
      ? "charmander"
      : region === "Johto"
      ? "cyndaquil"
      : region === "Hoenn"
      ? "torchic"
      : region === "Sinnoh"
      ? "chimchar"
      : "tepig";

  const waterStarter =
    region === "Kanto"
      ? "squirtle"
      : region === "Johto"
      ? "totodile"
      : region === "Hoenn"
      ? "mudkip"
      : region === "Sinnoh"
      ? "piplup"
      : "oshawott";

  const handleClose = async () => {
    setDisabled(true);
    if (starter) {
      const speciesId =
        starter === "Grass"
          ? species.find((s) => s.name === grassStarter && !s.shiny)?.id ||
            species[0].id
          : starter === "Fire"
          ? species.find((s) => s.name === fireStarter && !s.shiny)?.id ||
            species[3].id
          : starter === "Water"
          ? species.find((s) => s.name === waterStarter && !s.shiny)?.id ||
            species[6].id
          : "";

      if (region === "Kanto") {
        purchaseMutation.mutate(
          { speciesId: speciesId, cost: 0 },
          {
            onSuccess(data, variables, context) {
              addStarter(data.instance, region);
            },
            onError(error, variables, context) {
              setError(error.message);
              setDisabled(false);
            }
          }
        );
      } else {
        starterMutation.mutate(
          { speciesId: speciesId, region: region },
          {
            onSuccess(data, variables, context) {
              addStarter(data.instance, region);
            },
            onError(error, variables, context) {
              setError(error.message);
              setDisabled(false);
            }
          }
        );
      }
    } else if (!starter) {
      setError("Must pick a starter Pokémon");
      setDisabled(false);
    }
  };

  return (
    <Modal size="Small">
      {region === "Kanto" ? (
        <>
          <div className="text-center text-xl font-bold">
            Welcome to PokéZoo
          </div>
          <div>Please select your starter Pokémon</div>
        </>
      ) : (
        <>
          <div className="text-center text-xl font-bold">
            {region} Pokémon are now in PokéZoo!
          </div>
          <div>Please select your {region} starter!</div>
        </>
      )}
      <div className="flex gap-5 pt-4">
        <div
          className={`${
            starter === "Grass" && `border-4 border-green-500`
          } pointer-events-auto`}>
          <button onClick={() => setStarter("Grass")}>
            <Card
              species={
                species.find((s) => s.name === grassStarter && !s.shiny) ||
                species[0]
              }
            />
          </button>
        </div>
        <div
          className={`${
            starter === "Fire" && `border-4 border-green-500`
          } pointer-events-auto`}>
          <button onClick={() => setStarter("Fire")}>
            <Card
              species={
                species.find((s) => s.name === fireStarter && !s.shiny) ||
                species[3]
              }
            />
          </button>
        </div>
        <div
          className={`${
            starter === "Water" && `border-4 border-green-500`
          } pointer-events-auto`}>
          <button onClick={() => setStarter("Water")}>
            <Card
              species={
                species.find((s) => s.name === waterStarter && !s.shiny) ||
                species[6]
              }
            />
          </button>
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <button
          onClick={() => handleClose()}
          disabled={disabled}
          className="pointer-events-auto rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
          Confirm Selection
        </button>
      </div>
      {error && (
        <div className="flex justify-center pt-4 text-red-500">{error}</div>
      )}
    </Modal>
  );
}
