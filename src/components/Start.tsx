import { useState } from "react";
import Card from "./Card";
import { Species, Instance } from "@prisma/client";
import Modal from "./Modal";
import { trpc } from "../utils/trpc";

interface IStarter {
  species: Species[];
  addStarter: (i: Instance) => void;
}

type Starter = "Bulbasaur" | "Charmander" | "Squirtle";

export default function Start({ species, addStarter }: IStarter) {
  const [starter, setStarter] = useState<Starter | null>(null);
  const [error, setError] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);
  const purchaseMutation = trpc.instance.purchaseInstance.useMutation();

  const handleClose = async () => {
    setDisabled(true);
    if (starter) {
      const speciesId =
        starter === "Bulbasaur"
          ? species[0].id
          : starter === "Charmander"
          ? species[3].id
          : starter === "Squirtle"
          ? species[6].id
          : "";

      purchaseMutation.mutate(
        { speciesId: speciesId, cost: 0 },
        {
          onSuccess(data, variables, context) {
            addStarter(data.instance);
            setDisabled(false);
          },
          onError(error, variables, context) {
            setError(error.message);
          }
        }
      );
    } else if (!starter) {
      setError("Must pick a starter Pokémon");
      setDisabled(false);
    }
  };

  return (
    <Modal>
      <div className="text-center text-xl font-bold">Welcome to PokéZoo</div>
      <div>Please select your starter Pokémon</div>
      <div className="flex gap-5 pt-4">
        <div
          className={`${
            starter === "Bulbasaur" && `border-4 border-green-500`
          }`}>
          <button onClick={() => setStarter("Bulbasaur")}>
            <Card species={species[0]} />
          </button>
        </div>
        <div
          className={`${
            starter === "Charmander" && `border-4 border-green-500`
          }`}>
          <button onClick={() => setStarter("Charmander")}>
            <Card species={species[3]} />
          </button>
        </div>
        <div
          className={`${
            starter === "Squirtle" && `border-4 border-green-500`
          }`}>
          <button onClick={() => setStarter("Squirtle")}>
            <Card species={species[6]} />
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
