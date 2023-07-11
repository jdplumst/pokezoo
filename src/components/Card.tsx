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
              species.typeOne === `normal`
                ? `bg-normal`
                : species.typeOne === `grass`
                ? `bg-grass`
                : species.typeOne === `bug`
                ? `bg-bug`
                : species.typeOne === `fire`
                ? `bg-fire`
                : species.typeOne === `electric`
                ? `bg-electric`
                : species.typeOne === `ground`
                ? `bg-ground`
                : species.typeOne === `water`
                ? `bg-water`
                : species.typeOne === `fighting`
                ? `bg-fighting`
                : species.typeOne === `poison`
                ? `bg-poison`
                : species.typeOne === `rock`
                ? `bg-rock`
                : species.typeOne === `ice`
                ? `bg-ice`
                : species.typeOne === `ghost`
                ? `bg-ghost`
                : species.typeOne === `psychic`
                ? `bg-psychic`
                : species.typeOne === `fairy`
                ? `bg-fairy`
                : species.typeOne === `dark`
                ? `bg-dark`
                : species.typeOne === `dragon`
                ? `bg-dragon`
                : species.typeOne === `steel`
                ? `bg-steel`
                : species.typeOne === `flying`
                ? `bg-flying`
                : ``
            } rounded-lg border-2 border-black p-2 font-bold text-white`}>
            {species.typeOne}
          </span>{" "}
          {species.typeTwo && (
            <span
              className={`${
                species.typeTwo === `normal`
                  ? `bg-normal`
                  : species.typeTwo === `grass`
                  ? `bg-grass`
                  : species.typeTwo === `bug`
                  ? `bg-bug`
                  : species.typeTwo === `fire`
                  ? `bg-fire`
                  : species.typeTwo === `electric`
                  ? `bg-electric`
                  : species.typeTwo === `ground`
                  ? `bg-ground`
                  : species.typeTwo === `water`
                  ? `bg-water`
                  : species.typeTwo === `fighting`
                  ? `bg-fighting`
                  : species.typeTwo === `poison`
                  ? `bg-poison`
                  : species.typeTwo === `rock`
                  ? `bg-rock`
                  : species.typeTwo === `ice`
                  ? `bg-ice`
                  : species.typeTwo === `ghost`
                  ? `bg-ghost`
                  : species.typeTwo === `psychic`
                  ? `bg-psychic`
                  : species.typeTwo === `fairy`
                  ? `bg-fairy`
                  : species.typeTwo === `dark`
                  ? `bg-dark`
                  : species.typeTwo === `dragon`
                  ? `bg-dragon`
                  : species.typeTwo === `steel`
                  ? `bg-steel`
                  : species.typeTwo === `flying`
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
