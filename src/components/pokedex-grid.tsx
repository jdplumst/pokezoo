"use client";

import { useRouter } from "next/navigation";
import { Fragment, useActionState, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import PokemonCard from "~/components/pokemon-card";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import Wildcard from "~/components/wildcard";
import {
	HabitatList,
	RaritiesList,
	RegionsList,
	TypesList,
} from "~/lib/constants";
import { purchasePokemonAction } from "~/server/actions/pokedex";
import { api } from "~/trpc/react";

export default function PokedexGrid() {
	const { open } = useSidebar();

	const router = useRouter();

	const utils = api.useUtils();

	const [caught, setCaught] = useState<
		"All Pokémon" | "Only Uncaught" | "Only Caught"
	>("All Pokémon");
	const [shiny, setShiny] = useState<"Regular" | "Shiny">("Regular");
	const [regions, setRegions] = useState(RegionsList);
	const [rarities, setRarities] = useState(RaritiesList);
	const [types, setTypes] = useState(TypesList);
	const [habitats, setHabitats] = useState(HabitatList);

	const pokemon = api.pokedex.getPokedex.useInfiniteQuery(
		{
			limit: 50,
			caught: {
				Caught: caught === "All Pokémon" || caught === "Only Caught",
				Uncaught: caught === "All Pokémon" || caught === "Only Uncaught",
			},
			shiny: shiny === "Shiny",
			regions: regions,
			rarities: rarities,
			types: types,
			habitats: habitats,
		},
		{
			getNextPageParam: (lastPage) => {
				return lastPage.nextCursor;
			},
		},
	);

	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView && pokemon.hasNextPage) {
			void pokemon.fetchNextPage();
		}
	}, [pokemon.fetchNextPage, inView, pokemon.hasNextPage]);

	const [data, action, isPending] = useActionState(
		purchasePokemonAction,
		undefined,
	);
	const [purchaseId, setPurhcaseId] = useState<string | null>(null);

	useEffect(() => {
		if (data?.success === false) {
			toast.error(data.error);
		} else if (data?.success === true) {
			toast.message(data.message);
			setPurhcaseId(null);
			router.refresh();
			void utils.pokedex.getPokedex.invalidate();
			void utils.game.getPokemon.invalidate();
		}
	}, [data, router, utils.pokedex.getPokedex, utils.game.getPokemon]);

	return (
		<>
			<div className="flex flex-col gap-5">
				<div className="flex justify-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">{caught}</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuRadioGroup
								// @ts-expect-error expects string but is specific string
								onValueChange={setCaught}
								value={caught}
							>
								<DropdownMenuRadioItem value="All Pokémon">
									All Pokémon
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="Only Caught">
									Only Caught
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="Only Uncaught">
									Only Uncaught
								</DropdownMenuRadioItem>
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
			{/*hi  */}
			<div className="flex flex-col items-center justify-center gap-10">
				{pokemon.isLoading && <LoadingSpinner />}
				<div
					className={`grid ${open ? `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` : `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`} gap-10`}
				>
					{pokemon.data?.pages.map((p, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: address later
						<Fragment key={idx}>
							{p.pokemon.map((p) => (
								<PokemonCard
									caught={!!p.instance}
									key={String(p.shiny) + p.pokedexNumber + p.name}
									pokemon={p}
								>
									{p.rarity === "Common" ||
									p.rarity === "Rare" ||
									p.rarity === "Epic" ||
									p.rarity === "Legendary" ? (
										<form action={action}>
											<input name="speciesId" type="hidden" value={p.id} />
											<Button
												className="flex gap-1 font-lg font-semibold"
												disabled={isPending && purchaseId === p.id}
												onClick={(e) => {
													e.stopPropagation();
													setPurhcaseId(p.id);
												}}
												type="submit"
												variant="destructive"
											>
												<Wildcard height={25} width={25} wildcard={p.rarity} />
												{p.shiny ? `100` : `10`}
											</Button>
										</form>
									) : (
										<Button variant="destructive">N/A</Button>
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
