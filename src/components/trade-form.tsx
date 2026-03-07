"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import type { Rarity } from "~/lib/types";
import { initiateTradeAction, offerTradeAction } from "~/server/actions/trades";
import { api } from "~/trpc/react";

export default function TradeForm(
	props:
		| {
				type: "initiate";
		  }
		| { type: "offer"; tradeId: string },
) {
	const router = useRouter();

	const [open, setOpen] = useState(false);

	const [description, setDescription] = useState("");
	const [search, setSearch] = useState("");
	const [instance, setInstance] = useState<string>("");

	const pokemon = api.trades.getPokemonForTrades.useQuery({
		name: search,
	});

	const [initiateData, initiateAction, initiateIsPending] = useActionState(
		initiateTradeAction,
		undefined,
	);

	useEffect(() => {
		if (initiateData?.success === false) {
			toast.error(initiateData.error);
		} else if (initiateData?.success === true) {
			toast.message(initiateData.message);
			setDescription("");
			setSearch("");
			setInstance("");
			setOpen(false);
			router.refresh();
		}
	}, [initiateData, router]);

	const [offerData, offerAction, offerIsPending] = useActionState(
		offerTradeAction,
		undefined,
	);

	useEffect(() => {
		if (offerData?.success === false) {
			toast.error(offerData.error);
		} else if (offerData?.success === true) {
			toast.message(offerData.message);
			setDescription("");
			setSearch("");
			setInstance("");
			setOpen(false);
			router.refresh();
		}
	}, [offerData, router]);

	return (
		<>
			<Button className="w-fit" onClick={() => setOpen(true)}>
				{props.type === "initiate" ? "Add Trade" : "Add Offer"}
			</Button>
			<Sheet onOpenChange={setOpen} open={open}>
				<SheetContent className="overflow-y-scroll">
					<SheetHeader>
						<SheetTitle>Add Trade</SheetTitle>
						<SheetDescription hidden={true}>
							Select a pokémon to trade and add a description.
						</SheetDescription>
					</SheetHeader>
					<div className="flex flex-col items-center gap-10 py-4">
						{props.type === "initiate" && (
							<div className="flex w-full flex-col">
								<Textarea
									maxLength={100}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Enter a short message here."
									value={description}
								/>
								<div>{description.length} / 100</div>
							</div>
						)}
						<Input
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search a pokémon to trade."
							value={search}
						/>
						<div className="flex h-[430px] w-full flex-col gap-2 overflow-y-scroll">
							{pokemon.data?.pokemon.map((p) => (
								<button
									className="w-full"
									key={p.id}
									onClick={() => setInstance(p.id)}
									type="button"
								>
									<MiniPokemonCard
										img={p.img}
										name={p.name}
										rarity={p.rarity as Rarity}
										selected={p.id === instance}
										shiny={p.shiny}
									/>
								</button>
							))}
						</div>
						<form
							action={props.type === "initiate" ? initiateAction : offerAction}
						>
							<input name="description" type="hidden" value={description} />
							<input name="instanceId" type="hidden" value={instance} />
							{props.type === "offer" && (
								<input name="tradeId" type="hidden" value={props.tradeId} />
							)}
							<Button
								disabled={initiateIsPending || offerIsPending}
								type="submit"
							>
								{initiateIsPending || offerIsPending ? (
									<LoadingSpinner />
								) : props.type === "initiate" ? (
									"Add Trade"
								) : (
									"Add Offer"
								)}
							</Button>
						</form>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
