import { Balls } from "@prisma/client";
import { ReactNode, useState } from "react";

interface ITooltip {
  ball: Balls;
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
        <div className="tooltip z-10 min-w-[200px] bg-blue-700 p-4 text-black">
          <div>
            Opening this ball gives:
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
              <span className="text-yellow-500">Legendary</span>
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
