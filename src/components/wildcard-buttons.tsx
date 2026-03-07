"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import Wildcard from "~/components/wildcard";
import type { Rarity } from "~/lib/types";
import { purchaseWildcardAction } from "~/server/actions/shop";

export default function WildcardButtons(props: {
	wildcard: {
		name: Rarity;
		commonCost?: number;
		rareCost?: number;
		epicCost?: number;
		legendaryCost?: number;
	};
}) {
	const router = useRouter();

	const [data, action, isPending] = useActionState(
		purchaseWildcardAction,
		undefined,
	);

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			toast.message(data.message);
			router.refresh();
		}
	}, [data, router]);

	return (
		<div className="flex gap-1">
			{props.wildcard.commonCost && (
				<form action={action}>
					<input name="tradedWildcard" type="hidden" value="Common" />
					<input
						name="purchasedWildcard"
						type="hidden"
						value={props.wildcard.name}
					/>
					<Button className="flex gap-1" disabled={isPending} type="submit">
						<Wildcard height={30} width={30} wildcard="Common" />
						{props.wildcard.commonCost}
					</Button>
				</form>
			)}
			{props.wildcard.rareCost && (
				<form action={action}>
					<input name="tradedWildcard" type="hidden" value="Rare" />
					<input
						name="purchasedWildcard"
						type="hidden"
						value={props.wildcard.name}
					/>
					<Button className="flex gap-1" disabled={isPending} type="submit">
						<Wildcard height={30} width={30} wildcard="Rare" />
						{props.wildcard.rareCost}
					</Button>
				</form>
			)}
			{props.wildcard.epicCost && (
				<form action={action}>
					<input name="tradedWildcard" type="hidden" value="Epic" />
					<input
						name="purchasedWildcard"
						type="hidden"
						value={props.wildcard.name}
					/>
					<Button className="flex gap-1" disabled={isPending} type="submit">
						<Wildcard height={30} width={30} wildcard="Epic" />
						{props.wildcard.epicCost}
					</Button>
				</form>
			)}
			{props.wildcard.legendaryCost && (
				<form action={action}>
					<input name="tradedWildcard" type="hidden" value="Legendary" />
					<input
						name="purchasedWildcard"
						type="hidden"
						value={props.wildcard.name}
					/>
					<Button className="flex gap-1" disabled={isPending} type="submit">
						<Wildcard height={30} width={30} wildcard="Legendary" />
						{props.wildcard.legendaryCost}
					</Button>
				</form>
			)}
		</div>
	);
}
