import { Rarity, Species, Instance } from "@prisma/client";
import Image from "next/image";

interface ICard {
  species: Species;
  instance?: Instance;
}

export default function Card({ species, instance }: ICard) {
  return (
    <div
      className={`${
        species.rarity === Rarity.Common
          ? `bg-white hover:bg-slate-100`
          : species.rarity === Rarity.Rare
          ? `bg-orange-500 hover:bg-orange-600`
          : species.rarity === Rarity.Epic
          ? `bg-purple-500 hover:bg-purple-600`
          : species.rarity === Rarity.Legendary
          ? `bg-yellow-500 hover:bg-yellow-600`
          : ``
      } card-hover h-52 w-52 border-2 border-black p-2`}>
      <div className="flex flex-col items-center">
        <Image
          src={species.img}
          alt={species.name}
          width={112}
          height={112}
          className="pixelated"
        />
        <p className="font-bold capitalize">{species.name}</p>
        <p>Rarity: {species.rarity}</p>
        <p>Yield: P{species.yield}</p>
      </div>
    </div>
  );
}
