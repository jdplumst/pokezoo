import Wildcard from "./Wildcard";
import { type ZodRarity } from "@/src/zod";
import { type z } from "zod";
import WildcardButtons from "./WildcardButtons";

export default function WildcardsGrid() {
  const wildcards: {
    name: z.infer<typeof ZodRarity>;
    commonCost?: number;
    rareCost?: number;
    epicCost?: number;
    legendaryCost?: number;
  }[] = [
    {
      name: "Common",
      rareCost: 1,
      epicCost: 1,
      legendaryCost: 1,
    },
    {
      name: "Rare",
      commonCost: 2,
      epicCost: 1,
      legendaryCost: 1,
    },
    {
      name: "Epic",
      commonCost: 4,
      rareCost: 2,
      legendaryCost: 1,
    },
    {
      name: "Legendary",
      commonCost: 50,
      rareCost: 35,
      epicCost: 15,
    },
  ];

  return (
    <>
      {wildcards.map((w) => (
        <div
          key={w.name}
          className="flex w-52 flex-col items-center gap-5 border-2 border-solid p-2 shadow-lg"
        >
          <Wildcard
            wildcard={w.name}
            width={50}
            height={50}
          />
          <div className="text-lg font-semibold">{w.name} Wildcard</div>
          <div className="text-center">
            Trade in your wildcards for one wildcard.
          </div>
          <WildcardButtons wildcard={w} />
        </div>
      ))}
    </>
  );
}
