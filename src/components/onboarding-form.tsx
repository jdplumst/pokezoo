"use client";

import Image from "next/image";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Input } from "~/components/ui/input";
import { createProfileAction } from "~/server/actions/onboarding";

export default function OnboardingForm(props: {
	starters: { id: string; name: string; img: string }[];
}) {
	const [data, action, isPending] = useActionState(
		createProfileAction,
		undefined,
	);

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		}
	}, [data]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-violet-800 p-8 text-white">
			<div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
				<h1 className="mb-6 text-center font-bold text-3xl">
					Welcome to PokéZoo!
				</h1>
				<form action={action} className="flex flex-col items-center space-y-6">
					<div className="w-full">
						<label
							className="mb-2 block font-medium text-sm"
							htmlFor="username"
						>
							Choose your trainer name:
						</label>
						<Input
							className={`w-full rounded-md bg-gray-700 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-violet-500 ${
								data?.error && "border border-red-500"
							}`}
							id="username"
							maxLength={30}
							name="username"
							placeholder="Enter username"
							type="text"
						/>
					</div>
					<div className="w-full">
						<p className="mb-2 block font-medium text-sm">
							Select your starter Pokémon:
						</p>
						<div className="grid grid-cols-3 gap-4">
							{props.starters.map((p) => (
								<label
									className={`rounded-lg bg-gray-700 p-2 transition-all hover:cursor-pointer hover:bg-gray-600 has-checked:bg-violet-600 has-checked:ring-violet-400 ${
										data?.error && "border border-red-500"
									}`}
									htmlFor={p.id}
									key={p.id}
								>
									<input
										className="hidden"
										id={p.id}
										name="starterId"
										type="radio"
										value={p.id}
									/>
									<Image
										alt={p.name}
										className="mx-auto"
										height={80}
										src={p.img}
										width={80}
									/>
									<p className="mt-2 text-center capitalize">{p.name}</p>
								</label>
							))}
						</div>
					</div>
					{/* <SubmitButton text="Begin Journey" /> */}
					<button
						className="w-full rounded-full bg-violet-500 px-4 py-2 font-bold text-white transition-colors hover:bg-violet-600"
						disabled={isPending}
						type="submit"
					>
						{isPending ? <LoadingSpinner /> : "Begin Journey"}
					</button>
				</form>
			</div>
		</div>
	);
}
