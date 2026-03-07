"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import type { Region } from "~/lib/types";
import { selectStarterAction } from "~/server/actions/starters";
import { api } from "~/trpc/react";

export default function StarterSelect(props: {
	regionId: number;
	regionName: Region;
}) {
	const router = useRouter();

	const utils = api.useUtils();

	const [starterId, setStarterId] = useState<string>("");

	const [data, action, isPending] = useActionState(
		selectStarterAction,
		undefined,
	);

	const starters = api.game.getStarters.useQuery({
		regionId: props.regionId,
	});

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			toast.message(data.message);
			void utils.game.invalidate();
			router.refresh();
		}
	}, [data, router, utils.game]);

	return (
		<Dialog open={true}>
			<DialogContent className="[&>button]:hidden">
				<DialogHeader>
					<DialogTitle className="text-center">
						Selecting a {props.regionName} Starter
					</DialogTitle>
					<DialogDescription className="text-center">
						Please select one of the following starter pokémon:
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-5">
					{starters.data?.starters?.map((s) => (
						// biome-ignore lint/a11y/noStaticElementInteractions: address later
						// biome-ignore lint/a11y/useKeyWithClickEvents: address later
						<div
							className={`w-1/3 border-2 border-black border-solid bg-rare-unfocus p-4 hover:cursor-pointer hover:bg-rare-focus ${s.id === starterId && "border-4 border-yellow-400"}`}
							key={s.id}
							onClick={() => setStarterId(s.id)}
						>
							<div className="flex flex-col items-center gap-2">
								<Image alt={s.name} height={70} src={s.img} width={70} />
								<div className="text-center font-lg font-semibold capitalize">
									{s.name}
								</div>
							</div>
						</div>
					))}
				</div>
				<DialogFooter className="mx-auto">
					<form action={action}>
						<input name="starterId" type="hidden" value={starterId} />
						<Button disabled={isPending} type="submit">
							{isPending ? <LoadingSpinner /> : "Confirm"}
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
