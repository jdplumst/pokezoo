import { Achievement, Instance, Rarity, Species } from "@prisma/client";

interface IProgressBar {
  species: Species[];
  instances: (Instance & {
    species: {
      rarity: Rarity;
      shiny: boolean;
      typeOne: string;
      typeTwo: string | null;
      generation: number;
      habitat: string;
    };
  })[];
  achievement: Achievement;
}

export default function ProgressBar({
  species,
  instances,
  achievement
}: IProgressBar) {
  let max = 0;
  let value = 0;

  if (achievement.type === "Rarity") {
    max = species.filter(
      (s) =>
        s.rarity === achievement.attribute &&
        s.generation === achievement.generation &&
        !s.shiny
    ).length;
    value = instances.filter(
      (i) =>
        i.species.rarity === achievement.attribute &&
        i.species.generation === achievement.generation &&
        !i.species.shiny
    ).length;
  } else if (achievement.type === "Habitat") {
    max = species.filter(
      (s) =>
        s.habitat === achievement.attribute &&
        s.generation === achievement.generation &&
        !s.shiny
    ).length;
    value = instances.filter(
      (i) =>
        i.species.habitat === achievement.attribute &&
        i.species.generation === achievement.generation &&
        !i.species.shiny
    ).length;
  } else if (achievement.type === "Type") {
    max = species.filter(
      (s) =>
        (s.typeOne === achievement.attribute ||
          s.typeTwo === achievement.attribute) &&
        s.generation === achievement.generation &&
        !s.shiny
    ).length;
    value = instances.filter(
      (i) =>
        (i.species.typeOne === achievement.attribute ||
          i.species.typeTwo === achievement.attribute) &&
        i.species.generation === achievement.generation &&
        !i.species.shiny
    ).length;
  }

  const low = 0.35 * max;
  const high = 0.7 * max;
  const percent = Math.round((value / max) * 100);

  return (
    <>
      <label htmlFor={achievement.id} className="mr-4">
        {value} / {max} ({Math.round(percent)}%)
      </label>
      <meter
        id={achievement.id}
        max={max}
        optimum={max}
        value={value}
        low={low}
        high={high}>
        {percent}%
      </meter>
    </>
  );
}
