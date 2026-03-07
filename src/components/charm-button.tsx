"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import { purchaseCharmAction } from "~/server/actions/shop";

export default function CharmButton(props: { charmId: number }) {
	const router = useRouter();

	const [data, action, isPending] = useActionState(
		purchaseCharmAction,
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
		<form action={action}>
			<input name="charmId" type="hidden" value={props.charmId} />
			<Button disabled={isPending}>
				{isPending ? <LoadingSpinner /> : "Buy"}
			</Button>
		</form>
	);
}
