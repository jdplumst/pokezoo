/** biome-ignore-all lint/complexity/noUselessFragments: address later */
"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import Wildcard from "~/components/wildcard";
import type { Time } from "~/lib/types";
import { claimRewardAction } from "~/server/actions/game";

export default function RewardButton(props: {
	time: Time;
	profile: { claimedDaily: boolean; claimedNightly: boolean };
}) {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);

	const [data, action, isPending] = useActionState(
		claimRewardAction,
		undefined,
	);

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			setIsOpen(true);
			router.refresh();
		}
	}, [data, router]);

	return (
		<>
			{" "}
			{(props.time === "day" && props.profile.claimedDaily) ||
			(props.time === "night" && props.profile.claimedNightly) ? (
				<div>You have already claimed your reward.</div>
			) : props.time === "day" ? (
				<form action={action}>
					<Button
						className="w-40 bg-yellow-400 text-black hover:bg-yellow-500"
						disabled={isPending}
						type="submit"
					>
						{isPending ? <LoadingSpinner /> : "Claim Daily Reward"}
					</Button>
				</form>
			) : (
				<form action={action}>
					<Button
						className="w-40 bg-purple-600 hover:bg-purple-700"
						disabled={isPending}
						type="submit"
					>
						{isPending ? <LoadingSpinner /> : "Claim Nightly Reward"}
					</Button>
				</form>
			)}
			{data?.success === true && (
				<Dialog onOpenChange={setIsOpen} open={isOpen}>
					<DialogContent className="w-96">
						<DialogHeader>
							<DialogTitle>
								You have claimed your{" "}
								{props.time === "day" ? "daily" : "nightly"} reward!
							</DialogTitle>
							<DialogDescription hidden={true}>
								Here are the rewards you have claimed.
							</DialogDescription>
						</DialogHeader>
						<div className="flex h-32 flex-col gap-2">
							<div className="font-semibold">
								You received P{data.reward.toLocaleString()}!
							</div>
							{data.cards.Common ? (
								<div className="flex gap-1">
									<div>
										You received {data.cards.Common} Common wildcard
										{data.cards.Common > 1 && "s"}
									</div>
									<Wildcard height={20} width={20} wildcard="Common" />
								</div>
							) : (
								<></>
							)}
							{data.cards.Rare ? (
								<div className="flex gap-1">
									<div>
										You received {data.cards.Rare} Rare wildcard
										{data.cards.Rare > 1 && "s"}
									</div>
									<Wildcard height={20} width={20} wildcard="Rare" />
								</div>
							) : (
								<></>
							)}
							{data.cards.Epic ? (
								<div className="flex gap-1">
									<div>
										You received {data.cards.Epic} Epic wildcard
										{data.cards.Epic > 1 && "s"}
									</div>
									<Wildcard height={20} width={20} wildcard="Epic" />
								</div>
							) : (
								<></>
							)}
							{data.cards.Legendary ? (
								<div className="flex gap-1">
									<div>
										You received {data.cards.Legendary} Legendary wildcard
										{data.cards.Legendary > 1 && "s"}
									</div>
									<Wildcard height={20} width={20} wildcard="Legendary" />
								</div>
							) : (
								<></>
							)}
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
