import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../server/api/_app";

interface IQuestListProps {
  quests: inferRouterOutputs<AppRouter>["quest"]["getUserQuests"] | undefined;
}

export default function QuestList(props: IQuestListProps) {
  return (
    <div className="flex justify-center pt-2">
      <ul className="w-3/4">
        {props.quests?.map((u) => (
          <li
            key={u.userQuest.id}
            className="mb-5 flex h-14 items-center justify-between border-2 border-tooltip-border p-2"
          >
            <div className="text-xl font-bold">{u.quest?.description}</div>
            {u.userQuest.claimed ? (
              <div className="text-xl font-bold">
                You have already claimed this quest!
              </div>
            ) : u.userQuest.count >= u.quest?.goal! ? (
              <button className="w-48 rounded-lg border-2 border-black bg-yellow-400 p-2 font-bold hover:bg-yellow-500">
                Claim Quest Reward
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
