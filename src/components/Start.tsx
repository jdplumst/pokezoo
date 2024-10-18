import { useState } from "react";
import Card from "./Card";
import Modal from "./Modal";
import { trpc } from "../utils/trpc";
import { type z } from "zod";
import { type ZodRegion } from "../zod";

interface IStarter {
  region: z.infer<typeof ZodRegion>;
  addStarter: () => void;
}

export default function Start({ region, addStarter }: IStarter) {
  const [starter, setStarter] = useState<Starter | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStarters = trpc.species.getStarters.useQuery({ region });

  const purchaseMutation = trpc.instance.purchaseInstanceWithBall.useMutation(); // Kanto
  const starterMutation = trpc.instance.claimStarter.useMutation(); // All other regions

  let grassStarter: string;
  let fireStarter: string;
  let waterStarter: string;

  switch (region) {
    case "Kanto":
      grassStarter = "bulbasaur";
      fireStarter = "charmander";
      waterStarter = "squirtle";
      break;
    case "Johto":
      grassStarter = "chikorita";
      fireStarter = "cyndaquil";
      waterStarter = "totodile";
      break;
    case "Hoenn":
      grassStarter = "treecko";
      fireStarter = "torchic";
      waterStarter = "mudkip";
      break;
    case "Sinnoh":
      grassStarter = "turtwig";
      fireStarter = "chimchar";
      waterStarter = "piplup";
      break;
    case "Unova":
      grassStarter = "snivy";
      fireStarter = "tepig";
      waterStarter = "oshawott";
      break;
    case "Kalos":
      grassStarter = "chespin";
      fireStarter = "fennekin";
      waterStarter = "froakie";
      break;
    case "Alola":
      grassStarter = "rowlet";
      fireStarter = "litten";
      waterStarter = "popplio";
      break;
    case "Galar":
      grassStarter = "grookey";
      fireStarter = "scorbunny";
      waterStarter = "sobble";
      break;
  }

  const handleClose = () => {
    if (starter) {
      const speciesId =
        starter === "Grass"
          ? (getStarters.data?.starters.find((s) => s.name === grassStarter)
              ?.id ?? "")
          : starter === "Fire"
            ? (getStarters.data?.starters.find((s) => s.name === fireStarter)
                ?.id ?? "")
            : starter === "Water"
              ? (getStarters.data?.starters.find((s) => s.name === waterStarter)
                  ?.id ?? "")
              : "";

      starterMutation.mutate(
        { speciesId: speciesId, region: region },
        {
          onSuccess() {
            addStarter();
          },
          onError(error) {
            setError(error.message);
          },
        },
      );
    } else if (!starter) {
      setError("Must pick a starter Pokémon");
    }
  };

  if (getStarters.isLoading || !getStarters.data) return <div></div>;

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
            starter === "Grass" && `h-[341px] border-4 border-green-500`
          } pointer-events-auto`}
        >
          <button onClick={() => setStarter("Grass")}>
            <Card
              species={
                getStarters.data.starters.find(
                  (s) => s.name === grassStarter,
                ) ?? getStarters.data.starters[0]
              }
            />
          </button>
        </div>
        <div
          className={`${
            starter === "Fire" && `h-[341px] border-4 border-green-500`
          } pointer-events-auto`}
        >
          <button onClick={() => setStarter("Fire")}>
            <Card
              species={
                getStarters.data.starters.find((s) => s.name === fireStarter)!
              }
            />
          </button>
        </div>
        <div
          className={`${
            starter === "Water" && `h-[341px] border-4 border-green-500`
          } pointer-events-auto`}
        >
          <button onClick={() => setStarter("Water")}>
            <Card
              species={
                getStarters.data.starters.find((s) => s.name === waterStarter)!
              }
            />
          </button>
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <button
          onClick={() => handleClose()}
          disabled={purchaseMutation.isLoading || starterMutation.isLoading}
          className="pointer-events-auto rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600"
        >
          Confirm Selection
        </button>
      </div>
      {error && (
        <div className="flex justify-center pt-4 text-red-500">{error}</div>
      )}
    </Modal>
  );
}
