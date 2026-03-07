import Image from "next/image";
import type { z } from "zod";
import CharmButton from "~/components/charm-button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import type {
	selectCharmSchema,
	selectUserCharmsSchema,
} from "~/server/db/schema";

export default function CharmsGrid(props: {
	charms: z.infer<typeof selectCharmSchema>[];
	userCharms: z.infer<typeof selectUserCharmsSchema>[];
}) {
	return (
		<>
			{props.charms.map((c) => (
				<TooltipProvider key={c.id}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex w-52 flex-col items-center gap-2 border-2 border-solid p-2 shadow-lg">
								<Image
									alt={c.name}
									className="pixelated"
									height={150}
									src={c.img}
									width={150}
								/>
								<div className="font-semibold text-lg">{c.name} Charm</div>
								<div className="font-medium text-md">
									P{c.cost.toLocaleString()}
								</div>
								{props.userCharms.some((u) => u.charmId === c.id) ? (
									<div>Owned</div>
								) : (
									<CharmButton charmId={c.id} />
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent className="bg-gray-400 text-md dark:bg-black">
							{c.name === "Catching" && (
								<div>
									Increases the total number of Pokémon a user can have to
									3,000.
								</div>
							)}
							{c.name === "Mark" && (
								<div>
									Increases the number of wildcards a user gets from claiming a
									reward to 3.
								</div>
							)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			))}
		</>
	);
}
