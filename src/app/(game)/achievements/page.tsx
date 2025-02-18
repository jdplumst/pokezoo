import { Progress } from "~/components/ui/progress";
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
import { claimAchievement } from "~/server/actions/achievements";
import { type Metadata } from "next";
import SubmitButton from "~/components/submit-button";
import { getAchievements } from "~/server/queries/achievements";

export const metadata: Metadata = {
  title: "PokéZoo - Achievements",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Achievements() {
  const achievements = await getAchievements();

  return (
    <div className="px-8 pb-8">
      <h1 className="py-4 text-5xl font-bold">Achievements</h1>
      <Separator className="mb-4" />
      <Table>
        <TableCaption hidden={true}>
          A list of your achievement progress.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((a) => (
            <TableRow key={a.achievement.id}>
              <TableCell className="font-medium">
                {a.achievement.tier}
              </TableCell>
              <TableCell>{a.achievement.description}</TableCell>
              <TableCell>P{a.achievement.yield.toLocaleString()}</TableCell>
              <TableCell>
                {a.achievement.claimed ? (
                  "Claimed"
                ) : a.value === a.max ? (
                  <form
                    action={async () => {
                      "use server";

                      await claimAchievement(a.achievement.id);
                    }}
                  >
                    <SubmitButton text="Claim" />
                  </form>
                ) : (
                  <div>
                    {a.value + " / " + a.max + " (" + a.percent + "%)"}
                    <Progress value={a.percent} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
