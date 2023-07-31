import { Rarity, Species, Instance } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface ICard {
  species: Species;
  instance?: Instance;
  modifyDeleteList?: (instance: Instance, sell: boolean) => void;
  caught?: Boolean;
}

export default function Card({
  species,
  instance,
  modifyDeleteList,
  caught
}: ICard) {
  const [beingDeleted, setBeingDeleted] = useState(false);

  return (
    <div
      className={`${
        species.rarity === Rarity.Common
          ? `bg-common-unfocus hover:bg-common-focus`
          : species.rarity === Rarity.Rare
          ? `bg-rare-unfocus hover:bg-rare-focus`
          : species.rarity === Rarity.Epic
          ? `bg-epic-unfocus hover:bg-epic-focus`
          : species.rarity === Rarity.Legendary
          ? `bg-legendary-unfocus hover:bg-legendary-focus`
          : ``
      } card-hover h-fit w-60 border-2 ${
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
        <p className="capitalize">Habitat: {species.habitat}</p>
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
      </div>
    </div>
  );
}
