import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Image from "next/image";
import BallSlider from "~/components/ball-slider";
import { type z } from "zod";
import { type selectBallSchema } from "~/server/db/schema";

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
                <div className="text-md font-medium">
                  P{b.cost.toLocaleString()}
                </div>
                <BallSlider ballId={b.id} ballName={b.name} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-md bg-black">
              {b.name === "Net" && (
                <p>
                  A guaranteed <span className="text-water">Water</span> or{" "}
                  <span className="text-bug">Bug</span> type Pokémon.
                </p>
              )}
              {b.name === "Dusk" && (
                <p>
                  A guaranteed <span className="text-dark">Dark</span> or{" "}
                  <span className="text-ghost">Ghost</span> type Pokémon.
                </p>
              )}
              {b.name === "Dive" && (
                <p>A guaranteed Waters-Edge or Sea Pokémon.</p>
              )}
              {b.name === "Safari" && (
                <p>A guaranteed Mountain or Rough-Terrain Pokémon.</p>
              )}
              {b.name === "Premier" && (
                <p>A guaranteed Pokémon from your region of choice.</p>
              )}
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
