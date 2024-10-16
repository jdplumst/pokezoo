import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Loading from "../components/Loading";
import Head from "next/head";
import ThemeWrapper from "../components/ThemeWrapper";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import QuestList from "../components/QuestList";

export default function Quests() {
  const { status } = useSession({ required: true });

  const { data: userQuestData, isLoading: userQuestLoading } =
    trpc.quest.getUserQuests.useQuery();

  if (status === "loading" || userQuestLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Quests</title>
        <meta
          name="description"
          content="PokéZoo"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>
      <ThemeWrapper>
        <Sidebar page="Quests">
          <Topbar />
          <main className="p-4">
            <h3 className="flex justify-center text-5xl font-bold">
              Daily Quests
            </h3>
            <QuestList
              quests={userQuestData?.filter((u) => u.quest?.typeId === 1)}
            />
            <hr className="border-black pb-4"></hr>
            <h3 className="flex justify-center text-5xl font-bold">
              Weekly Quests
            </h3>
            <QuestList
              quests={userQuestData?.filter((u) => u.quest?.typeId === 2)}
            />
            <hr className="border-black pb-4"></hr>
            <h3 className="flex justify-center text-5xl font-bold">
              Monthly Quests
            </h3>
            <QuestList
              quests={userQuestData?.filter((u) => u.quest?.typeId === 3)}
            />
          </main>
        </Sidebar>
      </ThemeWrapper>
    </>
  );
}
