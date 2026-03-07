"use client";

import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { Fragment, useActionState, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import {
	HabitatList,
	RaritiesList,
	RegionsList,
	TypesList,
} from "~/lib/constants";
import { sellPokemonAction } from "~/server/actions/game";
import { api } from "~/trpc/react";
import PokemonCard from "./pokemon-card";

export default function GameGrid() {
	const { open } = useSidebar();

	const router = useRouter();

	const sortValues = [
		"Newest",
		"Oldest",
		"Pokedex",
		"Pokedex Desc.",
		"Rarity",
		"Rarity Desc.",
	] as const;

	const [sortedBy, setSortedBy] =
		useState<(typeof sortValues)[number]>("Newest");

	const [shiny, setShiny] = useState<"Regular" | "Shiny">("Regular");
	const [regions, setRegions] = useState(RegionsList);
	const [rarities, setRarities] = useState(RaritiesList);
	const [types, setTypes] = useState(TypesList);
	const [habitats, setHabitats] = useState(HabitatList);

	const [sellIds, setSellIds] = useState<string[]>([]);

	const pokemon = api.game.getPokemon.useInfiniteQuery(
		{
			limit: 50,
			order: sortedBy,
			shiny: shiny === "Shiny",
			regions: regions,
			rarities: rarities,
			types: types,
			habitats: habitats,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	const { ref, inView } = useInView();

	// biome-ignore lint/correctness/useExhaustiveDependencies: address later
	useEffect(() => {
		if (inView && pokemon.hasNextPage) {
			void pokemon.fetchNextPage();
		}
	}, [pokemon.fetchNextPage, inView]);

	const [data, action, isPending] = useActionState(
		sellPokemonAction,
		undefined,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: address later
	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			toast.message(data.message);
			setSellIds([]);
			void pokemon.refetch();
			router.refresh();
		}
	}, [data, router]);

	return (
		<>
			{sellIds.length > 0 && (
				<div className="sticky top-0 z-10 flex items-center justify-between border-2 border-black border-solid bg-secondary p-4">
					<span className="font-bold">
						You have selected {sellIds.length} Pokémon to sell.
					</span>

					<form action={action}>
						<input name="ids" type="hidden" value={sellIds} />
						<Button
							className="rounded-lg border-2 border-black p-2 font-bold"
							disabled={isPending}
							type="submit"
						>
							{isPending ? <LoadingSpinner /> : "Confirm Sell"}
						</Button>
					</form>
				</div>
			)}
			<div className="flex flex-col gap-5">
				<div className="flex justify-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">{sortedBy}</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuRadioGroup
								// @ts-expect-error expects string but is specific string
								onValueChange={setSortedBy}
								value={sortedBy}
							>
								{sortValues.map((s) => (
									<DropdownMenuRadioItem key={s} value={s}>
										{s}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">{shiny}</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuRadioGroup
								// @ts-expect-error expects string but is specific string
								onValueChange={setShiny}
								value={shiny}
							>
								<DropdownMenuRadioItem key={"Regular"} value={"Regular"}>
									{"Regular"}
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem key={"Shiny"} value={"Shiny"}>
									{"Shiny"}
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex justify-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Regions</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="h-72 w-56 overflow-y-scroll">
							<DropdownMenuCheckboxItem
								checked={regions === RegionsList}
								onCheckedChange={() => {
									setRegions((prev) =>
										prev === RegionsList ? [] : RegionsList,
									);
								}}
							>
								Select All
							</DropdownMenuCheckboxItem>
							<DropdownMenuSeparator />
							{RegionsList.map((r) => (
								<DropdownMenuCheckboxItem
									checked={regions.some((region) => region === r)}
									key={r}
									onCheckedChange={() => {
										const i = regions.indexOf(r);
										if (i === -1) {
											setRegions([...regions, r]);
										} else {
											setRegions(regions.filter((region) => region !== r));
										}
									}}
								>
									{r}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Rarities</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="h-72 overflow-y-scroll">
							<DropdownMenuCheckboxItem
								checked={rarities === RaritiesList}
								onCheckedChange={() => {
									setRarities((prev) =>
										prev === RaritiesList ? [] : RaritiesList,
									);
								}}
							>
								Select All
							</DropdownMenuCheckboxItem>
							<DropdownMenuSeparator />
							{RaritiesList.map((r) => (
								<DropdownMenuCheckboxItem
									checked={rarities.some((rarity) => rarity === r)}
									key={r}
									onCheckedChange={() => {
										const i = rarities.indexOf(r);
										if (i === -1) {
											setRarities([...rarities, r]);
										} else {
											setRarities(rarities.filter((rarity) => rarity !== r));
										}
									}}
								>
									{r}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Types</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="h-72 overflow-y-scroll">
							<DropdownMenuCheckboxItem
								checked={types === TypesList}
								onCheckedChange={() => {
									setTypes((prev) => (prev === TypesList ? [] : TypesList));
								}}
							>
								Select All
							</DropdownMenuCheckboxItem>
							<DropdownMenuSeparator />
							{TypesList.map((t) => (
								<DropdownMenuCheckboxItem
									checked={types.some((type) => type === t)}
									key={t}
									onCheckedChange={() => {
										const i = types.indexOf(t);
										if (i === -1) {
											setTypes([...types, t]);
										} else {
											setTypes(types.filter((type) => type !== t));
										}
									}}
								>
									{t}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Habitats</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="h-72 overflow-y-scroll">
							<DropdownMenuCheckboxItem
								checked={habitats === HabitatList}
								onCheckedChange={() => {
									setHabitats((prev) =>
										prev === HabitatList ? [] : HabitatList,
									);
								}}
							>
								Select All
							</DropdownMenuCheckboxItem>
							<DropdownMenuSeparator />
							{HabitatList.map((h) => (
								<DropdownMenuCheckboxItem
									checked={habitats.some((habitat) => habitat === h)}
									key={h}
									onCheckedChange={() => {
										const i = habitats.indexOf(h);
										if (i === -1) {
											setHabitats([...habitats, h]);
										} else {
											setHabitats(habitats.filter((habitat) => habitat !== h));
										}
									}}
								>
									{h}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-10">
				{pokemon.isLoading && <LoadingSpinner />}
				<div
					className={`grid ${open ? `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` : `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`} gap-10`}
				>
					{pokemon.data?.pages.map((p, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: address later
						<Fragment key={idx}>
							{p.instancesData.map((i) => (
								<PokemonCard key={i.instance.id} pokemon={i}>
									{sellIds.some((s) => s === i.instance.id) ? (
										<Button
											onClick={(e) => {
												e.stopPropagation();
												setSellIds(sellIds.filter((s) => s !== i.instance.id));
											}}
										>
											Unsell
										</Button>
									) : (
										<Button
											onClick={(e) => {
												e.stopPropagation();
												setSellIds([...sellIds, i.instance.id]);
											}}
											variant="destructive"
										>
											Sell
										</Button>
									)}
								</PokemonCard>
							))}
						</Fragment>
					))}
				</div>
				<div ref={ref}>
					{pokemon.hasNextPage && pokemon.isFetchingNextPage && (
						<LoadingSpinner />
					)}
				</div>
			</div>
		</>
	);
}
