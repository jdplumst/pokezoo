import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../server/db";
import Loading from "../components/Loading";

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
    distinct: ["speciesId"]
  });
  const species = await prisma.species.findMany();
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id.toString() }
  });

  return {
    props: {
      user,
      instances,
      species,
      achievements,
      userAchievements
    }
  };
};

export default function Achievements({
  user,
  instances,
  species,
  achievements,
  userAchievements
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

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
          <main className="p-4">
            <ul>
              {achievements.map((a) => (
                <li className="mb-5 flex justify-between border-2 border-tooltip-border p-2">
                  <div>
                    <b>Tier {a.tier}</b> | {a.description}
                  </div>
                  <div>progress or claim</div>
                </li>
              ))}
            </ul>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
