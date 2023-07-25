import { Ball } from "@prisma/client";
import { ReactNode, useState } from "react";

interface ITooltip {
  ball: Ball;
  children: ReactNode;
}

export default function Tooltip({ ball, children }: ITooltip) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="tooltip-container">
      {visible && (
        <div className="tooltip color z-10 min-w-[200px] border-2 border-tooltip-border bg-tooltip p-4">
          <div>
            Opening this ball gives:
            {ball.name === "Net" && (
              <p>
                A guaranteed <span className="text-water">Water</span> or{" "}
                <span className="text-bug">Bug</span> type Pokémon.
              </p>
            )}
            {ball.name === "Dusk" && (
              <p>
                A guaranteed <span className="text-dark">Dark</span> or{" "}
                <span className="text-ghost">Ghost</span> type Pokémon.
              </p>
            )}
            {ball.name === "Dive" && (
              <p>A guaranteed Waters-Edge or Sea Pokémon.</p>
            )}
            {ball.name === "Safari" && (
              <p>A guaranteed Mountain or Rough-Terrain Pokémon.</p>
            )}
            {ball.name === "Premier" && (
              <p>A guaranteed Pokémon from your region of choice.</p>
            )}
            <p>
              {ball.commonChance}% Chance{" "}
              <span className="text-common-unfocus">Common</span>
            </p>
            <p>
              {ball.rareChance}% Chance{" "}
              <span className="text-rare-unfocus">Rare</span>
            </p>
            <p>
              {ball.epicChance}% Chance{" "}
              <span className="text-epic-unfocus">Epic</span>
            </p>
            <p>
              {ball.legendaryChance}% Chance{" "}
              <span className="text-legendary-unfocus">Legendary</span>
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
