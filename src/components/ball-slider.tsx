"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { Slider } from "~/components/ui/slider";
import { type Region, RegionValues } from "~/lib/types";
import { purchaseBallsAction } from "~/server/actions/shop";
import { api } from "~/trpc/react";
import { ScrollArea } from "./ui/scroll-area";

export default function BallSlider(props: {
	ballId: string;
	ballName: string;
}) {
	const utils = api.useUtils();

	const [sliderValue, setSliderValue] = useState([1]);

	const [premierRegion, setPremierRegion] = useState<Region>("Kanto");

	const [isOpen, setIsOpen] = useState(false);

	const [data, action, isPending] = useActionState(
		purchaseBallsAction,
		undefined,
	);

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			setIsOpen(true);
			void utils.game.getPokemon.invalidate();
		}
	}, [data, utils.game.getPokemon]);

	return (
		<>
			<div>Quantity: {sliderValue[0]}</div>
			<Slider
				defaultValue={[1]}
				max={10}
				min={1}
				onValueChange={(e) => setSliderValue(e)}
				step={1}
				value={sliderValue}
			/>
			{props.ballName === "Premier" ? (
				<Drawer>
					<DrawerTrigger asChild>
						<Button>Buy</Button>
					</DrawerTrigger>
					<DrawerContent className="flex flex-col items-center">
						<DrawerHeader className="flex flex-col items-center">
							<DrawerTitle>Premier Ball</DrawerTitle>
							<DrawerDescription>Please select a region.</DrawerDescription>
						</DrawerHeader>
						<Carousel
							className="w-full max-w-sm"
							opts={{
								align: "start",
							}}
						>
							<CarouselContent>
								{RegionValues.map((r) => (
									<CarouselItem className="md:basis-1/2 lg:basis-1/3" key={r}>
										<div className={`p-1`}>
											<Card
												className={`${premierRegion === r && `bg-secondary`}`}
											>
												<CardContent className="flex aspect-square items-center justify-center p-6">
													{/** biome-ignore lint/a11y/useButtonType: address later */}
													<button
														className="font-semibold text-3xl"
														onClick={() => {
															setPremierRegion(r);
														}}
													>
														{r}
													</button>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
						<DrawerFooter className="flex flex-col items-center">
							<form action={action}>
								<input name="ballId" type="hidden" value={props.ballId} />
								<input
									className="hidden"
									name="quantity"
									readOnly
									type="number"
									value={sliderValue[0]}
								/>
								<input name="regionName" type="hidden" value={premierRegion} />
								<Button disabled={isPending} type="submit">
									{isPending ? <LoadingSpinner /> : "Submit"}
								</Button>
							</form>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			) : (
				<form action={action}>
					<input name="ballId" readOnly type="hidden" value={props.ballId} />
					<input
						className="hidden"
						name="quantity"
						readOnly
						type="number"
						value={sliderValue[0]}
					/>
					<Button disabled={isPending} type="submit">
						{isPending ? <LoadingSpinner /> : "Buy"}
					</Button>
				</form>
			)}
			{data?.success === true && (
				<Dialog onOpenChange={setIsOpen} open={isOpen}>
					<DialogContent className="w-96">
						<DialogHeader>
							<DialogTitle>You have obtained new Pokémon!</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Here is all the Pokémon you have obtained.
						</DialogDescription>
						<ScrollArea className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto">
							<div className="flex flex-col gap-4">
								{data.purchasedSpecies.map((s, idx) => (
									<MiniPokemonCard
										img={s.img}
										// biome-ignore lint/suspicious/noArrayIndexKey: address later
										key={idx}
										name={s.name}
										rarity={s.rarity}
										shiny={s.shiny}
									/>
								))}
							</div>
						</ScrollArea>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
