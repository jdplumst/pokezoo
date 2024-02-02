import Image from "next/image";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { type z } from "zod";
import {
  type selectSpeciesSchema,
  type selectInstanceSchema
} from "../server/db/schema";

interface ICard {
  species: z.infer<typeof selectSpeciesSchema>;
  instance?: z.infer<typeof selectInstanceSchema>;
  modifyDeleteList?: (
    instance: z.infer<typeof selectInstanceSchema>,
    sell: boolean
  ) => void;
  caught?: boolean;
  handlePurchase?: (species: z.infer<typeof selectSpeciesSchema>) => void;
}

export default function Card({
  species,
  instance,
  modifyDeleteList,
  caught,
  handlePurchase
}: ICard) {
  const [beingDeleted, setBeingDeleted] = useState(false);

  const purchaseMutation =
    trpc.instance.purchaseInstanceWithWildcards.useMutation();

  if (!species) return <></>;
  return (
    <div
      className={`${
        species.rarity === "Common"
          ? `bg-common-unfocus hover:bg-common-focus`
          : species.rarity === "Rare"
            ? `bg-rare-unfocus hover:bg-rare-focus`
            : species.rarity === "Epic"
              ? `bg-epic-unfocus hover:bg-epic-focus`
              : species.rarity === "Legendary"
                ? `bg-legendary-unfocus hover:bg-legendary-focus`
                : species.rarity === "Mega"
                  ? `bg-mega-unfocus hover:bg-mega-focus`
                  : ``
      } card-hover h-fit w-[260px] border-2 ${
        species.shiny ? `border-yellow-500` : `border-black`
      } p-2 text-black`}>
      {caught && (
        <Image
          className="absolute"
          src={
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          }
          alt="caught"
          width={40}
          height={40}
        />
      )}
      <div className="flex flex-col items-center">
        <Image
          src={species.img}
          alt={species.name}
          width={98}
          height={98}
          className="pixelated"
        />
        <p className="font-bold capitalize">
          #{species.pokedexNumber}: {species.name}{" "}
          {species.shiny && <span>⭐</span>}
        </p>
        <div className="py-4 capitalize">
          <span
            className={`${
              species.typeOne === `Normal`
                ? `bg-normal`
                : species.typeOne === `Grass`
                  ? `bg-grass`
                  : species.typeOne === `Bug`
                    ? `bg-bug`
                    : species.typeOne === `Fire`
                      ? `bg-fire`
                      : species.typeOne === `Electric`
                        ? `bg-electric`
                        : species.typeOne === `Ground`
                          ? `bg-ground`
                          : species.typeOne === `Water`
                            ? `bg-water`
                            : species.typeOne === `Fighting`
                              ? `bg-fighting`
                              : species.typeOne === `Poison`
                                ? `bg-poison`
                                : species.typeOne === `Rock`
                                  ? `bg-rock`
                                  : species.typeOne === `Ice`
                                    ? `bg-ice`
                                    : species.typeOne === `Ghost`
                                      ? `bg-ghost`
                                      : species.typeOne === `Psychic`
                                        ? `bg-psychic`
                                        : species.typeOne === `Fairy`
                                          ? `bg-fairy`
                                          : species.typeOne === `Dark`
                                            ? `bg-dark`
                                            : species.typeOne === `Dragon`
                                              ? `bg-dragon`
                                              : species.typeOne === `Steel`
                                                ? `bg-steel`
                                                : species.typeOne === `Flying`
                                                  ? `bg-flying`
                                                  : ``
            } rounded-lg border-2 border-black p-2 font-bold text-white`}>
            {species.typeOne}
          </span>{" "}
          {species.typeTwo && (
            <span
              className={`${
                species.typeTwo === `Normal`
                  ? `bg-normal`
                  : species.typeTwo === `Grass`
                    ? `bg-grass`
                    : species.typeTwo === `Bug`
                      ? `bg-bug`
                      : species.typeTwo === `Fire`
                        ? `bg-fire`
                        : species.typeTwo === `Electric`
                          ? `bg-electric`
                          : species.typeTwo === `Ground`
                            ? `bg-ground`
                            : species.typeTwo === `Water`
                              ? `bg-water`
                              : species.typeTwo === `Fighting`
                                ? `bg-fighting`
                                : species.typeTwo === `Poison`
                                  ? `bg-poison`
                                  : species.typeTwo === `Rock`
                                    ? `bg-rock`
                                    : species.typeTwo === `Ice`
                                      ? `bg-ice`
                                      : species.typeTwo === `Ghost`
                                        ? `bg-ghost`
                                        : species.typeTwo === `Psychic`
                                          ? `bg-psychic`
                                          : species.typeTwo === `Fairy`
                                            ? `bg-fairy`
                                            : species.typeTwo === `Dark`
                                              ? `bg-dark`
                                              : species.typeTwo === `Dragon`
                                                ? `bg-dragon`
                                                : species.typeTwo === `Steel`
                                                  ? `bg-steel`
                                                  : species.typeTwo === `Flying`
                                                    ? `bg-flying`
                                                    : ``
              } rounded-lg border-2 border-black p-2 font-bold text-white`}>
              {species.typeTwo}
            </span>
          )}
        </div>
        <p>Rarity: {species.rarity}</p>
        <p className="capitalize">
          Habitat:{" "}
          {species.habitat === "WatersEdge"
            ? "Waters-Edge"
            : species.habitat === "RoughTerrain"
              ? "Rough-Terrain"
              : species.habitat}
        </p>
        <p>Region: {species.region}</p>
        <p>Generation: {species.generation}</p>
        <p>Yield: P{species.yield.toLocaleString()}</p>
        <p>Sell Price: P{species.sellPrice.toLocaleString()}</p>
        {instance && modifyDeleteList && !beingDeleted && (
          <button
            onClick={() => {
              modifyDeleteList(instance, true);
              setBeingDeleted(true);
            }}
            className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold text-white hover:bg-red-btn-focus">
            Sell Pokémon
          </button>
        )}
        {instance && modifyDeleteList && beingDeleted && (
          <button
            onClick={() => {
              modifyDeleteList(instance, false);
              setBeingDeleted(false);
            }}
            className="rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold text-white hover:bg-green-btn-focus">
            Unsell Pokémon
          </button>
        )}
        {handlePurchase &&
          (["Common", "Rare", "Epic", "Legendary"].includes(species.rarity) ? (
            <button
              onClick={() =>
                purchaseMutation.mutate(
                  { speciesId: species.id },
                  {
                    onSuccess() {
                      handlePurchase(species);
                    }
                  }
                )
              }
              disabled={purchaseMutation.isLoading}
              className="rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 h-12 w-[70px] font-bold text-white hover:bg-blue-btn-focus">
              <div className="flex flex-row">
                {species.rarity === "Common" ? (
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
                    alt="common-wildcard"
                    height={25}
                    width={25}
                  />
                ) : species.rarity === "Rare" ? (
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
                    alt="rare-wildcard"
                    height={25}
                    width={25}
                  />
                ) : species.rarity === "Epic" ? (
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
                    alt="epic-wildcard"
                    height={25}
                    width={25}
                  />
                ) : (
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png"
                    alt="legendary-wildcard"
                    height={25}
                    width={25}
                  />
                )}
                {species.shiny ? `100` : `10`}
              </div>
            </button>
          ) : (
            <div className="flex justify-center items-center rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 h-12 w-[70px] font-bold text-white hover:bg-blue-btn-focus">
              N/A
            </div>
          ))}
        {purchaseMutation.error && (
          <div className="font-medium text-red-600">
            {purchaseMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
