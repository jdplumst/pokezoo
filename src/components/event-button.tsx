"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading-spinner";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import type { Event, Rarity } from "~/lib/types";
import { claimEventAction } from "~/server/actions/game";
import { api } from "~/trpc/react";

export function EventButton(props: { event: Event }) {
	const utils = api.useUtils();

	const router = useRouter();

	const [data, action, isPending] = useActionState(claimEventAction, undefined);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (data?.success) {
			setOpen(true);
			void utils.game.getPokemon.invalidate();
		}
	}, [data, utils]);

	useEffect(() => {
		if (!open) {
			router.refresh();
		}
	}, [open, router]);

	return (
		<>
			<form action={action}>
				<Button
					className="bg-green-500 hover:bg-green-600"
					disabled={isPending}
				>
					{isPending ? (
						<LoadingSpinner />
					) : props.event === "Christmas" ? (
						"Claim Christmas Present"
					) : props.event === "New Year's" ? (
						"Claim New Year's Present"
					) : (
						"Claim PokéZoo Day Present"
					)}
				</Button>
			</form>
			{data?.success === true && (
				<Dialog onOpenChange={setOpen} open={open}>
					<DialogContent className="w-96">
						<DialogHeader>
							<DialogTitle>You have obtained a gift!</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Here is the Pokémon you have obtained.
						</DialogDescription>
						<div className="flex h-80 flex-col gap-4">
							<MiniPokemonCard
								img={data.gift.img}
								name={data.gift.name}
								rarity={data.gift.rarity as Rarity}
								shiny={data.gift.shiny}
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
