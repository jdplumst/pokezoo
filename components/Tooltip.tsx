import { ReactNode, useState } from "react";

export type Ball = "Poke" | "Great" | "Ultra" | "Master";

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
        <div className="tooltip z-10 min-w-[200px] bg-blue-700 p-4 text-black">
          {ball === "Poke" && (
            <div>
              Opening this ball gives:
              <p>
                80% Chance <span className="text-white">Common</span>
              </p>
              <p>
                15% Chance <span className="text-orange-500">Rare</span>
              </p>
              <p>
                5% Chance <span className="text-purple-500">Epic</span>
              </p>
              <p>
                0% Chance <span className="text-yellow-500">Legendary</span>
              </p>
            </div>
          )}
          {ball === "Great" && (
            <div>
              Opening this ball gives:
              <p>
                65% Chance <span className="text-white">Common</span>
              </p>
              <p>
                25% Chance <span className="text-orange-500">Rare</span>
              </p>
              <p>
                10% Chance <span className="text-purple-500">Epic</span>
              </p>
              <p>
                0% Chance <span className="text-yellow-500">Legendary</span>
              </p>
            </div>
          )}
          {ball === "Ultra" && (
            <div>
              Opening this ball gives:
              <p>
                50% Chance <span className="text-white">Common</span>
              </p>
              <p>
                30% Chance <span className="text-orange-500">Rare</span>
              </p>
              <p>
                18% Chance <span className="text-purple-500">Epic</span>
              </p>
              <p>
                2% Chance <span className="text-yellow-500">Legendary</span>
              </p>
            </div>
          )}
          {ball === "Master" && (
            <div>
              Opening this ball gives:
              <p>
                40% Chance <span className="text-white">Common</span>
              </p>
              <p>
                30% Chance <span className="text-orange-500">Rare</span>
              </p>
              <p>
                25% Chance <span className="text-purple-500">Epic</span>
              </p>
              <p>
                5% Chance <span className="text-yellow-500">Legendary</span>
              </p>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
