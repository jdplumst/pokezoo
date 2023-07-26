import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../server/db";
import Loading from "../components/Loading";
import ProgressBar from "../components/ProgressBar";
import { FullAchievement } from "../components/ProgressBar";
import Topbar from "../components/Topbar";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }

  const user = session?.user || null;
  const instances = await prisma.instance.findMany({
    where: { userId: user.id.toString() },
    distinct: ["speciesId"],
    include: {
      species: {
        select: {
          rarity: true,
          habitat: true,
          typeOne: true,
          typeTwo: true,
          generation: true,
          shiny: true
        }
      }
    }
  });
  const species = await prisma.species.findMany();
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id.toString() }
  });

  // Calculate the percentage for each achievement
  let fullAchievements: FullAchievement[] = [];

  for (let x = 0; x < achievements.length; x++) {
    let max = 0;
    let value = 0;

    if (achievements[x].type === "All") {
      max = species.filter(
        (s) =>
          s.generation === achievements[x].generation &&
          s.shiny === achievements[x].shiny
      ).length;
      value = instances.filter(
        (i) =>
          i.species.generation === achievements[x].generation &&
          i.species.shiny === achievements[x].shiny
      ).length;
    } else if (achievements[x].type === "Rarity") {
      max = species.filter(
        (s) =>
          s.rarity === achievements[x].attribute &&
          s.generation === achievements[x].generation &&
          s.shiny === achievements[x].shiny
      ).length;
      value = instances.filter(
        (i) =>
          i.species.rarity === achievements[x].attribute &&
          i.species.generation === achievements[x].generation &&
          i.species.shiny === achievements[x].shiny
      ).length;
    } else if (achievements[x].type === "Habitat") {
      max = species.filter(
        (s) =>
          s.habitat === achievements[x].attribute &&
          s.generation === achievements[x].generation &&
          s.shiny === achievements[x].shiny
      ).length;
      value = instances.filter(
        (i) =>
          i.species.habitat === achievements[x].attribute &&
          i.species.generation === achievements[x].generation &&
          i.species.shiny === achievements[x].shiny
      ).length;
    } else if (achievements[x].type === "Type") {
      max = species.filter(
        (s) =>
          (s.typeOne === achievements[x].attribute ||
            s.typeTwo === achievements[x].attribute) &&
          s.generation === achievements[x].generation &&
          s.shiny === achievements[x].shiny
      ).length;
      value = instances.filter(
        (i) =>
          (i.species.typeOne === achievements[x].attribute ||
            i.species.typeTwo === achievements[x].attribute) &&
          i.species.generation === achievements[x].generation &&
          i.species.shiny === achievements[x].shiny
      ).length;
    }

    const low = 0.35 * max;
    const high = 0.7 * max;
    const percent = Math.round((value / max) * 100);
    const achieved = userAchievements.some(
      (u) => u.achievementId === achievements[x].id
    );

    fullAchievements.push({
      achievement: achievements[x],
      max: max,
      value: value,
      low: low,
      high: high,
      percent: percent,
      achieved: achieved
    });
  }

  fullAchievements.sort(function (a, b) {
    if (a.achieved > b.achieved) return 1;
    if (b.achieved > a.achieved) return -1;

    if (a.percent >= b.percent) return -1;
    if (b.percent < a.percent) return 1;
    return 0;
  });

  // .sort((a, b) => (a.percent > b.percent ? 1 : -1))
  // .sort((a, b) => (a.achieved > b.achieved ? 1 : -1));

  let parsedInstances: typeof instances = JSON.parse(JSON.stringify(instances));
  let parsedUserAchievements: typeof userAchievements = JSON.parse(
    JSON.stringify(userAchievements)
  );

  return {
    props: {
      user,
      instances: parsedInstances,
      species,
      fullAchievements,
      userAchievements: parsedUserAchievements
    }
  };
};

export default function Achievements({
  user,
  instances,
  species,
  fullAchievements,
  userAchievements
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);
  const [totalYield, setTotalYield] = useState(user.totalYield);

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);
  }, []);

  const updateYield = (x: number) => {
    setTotalYield((prevTotalYield) => prevTotalYield + x);
  };

  if (loading) return <Loading />;

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
            user={user}
            balance={user.balance}
            totalYield={totalYield}
            totalCards={instances.length}
          />
          <main className="p-4">
            {user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
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
                        user={user}
                        species={species}
                        instances={instances}
                        fullAchievement={a}
                        updateYield={updateYield}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
