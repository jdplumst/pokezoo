import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../server/api/_app";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface IQuestListProps {
  quests: inferRouterOutputs<AppRouter>["quest"]["getUserQuests"] | undefined;
}

export default function QuestList(props: IQuestListProps) {
  const utils = trpc.useUtils();

  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const questMutation = trpc.quest.claimQuestReward.useMutation();

  const handleClaimQuest = (id: string) => {
    setDisabled(true);
    questMutation.mutate(
      {
        userQuestId: id,
      },
      {
        onSuccess() {
          void utils.quest.getUserQuests.invalidate();
          void utils.profile.getProfile.invalidate();
          setError(null);
          setDisabled(false);
        },
        onError(error) {
          window.scrollTo(0, 0);
          console.log(error.data);
          switch (error.data?.code) {
            case "CONFLICT":
              setError(
                "You either cannot claim this quest yet or have already claimed this quest",
              );
              break;
            default:
              setError("Something went wrong. Please try again.");
              break;
          }
          setDisabled(false);
        },
      },
    );
  };

  return (
    <div className="flex justify-center pt-2">
      <ul className="w-3/4">
        {props.quests?.map((u) => (
          <li
            key={u.userQuest.id}
            className="mb-5 flex h-14 items-center justify-between border-2 border-tooltip-border p-2"
          >
            <div className="text-xl">
              <span className="font-bold">{u.quest?.description} </span>
              <span>(P{u.quest?.reward.toLocaleString()})</span>
            </div>
            {error && (
              <span className="ml-4 font-bold text-red-500">{error}</span>
            )}
            {u.userQuest.claimed ? (
              <div className="text-xl font-bold">
                You have already claimed this quest!
              </div>
            ) : u.userQuest.count >= (u.quest?.goal ?? 10000) ? (
              <button
                onClick={() => handleClaimQuest(u.userQuest.id)}
                disabled={disabled}
                className="w-48 rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500"
              >
                {questMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  "Claim Quest Reward"
                )}
              </button>
            ) : (
              <div className="text-xl font-bold">
                {u.userQuest.count} / {u.quest?.goal}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
