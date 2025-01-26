import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { claimQuest, getQuests } from "@/src/server/actions/quests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PokéZoo - Quests",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Quests() {
  const quests = await getQuests();

  return (
    <div className="p-8">
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
            <TableRow>
              <TableCell className="font-medium">{q.questType?.name}</TableCell>
              <TableCell>{q.quest?.description}</TableCell>
              <TableCell>P{q.quest?.reward.toLocaleString()}</TableCell>
              <TableCell>
                {q.userQuest.claimed ? (
                  "Claimed"
                ) : q.userQuest.count >= q.quest?.goal! ? (
                  <form
                    action={async () => {
                      "use server";

                      await claimQuest(q.userQuest.id);
                    }}
                  >
                    <Button>Claim</Button>
                  </form>
                ) : (
                  q.userQuest.count + " / " + q.quest?.goal!
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
