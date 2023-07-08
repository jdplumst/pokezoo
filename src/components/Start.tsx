import { useState } from "react";
import Card from "./Card";
import { Species, Instance } from "@prisma/client";
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
  const purchaseMutation = trpc.instance.purchaseInstance.useMutation();
  const johtoMutation = trpc.instance.getJohto.useMutation();
  const hoennMutation = trpc.instance.getHoenn.useMutation();
  const sinnohMutation = trpc.instance.getSinnoh.useMutation();

  const grassStarter =
    region === "Kanto"
      ? "bulbasaur"
      : region === "Johto"
      ? "chikorita"
      : region === "Hoenn"
      ? "treecko"
      : "turtwig";
  const fireStarter =
    region === "Kanto"
      ? "charmander"
      : region === "Johto"
      ? "cyndaquil"
      : region === "Hoenn"
      ? "torchic"
      : "chimchar";
  const waterStarter =
    region === "Kanto"
      ? "squirtle"
      : region === "Johto"
      ? "totodile"
      : region === "Hoenn"
      ? "mudkip"
      : "piplup";

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
      } else if (region === "Johto") {
        johtoMutation.mutate(
          { userId: user.id, speciesId: speciesId, cost: 0 },
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
      } else if (region === "Hoenn") {
        hoennMutation.mutate(
          { userId: user.id, speciesId: speciesId, cost: 0 },
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
      } else if (region === "Sinnoh") {
        sinnohMutation.mutate(
          { userId: user.id, speciesId: speciesId, cost: 0 },
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
    <Modal>
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
          className={`${starter === "Grass" && `border-4 border-green-500`}`}>
          <button onClick={() => setStarter("Grass")}>
            <Card
              species={
                species.find((s) => s.name === grassStarter && !s.shiny) ||
                species[0]
              }
            />
          </button>
        </div>
        <div className={`${starter === "Fire" && `border-4 border-green-500`}`}>
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
          className={`${starter === "Water" && `border-4 border-green-500`}`}>
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
          className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
          Confirm Selection
        </button>
      </div>
      {error && (
        <div className="flex justify-center pt-4 text-red-500">{error}</div>
      )}
    </Modal>
  );
}
