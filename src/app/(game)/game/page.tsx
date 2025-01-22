import { Button } from "@/src/components/ui/button";
import { isAuthed } from "@/src/server/actions/auth";
import { getTime } from "@/src/server/actions/cookies";
import { Metadata } from "next";
import GameGrid from "../../_components/GameGrid";

export const metadata: Metadata = {
  title: "PokéZoo",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Game() {
  await isAuthed();

  const time = await getTime();

  return (
    <div className="flex flex-col gap-4 p-8">
      {time === "day" ? (
        <form>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            Claim Daily Reward
          </Button>
        </form>
      ) : (
        <form>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Claim Nightly Reward
          </Button>
        </form>
      )}
      <GameGrid />
    </div>
  );
}
