import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  selectCharmSchema,
  selectUserCharmsSchema,
} from "@/src/server/db/schema";
import Image from "next/image";
import { z } from "zod";
import CharmButton from "./CharmButton";

export default function CharmsGrid(props: {
  charms: z.infer<typeof selectCharmSchema>[];
  userCharms: z.infer<typeof selectUserCharmsSchema>[];
}) {
  return (
    <>
      {props.charms.map((c) => (
        <TooltipProvider key={c.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex w-52 flex-col items-center gap-2 border-2 border-solid p-2 shadow-lg">
                <Image
                  src={c.img}
                  alt={c.name}
                  width={150}
                  height={150}
                  className="pixelated"
                />
                <div className="text-lg font-semibold">{c.name} Charm</div>
                {props.userCharms.some((u) => u.charmId === c.id) ? (
                  <div>Owned</div>
                ) : (
                  <CharmButton charmId={c.id} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-md bg-gray-400 dark:bg-black">
              {c.name === "Catching" && (
                <div>
                  Increases the total number of Pokémon a user can have to
                  3,000.
                </div>
              )}
              {c.name === "Mark" && (
                <div>
                  Increases the number of wildcards a user gets from claiming a
                  reward to 3.
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
}
