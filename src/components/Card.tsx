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
          ? `bg-slate-500 hover:bg-slate-600`
          : species.rarity === Rarity.Rare
          ? `bg-orange-500 hover:bg-orange-600`
          : species.rarity === Rarity.Epic
          ? `bg-purple-500 hover:bg-purple-600`
          : species.rarity === Rarity.Legendary
          ? `bg-emerald-500 hover:bg-emerald-600`
          : ``
      } card-hover ${instance && openDelete ? `h-80` : `h-72`} w-52 border-2 ${
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
                ? `bg-amber-600`
                : species.typeOne === `grass`
                ? `bg-green-500`
                : species.typeOne === `bug`
                ? `bg-lime-500`
                : species.typeOne === `fire`
                ? `bg-orange-600`
                : species.typeOne === `electric`
                ? `bg-yellow-400`
                : species.typeOne === `ground`
                ? `bg-orange-700`
                : species.typeOne === `water`
                ? `bg-blue-500`
                : species.typeOne === `fighting`
                ? `bg-red-600`
                : species.typeOne === `poison`
                ? `bg-purple-600`
                : species.typeOne === `rock`
                ? `bg-stone-500`
                : species.typeOne === `ice`
                ? `bg-cyan-500`
                : species.typeOne === `ghost`
                ? `bg-violet-500`
                : species.typeOne === `psychic`
                ? `bg-fuchsia-500`
                : species.typeOne === `fairy`
                ? `bg-pink-500`
                : species.typeOne === `dark`
                ? `bg-black`
                : species.typeOne === `dragon`
                ? `bg-indigo-500`
                : species.typeOne === `steel`
                ? `bg-slate-500`
                : species.typeOne === `flying`
                ? `bg-violet-400`
                : ``
            } rounded-lg border-2 border-black p-2 font-bold text-white`}>
            {species.typeOne}
          </span>{" "}
          {species.typeTwo && (
            <span
              className={`${
                species.typeTwo === `normal`
                  ? `bg-amber-600`
                  : species.typeTwo === `grass`
                  ? `bg-green-500`
                  : species.typeTwo === `bug`
                  ? `bg-lime-500`
                  : species.typeTwo === `fire`
                  ? `bg-orange-600`
                  : species.typeTwo === `electric`
                  ? `bg-yellow-400`
                  : species.typeTwo === `ground`
                  ? `bg-orange-700`
                  : species.typeTwo === `water`
                  ? `bg-blue-500`
                  : species.typeTwo === `fighting`
                  ? `bg-red-600`
                  : species.typeTwo === `poison`
                  ? `bg-purple-600`
                  : species.typeTwo === `rock`
                  ? `bg-stone-500`
                  : species.typeTwo === `ice`
                  ? `bg-cyan-500`
                  : species.typeTwo === `ghost`
                  ? `bg-violet-500`
                  : species.typeTwo === `psychic`
                  ? `bg-fuchsia-500`
                  : species.typeTwo === `fairy`
                  ? `bg-pink-500`
                  : species.typeTwo === `dark`
                  ? `bg-black`
                  : species.typeTwo === `dragon`
                  ? `bg-indigo-500`
                  : species.typeTwo === `steel`
                  ? `bg-slate-500`
                  : species.typeTwo === `flying`
                  ? `bg-violet-400`
                  : ``
              } rounded-lg border-2 border-black p-2 font-bold text-white`}>
              {species.typeTwo}
            </span>
          )}
        </div>
        <p>Rarity: {species.rarity}</p>
        <p>Yield: P{species.yield.toLocaleString()}</p>
        <p>Sell Price: P{species.sellPrice.toLocaleString()}</p>
        {instance && openDelete && (
          <button
            onClick={() => openDelete(species, instance)}
            className="rounded-lg border-2 border-black bg-red-600 p-2 font-bold text-white hover:bg-red-700">
            Sell Pokémon
          </button>
        )}
      </div>
    </div>
  );
}
