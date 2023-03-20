import { Species, SpeciesInstances } from "@prisma/client";

interface ICard {
  species: Species;
  instance: SpeciesInstances;
}

export default function Card({ species, instance }: ICard) {
  return (
    <div>
      <h1>hi</h1>
      <p>
        {species.name} {species.pokedexNumber}
      </p>
      <p>{instance.userId}</p>
    </div>
  );
}
