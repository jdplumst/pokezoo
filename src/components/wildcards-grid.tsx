import Wildcard from "~/components/wildcard";
import WildcardButtons from "~/components/wildcard-buttons";
import type { Rarity } from "~/lib/types";

export default function WildcardsGrid() {
	const wildcards: {
		name: Rarity;
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
					className="flex w-52 flex-col items-center gap-5 border-2 border-solid p-2 shadow-lg"
					key={w.name}
				>
					<Wildcard height={50} width={50} wildcard={w.name} />
					<div className="font-semibold text-lg">{w.name} Wildcard</div>
					<div className="text-center">
						Trade in your wildcards for one wildcard.
					</div>
					<WildcardButtons wildcard={w} />
				</div>
			))}
		</>
	);
}
