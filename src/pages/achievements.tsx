import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ProgressBar from "../components/ProgressBar";
import { FullAchievement } from "../components/ProgressBar";
import Topbar from "../components/Topbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Achievements() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const { data: speciesData } = trpc.species.getSpecies.useQuery({
    order: null
  });

  const { data: instanceData } = trpc.instance.getInstanceSpecies.useQuery({
    distinct: true
  });

  const { data: achievementData } = trpc.achievement.getAchievements.useQuery();

  const { data: userAchievementData } =
    trpc.userAchievement.getUserAchievements.useQuery();

  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);
  const [totalYield, setTotalYield] = useState(0);
  const [fullAchievements, setFullAchievements] = useState<FullAchievement[]>();

  // Set time and total yield states
  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }

    if (status !== "authenticated") return;
    setTotalYield(session.user.totalYield);

    setLoading(false);
  }, [session]);

  // Set full achievements to display progress bars
  useEffect(() => {
    if (speciesData && instanceData && achievementData && userAchievementData) {
      let full: FullAchievement[] = [];

      for (let x = 0; x < achievementData.achievements.length; x++) {
        let max = 0;
        let value = 0;

        if (achievementData.achievements[x].type === "All") {
          max = speciesData.species.filter(
            (s) =>
              s.region === achievementData.achievements[x].region &&
              s.shiny === achievementData.achievements[x].shiny
          ).length;
          value = instanceData.instances.filter(
            (i) =>
              i.species.region === achievementData.achievements[x].region &&
              i.species.shiny === achievementData.achievements[x].shiny
          ).length;
        } else if (achievementData.achievements[x].type === "Rarity") {
          max = speciesData.species.filter(
            (s) =>
              s.rarity === achievementData.achievements[x].attribute &&
              s.region === achievementData.achievements[x].region &&
              s.shiny === achievementData.achievements[x].shiny
          ).length;
          value = instanceData.instances.filter(
            (i) =>
              i.species.rarity === achievementData.achievements[x].attribute &&
              i.species.region === achievementData.achievements[x].region &&
              i.species.shiny === achievementData.achievements[x].shiny
          ).length;
        } else if (achievementData.achievements[x].type === "Habitat") {
          max = speciesData.species.filter(
            (s) =>
              s.habitat === achievementData.achievements[x].attribute &&
              s.region === achievementData.achievements[x].region &&
              s.shiny === achievementData.achievements[x].shiny
          ).length;
          value = instanceData.instances.filter(
            (i) =>
              i.species.habitat === achievementData.achievements[x].attribute &&
              i.species.region === achievementData.achievements[x].region &&
              i.species.shiny === achievementData.achievements[x].shiny
          ).length;
        } else if (achievementData.achievements[x].type === "Type") {
          max = speciesData.species.filter(
            (s) =>
              (s.typeOne === achievementData.achievements[x].attribute ||
                s.typeTwo === achievementData.achievements[x].attribute) &&
              s.region === achievementData.achievements[x].region &&
              s.shiny === achievementData.achievements[x].shiny
          ).length;
          value = instanceData.instances.filter(
            (i) =>
              (i.species.typeOne ===
                achievementData.achievements[x].attribute ||
                i.species.typeTwo ===
                  achievementData.achievements[x].attribute) &&
              i.species.region === achievementData.achievements[x].region &&
              i.species.shiny === achievementData.achievements[x].shiny
          ).length;
        }

        const low = 0.35 * max;
        const high = 0.7 * max;
        const percent = Math.round((value / max) * 100);
        const achieved = userAchievementData.userAchievements.some(
          (u) => u.achievementId === achievementData.achievements[x].id
        );

        full.push({
          achievement: achievementData.achievements[x],
          max: max,
          value: value,
          low: low,
          high: high,
          percent: percent,
          achieved: achieved
        });
      }

      full.sort(function (a, b) {
        if (a.achieved > b.achieved) return 1;
        if (b.achieved > a.achieved) return -1;

        if (a.percent >= b.percent) return -1;
        if (b.percent < a.percent) return 1;
        return 0;
      });

      setFullAchievements(full);
    }
  }, [instanceData, speciesData, achievementData, userAchievementData]);

  const updateYield = (x: number) => {
    setTotalYield((prevTotalYield) => prevTotalYield + x);
  };

  if (loading || status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Achievements</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Achievements">
          <Topbar
            username={session.user.username}
            balance={session.user.balance}
            totalYield={totalYield}
            totalCards={session.user.instanceCount}
            commonCards={session.user.commonCards}
            rareCards={session.user.rareCards}
            epicCards={session.user.epicCards}
            legendaryCards={session.user.legendaryCards}
          />
          <main className="p-4">
            {session.user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            {fullAchievements ? (
              <div className="flex justify-center pt-5">
                <ul className="w-3/4">
                  {fullAchievements.map((a) => (
                    <li
                      key={a.achievement.id}
                      className="mb-5 flex h-14 items-center justify-between border-2 border-tooltip-border p-2">
                      <div>
                        <b>Tier {a.achievement.tier}</b> |{" "}
                        {a.achievement.description}
                      </div>
                      <div>
                        <ProgressBar
                          user={session.user}
                          species={speciesData?.species!}
                          instances={instanceData?.instances!}
                          fullAchievement={a}
                          updateYield={updateYield}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            )}
          </main>
        </Sidebar>
      </div>
    </>
  );
}
