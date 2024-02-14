import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ProgressBar from "../components/ProgressBar";
import { type FullAchievement } from "../components/ProgressBar";
import Topbar from "../components/Topbar";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";
import ThemeWrapper from "../components/ThemeWrapper";

export default function Achievements() {
  const { status } = useSession({
    required: true
  });

  const utils = trpc.useUtils();

  const { data: speciesData } = trpc.species.getSpecies.useQuery({
    order: null
  });

  const { data: instanceData } = trpc.species.getCaughtSpecies.useQuery();

  const { data: achievementData } = trpc.achievement.getAchievements.useQuery();

  const { data: userAchievementData } =
    trpc.userAchievement.getUserAchievements.useQuery();

  const [fullAchievements, setFullAchievements] = useState<FullAchievement[]>();

  // Set full achievements to display progress bars
  useEffect(() => {
    if (speciesData && instanceData && achievementData && userAchievementData) {
      const full: FullAchievement[] = [];
      // (let x = 0; x < achievementData.achievements.length; x++)
      for (const a of achievementData.achievements) {
        let max = 0;
        let value = 0;

        if (a.type === "All") {
          max = speciesData.species.filter(
            (s) =>
              s.region === a.region &&
              s.shiny === a.shiny &&
              s.rarity !== "Mega"
          ).length;
          value = instanceData.filter(
            (i) =>
              i.region === a.region &&
              i.shiny === a.shiny &&
              i.rarity !== "Mega"
          ).length;
        } else if (a.type === "Rarity") {
          max = speciesData.species.filter(
            (s) =>
              s.rarity === a.attribute &&
              s.region === a.region &&
              s.shiny === a.shiny
          ).length;
          value = instanceData.filter(
            (i) =>
              i.rarity === a.attribute &&
              i.region === a.region &&
              i.shiny === a.shiny
          ).length;
        } else if (a.type === "Habitat") {
          max = speciesData.species.filter(
            (s) =>
              s.habitat === a.attribute &&
              s.region === a.region &&
              s.shiny === a.shiny &&
              s.rarity !== "Mega"
          ).length;
          value = instanceData.filter(
            (i) =>
              i.habitat === a.attribute &&
              i.region === a.region &&
              i.shiny === a.shiny &&
              i.rarity !== "Mega"
          ).length;
        } else if (a.type === "Type") {
          max = speciesData.species.filter(
            (s) =>
              (s.typeOne === a.attribute || s.typeTwo === a.attribute) &&
              s.region === a.region &&
              s.shiny === a.shiny &&
              s.rarity !== "Mega"
          ).length;
          value = instanceData.filter(
            (i) =>
              (i.typeOne === a.attribute || i.typeTwo === a.attribute) &&
              i.region === a.region &&
              i.shiny === a.shiny &&
              i.rarity !== "Mega"
          ).length;
        }

        const low = 0.35 * max;
        const high = 0.7 * max;
        const percent = Math.round((value / max) * 100);
        const achieved = userAchievementData.userAchievements.some(
          (u) => u.achievementId === a.id
        );

        full.push({
          achievement: a,
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

  const updateYield = () => {
    void utils.profile.getProfile.invalidate();
  };

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Achievements</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <ThemeWrapper>
        <Sidebar page="Achievements">
          <Topbar />
          <main className="p-4">
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
      </ThemeWrapper>
    </>
  );
}
