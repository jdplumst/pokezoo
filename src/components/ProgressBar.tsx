import { Achievement, Instance, Rarity, Species, User } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";

interface IProgressBar {
  user: User;
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
  achieved: boolean;
  updateBalance: (x: number) => void;
}

export default function ProgressBar({
  user,
  species,
  instances,
  achievement,
  achieved,
  updateBalance
}: IProgressBar) {
  const [disabled, setDisabled] = useState(false);
  const [isAchieved, setIsAchieved] = useState(achieved);
  const [error, setError] = useState<null | string>(null);
  const achievementMutation = trpc.achievement.claimAchievement.useMutation();

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

  const handleClaimAchievement = () => {
    setDisabled(true);
    achievementMutation.mutate(
      {
        userId: user.id,
        achievementId: achievement.id
      },
      {
        onSuccess(data, variables, context) {
          updateBalance(achievement.yield);
          setIsAchieved(true);
          setError(null);
        },
        onError(error, variables, context) {
          setError(error.message);
          setDisabled(false);
        }
      }
    );
  };

  return (
    <div className="flex items-center">
      {!isAchieved ? (
        <label htmlFor={achievement.id} className="mr-4">
          {value} / {max} ({Math.round(percent)}%)
        </label>
      ) : (
        <span>You have claimed this achievement!</span>
      )}
      {value === max && !isAchieved ? (
        <div className="inline-block w-40 text-center">
          <button
            onClick={() => handleClaimAchievement()}
            disabled={disabled}
            className="mx-auto w-40 rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
            Claim
          </button>
        </div>
      ) : value !== max && !isAchieved ? (
        <meter
          id={achievement.id}
          className="h-6 w-40"
          max={max}
          optimum={max}
          value={value}
          low={low}
          high={high}>
          {percent}%
        </meter>
      ) : isAchieved ? (
        <span className="text-4xl">✅</span>
      ) : (
        <></>
      )}

      {error && <span className="ml-4 font-bold text-red-500">{error}</span>}
    </div>
  );
}
