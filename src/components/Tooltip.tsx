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
        <div className="tooltip color z-10 min-w-[200px] border-2 border-[#6943ff62] p-4">
          <div>
            Opening this ball gives:
            {ball.name === "Net" && (
              <p>
                A guaranteed <span className="text-blue-500">Water</span> or{" "}
                <span className="text-lime-500">Bug</span> type Pokémon.
              </p>
            )}
            {ball.name === "Dusk" && (
              <p>
                A guaranteed <span className="text-black">Dark</span> or{" "}
                <span className="text-violet-500">Ghost</span> type Pokémon.
              </p>
            )}
            <p>
              {ball.commonChance}% Chance{" "}
              <span className="text-white">Common</span>
            </p>
            <p>
              {ball.rareChance}% Chance{" "}
              <span className="text-orange-500">Rare</span>
            </p>
            <p>
              {ball.epicChance}% Chance{" "}
              <span className="text-purple-500">Epic</span>
            </p>
            <p>
              {ball.legendaryChance}% Chance{" "}
              <span className="text-emerald-500">Legendary</span>
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
