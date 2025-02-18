import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { claimQuest } from "~/server/actions/quests";
import { type Metadata } from "next";
import SubmitButton from "~/components/submit-button";
import { getQuests } from "~/server/queries/quests";

export const metadata: Metadata = {
  title: "PokéZoo - Quests",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Quests() {
  const quests = await getQuests();

  return (
    <div className="px-8 pb-8">
      <h1 className="py-4 text-5xl font-bold">Quests</h1>
      <Separator className="mb-4" />
      <Table>
        <TableCaption hidden={true}>A list of your quests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quests.map((q) => (
            <TableRow key={q.userQuest.id}>
              <TableCell className="font-medium">{q.questType?.name}</TableCell>
              <TableCell>{q.quest.description}</TableCell>
              <TableCell>P{q.quest.reward.toLocaleString()}</TableCell>
              <TableCell>
                {q.userQuest.claimed ? (
                  "Claimed"
                ) : q.userQuest.count >= q.quest.goal ? (
                  <form
                    action={async () => {
                      "use server";

                      await claimQuest(q.userQuest.id);
                    }}
                  >
                    <SubmitButton text="Claim" />
                  </form>
                ) : (
                  q.userQuest.count + " / " + q.quest.goal
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
