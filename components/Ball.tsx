import { Balls } from "@prisma/client";
import Image from "next/image";
import Tooltip from "./Tooltip";

interface IBall {
  ball: Balls;
  disabled: boolean;
  purchaseBall: (ball: Balls) => void;
}

export default function Ball({ ball, disabled, purchaseBall }: IBall) {
  return (
    <Tooltip ball={ball}>
      <div className="h-72 w-72 border-2 border-black bg-emerald-500 p-2">
        <div className="flex h-full flex-col items-center justify-around">
          <Image
            src={ball.img}
            alt={ball.name}
            width={112}
            height={112}
            className="pixelated"
          />
          <p className="text-center text-3xl font-bold">{ball.name} Ball</p>
          <p className="text-center text-2xl font-bold">
            P{ball.cost.toLocaleString()}
          </p>
          <button
            onClick={() => purchaseBall(ball)}
            disabled={disabled}
            className="w-24 rounded-lg border-2 border-black bg-indigo-500 p-2 font-bold hover:bg-indigo-600">
            Buy
          </button>
        </div>
      </div>
    </Tooltip>
  );
}
