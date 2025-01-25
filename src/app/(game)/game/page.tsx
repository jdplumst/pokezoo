import { getTime } from "@/src/server/actions/cookies";
import { Metadata } from "next";
import GameGrid from "../../_components/GameGrid";
import RewardButton from "../../_components/RewardButton";
import { getGame } from "@/src/server/actions/game";

export const metadata: Metadata = {
  title: "PokéZoo",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Game() {
  const time = await getTime();

  const data = await getGame();

  return (
    <div className="flex flex-col gap-4 p-8">
      <RewardButton
        time={time}
        profile={data.currProfile}
      />
      <GameGrid />
    </div>
  );
}
