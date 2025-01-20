import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import BallSlider from "./BallSlider";
import { z } from "zod";
import { selectBallSchema } from "@/src/server/db/schema";

export default function BallsGrid(props: {
  balls: z.infer<typeof selectBallSchema>[];
}) {
  return (
    <>
      {props.balls.map((b) => (
        <TooltipProvider key={b.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex w-52 flex-col items-center gap-2 border-2 border-solid p-2 shadow-lg">
                <Image
                  src={b.img}
                  alt={b.name}
                  width={150}
                  height={150}
                  className="pixelated"
                />
                <div className="text-lg font-semibold">{b.name} Ball</div>
                <BallSlider ballId={b.id} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-md bg-gray-400 dark:bg-black">
              <div className="text-common-unfocus">
                {b.commonChance}% Common
              </div>
              <div className="text-rare-unfocus">{b.rareChance}% Rare</div>
              <div className="text-epic-unfocus">{b.epicChance}% Epic</div>
              <div className="text-legendary-focus">
                {b.legendaryChance}% Legendary
              </div>
              <div className="text-mega-unfocus">{b.megaChance}% Mega</div>
              <div className="text-ub-unfocus">{b.ubChance}% Ultra Beast</div>
              <div className="text-gmax-unfocus">
                {b.gmaxChance}% Gigantamax
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
}
