"use client";

import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";

export default function SubmitButton(props: {
	text: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
}) {
	const { pending } = useFormStatus();

	return (
		<Button
			className="w-full"
			disabled={pending}
			type="submit"
			variant={props.variant ?? "default"}
		>
			{pending ? <LoadingSpinner /> : props.text}
		</Button>
	);
}
