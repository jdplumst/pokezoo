import { useState } from "react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";
import { type z } from "zod";
import { type ZodAchievement } from "../zod";

export interface FullAchievement {
  achievement: z.infer<typeof ZodAchievement>;
  max: number;
  value: number;
  low: number;
  high: number;
  percent: number;
  achieved: boolean;
}

interface IProgressBar {
  fullAchievement: FullAchievement;
  updateYield: () => void;
}

export default function ProgressBar({
  fullAchievement,
  updateYield
}: IProgressBar) {
  const [disabled, setDisabled] = useState(false);
  const [isAchieved, setIsAchieved] = useState(fullAchievement.achieved);
  const [error, setError] = useState<null | string>(null);
  const achievementMutation = trpc.achievement.claimAchievement.useMutation();

  const handleClaimAchievement = () => {
    setDisabled(true);
    achievementMutation.mutate(
      {
        achievementId: fullAchievement.achievement.id
      },
      {
        onSuccess() {
          updateYield();
          setIsAchieved(true);
          setError(null);
        },
        onError(error) {
          setError(error.message);
          setDisabled(false);
        }
      }
    );
  };

  return (
    <div className="flex items-center">
      {!isAchieved ? (
        <label htmlFor={fullAchievement.achievement.id} className="mr-4">
          {fullAchievement.value} / {fullAchievement.max} (
          {Math.round(fullAchievement.percent)}%)
        </label>
      ) : (
        <span>You have claimed this achievement!</span>
      )}
      {fullAchievement.value === fullAchievement.max && !isAchieved ? (
        <div className="inline-block w-40 text-center">
          <button
            onClick={() => handleClaimAchievement()}
            disabled={disabled}
            className="mx-auto w-40 rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
            {achievementMutation.isLoading ? <LoadingSpinner /> : "Claim"}
          </button>
        </div>
      ) : fullAchievement.value !== fullAchievement.max && !isAchieved ? (
        <meter
          id={fullAchievement.achievement.id}
          className="h-6 w-40"
          max={fullAchievement.max}
          optimum={fullAchievement.max}
          value={fullAchievement.value}
          low={fullAchievement.low}
          high={fullAchievement.high}>
          {fullAchievement.percent}%
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
