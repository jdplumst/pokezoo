import type { Metadata } from "next";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import SubmitButton from "~/components/submit-button";
import TradeForm from "~/components/trade-form";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import type { Rarity } from "~/lib/types";
import {
	acceptTradeAction,
	cancelTradeAction,
	declineTradeAction,
	withdrawTradeAction,
} from "~/server/actions/trades";
import { getTrades } from "~/server/db/queries/trades";

export const metadata: Metadata = {
	title: "PokéZoo - Trades",
	icons: {
		icon: "/favicon.png",
	},
};

export default async function Trades() {
	const data = await getTrades();

	return (
		<div className="px-8">
			<h1 className="py-4 font-bold text-5xl">Trades</h1>
			<Separator className="mb-4" />
			<div className="flex flex-col gap-4">
				<TradeForm type="initiate" />
				<div className="grid grid-cols-1 gap-y-4">
					{data.trades.map((t) => (
						<div
							className="flex h-96 w-full justify-between border-2 border-solid py-2"
							key={t.id}
						>
							<div className="flex w-1/2 flex-col items-center gap-4">
								<div className="h-1/6 px-2 text-center font-semibold">
									{t.initatorName} wants to trade!
								</div>
								<div className="h-3/6 w-5/6">
									<MiniPokemonCard
										img={t.initiatorPokemonImg}
										name={t.initiatorPokemonName}
										rarity={t.initiatorPokemonRarity as Rarity}
										shiny={t.initiatorPokemonShiny}
									/>
								</div>
								<ScrollArea className="flex h-1/6 w-5/6 items-center justify-center text-center">
									{t.description}
									<ScrollBar orientation="horizontal" />
								</ScrollArea>
								{t.initiatorId === data.session.user.id ? (
									<form
										action={async () => {
											"use server";

											await cancelTradeAction(t.id);
										}}
										className="h-1/6"
									>
										<SubmitButton text="Cancel Trade" variant="destructive" />
									</form>
								) : (
									<div className="h-1/6"></div>
								)}
							</div>
							<Separator orientation="vertical" />
							{t.offererId &&
							t.offererName &&
							t.offererPokemonId &&
							t.offererPokemonImg &&
							t.offererPokemonName &&
							(t.offererPokemonShiny === true ||
								t.offererPokemonShiny === false) &&
							t.offererPokemonRarity ? (
								<div className="flex w-1/2 flex-col items-center gap-4">
									<div className="h-1/6 px-2 text-center font-semibold">
										{t.offererName} has an offer!
									</div>
									<div className="h-3/6 w-5/6">
										<MiniPokemonCard
											img={t.offererPokemonImg}
											name={t.offererPokemonName}
											rarity={t.offererPokemonRarity as Rarity}
											shiny={t.offererPokemonShiny}
										/>
									</div>
									<div className="h-1/6"></div>
									{t.offererId === data.session.user.id ? (
										<form
											action={async () => {
												"use server";

												await withdrawTradeAction(t.id);
											}}
											className="h-1/6"
										>
											<SubmitButton text="Withdraw" />
										</form>
									) : t.initiatorId === data.session.user.id ? (
										<div className="flex h-1/6 w-full justify-center gap-2">
											<form
												action={async () => {
													"use server";

													await acceptTradeAction(t.id);
												}}
											>
												<SubmitButton text="Accept" />
											</form>
											<form
												action={async () => {
													"use server";

													await declineTradeAction(t.id);
												}}
											>
												<SubmitButton text="Decline" variant="destructive" />
											</form>
										</div>
									) : (
										<div className="h-1/6"></div>
									)}
								</div>
							) : (
								<div className="flex w-1/2 flex-col items-center gap-4">
									<div className="h-1/6"></div>
									<div className="h-3/6">
										<div></div>
										<div></div>
									</div>
									<div className="h-1/6"></div>
									{t.initiatorId !== data.session.user.id && (
										<TradeForm tradeId={t.id} type="offer" />
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
