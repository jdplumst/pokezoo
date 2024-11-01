import Image from "next/image";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { type z } from "zod";
import { type selectInstanceSchema } from "../server/db/schema";
import { type ZodSpecies } from "../zod";
import Wildcard from "./Wildcard";

interface ICard {
  species: z.infer<typeof ZodSpecies>;
  // species: inferRouterOutputs<AppRouter>["species"]["getPokedex"];
  instance?: z.infer<typeof selectInstanceSchema>;
  modifyDeleteList?: (
    instance: z.infer<typeof selectInstanceSchema>,
    sell: boolean,
  ) => void;
  caught?: boolean;
  handlePurchase?: (species: z.infer<typeof ZodSpecies>) => void;
}

export default function Card({
  species,
  instance,
  modifyDeleteList,
  caught,
  handlePurchase,
}: ICard) {
  const [beingDeleted, setBeingDeleted] = useState(false);

  const purchaseMutation =
    trpc.instance.purchaseInstanceWithWildcards.useMutation();

  if (!species) return <></>;
  return (
    <div
      className={`${!handlePurchase && !modifyDeleteList ? `h-[320px]` : `h-[390px]`}`}
    >
      <div
        className={`card relative h-[320px] w-[300px] ${
          species.shiny ? `border-yellow-500` : `border-black`
        } p-2 text-black`}
      >
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div className="card-hover"></div>
        <div
          className={`card-contents absolute bottom-0 left-0 right-0 top-0 rounded-lg rounded-bl-none rounded-br-none border-x-2 border-t-2 border-black ${species.rarity === "Common" ? `bg-common-unfocus` : species.rarity === "Rare" ? `bg-rare-unfocus` : species.rarity === "Epic" ? `bg-epic-unfocus` : species.rarity === "Legendary" ? `bg-legendary-unfocus` : species.rarity === "Mega" ? `bg-mega-unfocus` : species.rarity === "Ultra Beast" ? `bg-ub-unfocus` : species.rarity === "Gigantamax" ? `bg-gmax-unfocus` : ``}`}
        >
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
            <div className="pt-4 capitalize">
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
                                                    : species.typeOne ===
                                                        `Flying`
                                                      ? `bg-flying`
                                                      : ``
                } rounded-lg border-2 border-black p-2 font-bold text-white`}
              >
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
                                                    : species.typeTwo ===
                                                        `Steel`
                                                      ? `bg-steel`
                                                      : species.typeTwo ===
                                                          `Flying`
                                                        ? `bg-flying`
                                                        : ``
                  } rounded-lg border-2 border-black p-2 font-bold text-white`}
                >
                  {species.typeTwo}
                </span>
              )}
            </div>
            <p className="pt-2">Rarity: {species.rarity}</p>
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
            <div
              className={`flex w-[300px] flex-col items-center rounded-lg rounded-tl-none rounded-tr-none border-x-2 border-b-2 border-black ${species.rarity === "Common" ? `bg-common-unfocus` : species.rarity === "Rare" ? `bg-rare-unfocus` : species.rarity === "Epic" ? `bg-epic-unfocus` : species.rarity === "Legendary" ? `bg-legendary-unfocus` : species.rarity === "Mega" ? `bg-mega-unfocus` : species.rarity === "Ultra Beast" ? `bg-ub-unfocus` : species.rarity === "Gigantamax" ? `bg-gmax-unfocus` : ``} py-2`}
            >
              {instance && modifyDeleteList && !beingDeleted && (
                <button
                  onClick={() => {
                    modifyDeleteList(instance, true);
                    setBeingDeleted(true);
                  }}
                  className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold text-white hover:bg-red-btn-focus"
                >
                  Sell Pokémon
                </button>
              )}
              {instance && modifyDeleteList && beingDeleted && (
                <button
                  onClick={() => {
                    modifyDeleteList(instance, false);
                    setBeingDeleted(false);
                  }}
                  className="rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold text-white hover:bg-green-btn-focus"
                >
                  Unsell Pokémon
                </button>
              )}
              {handlePurchase &&
                (["Common", "Rare", "Epic", "Legendary"].includes(
                  species.rarity,
                ) ? (
                  <button
                    onClick={() =>
                      purchaseMutation.mutate(
                        { speciesId: species.id },
                        {
                          onSuccess() {
                            handlePurchase(species);
                          },
                        },
                      )
                    }
                    disabled={purchaseMutation.isLoading}
                    className="h-12 w-[70px] rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold text-white hover:bg-blue-btn-focus"
                  >
                    <div className="flex flex-row">
                      {(() => {
                        switch (species.rarity) {
                          case "Common":
                            return (
                              <Wildcard
                                wildcard="Common"
                                height={25}
                                width={25}
                              />
                            );
                          case "Rare":
                            return (
                              <Wildcard
                                wildcard="Rare"
                                height={25}
                                width={25}
                              />
                            );
                          case "Epic":
                            return (
                              <Wildcard
                                wildcard="Epic"
                                height={25}
                                width={25}
                              />
                            );
                          case "Legendary":
                            return (
                              <Wildcard
                                wildcard="Legendary"
                                height={25}
                                width={25}
                              />
                            );
                        }
                      })()}
                      {species.shiny ? `100` : `10`}
                    </div>
                  </button>
                ) : (
                  <div className="flex h-12 w-[70px] items-center justify-center rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold text-white hover:bg-blue-btn-focus">
                    N/A
                  </div>
                ))}
              {purchaseMutation.error && (
                <div className="p-2 text-xs font-medium text-black">
                  {purchaseMutation.error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
