import { type Metadata } from "next";
import { Event } from "~/components/event";
import GameGrid from "~/components/game-grid";
import RewardButton from "~/components/reward-button";
import StarterSelect from "~/components/starter-select";
import { getTime } from "~/server/db/queries/cookies";
import { getGame } from "~/server/db/queries/game";

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
      {data.currProfile.johtoStarter === false ? (
        <StarterSelect regionId={2} regionName="Johto" />
      ) : data.currProfile.hoennStarter === false ? (
        <StarterSelect regionId={3} regionName="Hoenn" />
      ) : data.currProfile.sinnohStarter === false ? (
        <StarterSelect regionId={4} regionName="Sinnoh" />
      ) : data.currProfile.unovaStarter === false ? (
        <StarterSelect regionId={5} regionName="Unova" />
      ) : data.currProfile.kalosStarter === false ? (
        <StarterSelect regionId={6} regionName="Kalos" />
      ) : data.currProfile.alolaStarter === false ? (
        <StarterSelect regionId={7} regionName="Alola" />
      ) : data.currProfile.galarStarter === false ? (
        <StarterSelect regionId={8} regionName="Galar" />
      ) : data.currProfile.hisuiStarter === false ? (
        <StarterSelect regionId={9} regionName="Hisui" />
      ) : data.currProfile.paldeaStarter === false ? (
        <StarterSelect regionId={10} regionName="Paldea" />
      ) : null}
      <RewardButton time={time} profile={data.currProfile} />
      <Event />
      <GameGrid />
    </div>
  );
}
