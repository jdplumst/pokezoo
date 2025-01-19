"use client";

import { useSidebar } from "@/components/ui/sidebar";
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
  const { open } = useSidebar();

  return (
    <div className="flex items-center justify-center">
      <div
        className={`grid ${open ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` : `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`} gap-10`}
      >
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
              <TooltipContent className="text-md bg-gray-300 dark:bg-black">
                <div className="text-common-unfocus">
                  {b.commonChance}% Common
                </div>
                <div className="text-rare-unfocus">{b.rareChance}% Rare</div>
                <div className="text-epic-unfocus">{b.epicChance}% Epic</div>
                <div className="text-legendary-unfocus">
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
      </div>
    </div>
  );
}
