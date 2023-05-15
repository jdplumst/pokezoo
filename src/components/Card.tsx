import { Rarity, Species, Instance } from "@prisma/client";
import Image from "next/image";

interface ICard {
  species: Species;
  instance?: Instance;
  openDelete?: (species: Species, instance: Instance) => void;
}

export default function Card({ species, instance, openDelete }: ICard) {
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
      } card-hover h-fit w-52 border-2 ${
        species.shiny ? `border-yellow-500` : `border-black`
      } p-2 text-black`}>
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
        <p>Yield: P{species.yield.toLocaleString()}</p>
        <p>Sell Price: P{species.sellPrice.toLocaleString()}</p>
        <p className="capitalize">Habitat: {species.habitat}</p>
        {instance && openDelete && (
          <button
            onClick={() => openDelete(species, instance)}
            className="rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold text-white hover:bg-red-btn-focus">
            Sell Pokémon
          </button>
        )}
      </div>
    </div>
  );
}
