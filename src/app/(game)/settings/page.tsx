import type { Metadata } from "next";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { timezones } from "~/lib/timezones";
import { setThemeAction, setTimezoneAction } from "~/server/actions/cookies";
import { isAuthed } from "~/server/db/queries/auth";
import { getTimezone } from "~/server/db/queries/cookies";

export const metadata: Metadata = {
	title: "PokéZoo - Settings",
	icons: {
		icon: "/favicon.png",
	},
};

export default async function Settings() {
	await isAuthed();

	const timezone = await getTimezone();

	return (
		<div className="px-8">
			<h1 className="py-4 font-bold text-5xl">Settings</h1>
			<Separator className="mb-4" />
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-4">
					<h3 className="font-semibold text-2xl">Pick a Theme</h3>
					<div className="flex gap-5">
						<form
							action={async () => {
								"use server";

								await setThemeAction("blue");
							}}
							className="blue dark"
						>
							<Button>Blue</Button>
						</form>
						<form
							action={async () => {
								"use server";

								await setThemeAction("purple");
							}}
							className="purple dark"
						>
							{" "}
							<Button>Purple</Button>
						</form>
						<form
							action={async () => {
								"use server";

								await setThemeAction("green");
							}}
							className="green dark"
						>
							<Button>Green</Button>
						</form>
						<form
							action={async () => {
								"use server";

								await setThemeAction("orange");
							}}
							className="orange dark"
						>
							<Button>Orange</Button>
						</form>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="font-semibold text-2xl">Select a Timezone</h3>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="w-[400px]" variant="outline">
								{timezone}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="h-80 overflow-y-scroll">
							<DropdownMenuGroup className="mx-auto text-center">
								{timezones.map((t) => (
									<DropdownMenuItem
										className="flex justify-center"
										key={t.name}
									>
										<button
											onClick={async () => {
												"use server";

												await setTimezoneAction(t.name, t.offset);
											}}
											type="submit"
										>
											{t.name}
										</button>
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
