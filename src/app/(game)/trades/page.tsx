import { Separator } from "@/src/components/ui/separator";
import {
  acceptTrade,
  cancelTrade,
  declineTrade,
  getTrades,
  withdrawTrade,
} from "@/src/server/actions/trades";
import { Metadata } from "next";
import SubmitButton from "../../_components/SubmitButton";
import { auth } from "@/src/server/auth";
import { redirect } from "next/navigation";
import TradeButton from "../../_components/TradeButton";
import MiniPokemonCard from "../../_components/MiniPokemonCard";
import { z } from "zod";
import { ZodRarity } from "@/src/zod";

export const metadata: Metadata = {
  title: "PokéZoo - Trades",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Trades() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const trades = await getTrades();

  return (
    <div className="px-8 py-8">
      <h1 className="py-4 text-5xl font-bold">Trades</h1>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-4">
        <TradeButton type="initiate" />
        <div className="grid grid-cols-1 gap-y-4">
          {trades.map((t) => (
            <div
              key={t.id}
              className="flex h-96 w-full justify-between border-2 border-solid py-2"
            >
              <div className="flex w-1/2 flex-col items-center gap-4">
                <div className="h-1/6 px-2 text-center font-semibold">
                  {t.initatorName} wants to trade!
                </div>
                <div className="h-3/6 w-5/6">
                  <MiniPokemonCard
                    name={t.initiatorPokemonName}
                    img={t.initiatorPokemonImg}
                    shiny={t.initiatorPokemonShiny}
                    rarity={
                      t.initiatorPokemonRarity as z.infer<typeof ZodRarity>
                    }
                  />
                </div>
                <div className="flex h-1/6 w-full items-center justify-center overflow-x-scroll overflow-y-scroll text-center">
                  {t.description}
                </div>
                {t.initiatorId === session.user.id ? (
                  <form
                    className="h-1/6"
                    action={async () => {
                      "use server";

                      await cancelTrade(t.id);
                    }}
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
                      name={t.offererPokemonName}
                      img={t.offererPokemonImg}
                      shiny={t.offererPokemonShiny}
                      rarity={
                        t.offererPokemonRarity as z.infer<typeof ZodRarity>
                      }
                    />
                  </div>
                  <div className="h-1/6"></div>
                  {t.offererId === session.user.id ? (
                    <form
                      className="h-1/6"
                      action={async () => {
                        "use server";

                        await withdrawTrade(t.id);
                      }}
                    >
                      <SubmitButton text="Withdraw" />
                    </form>
                  ) : t.initiatorId === session.user.id ? (
                    <div className="flex h-1/6 w-full justify-center gap-2">
                      <form
                        action={async () => {
                          "use server";

                          await acceptTrade(t.id);
                        }}
                      >
                        <SubmitButton text="Accept" />
                      </form>
                      <form
                        action={async () => {
                          "use server";

                          await declineTrade(t.id);
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
                  {t.initiatorId !== session.user.id && (
                    <TradeButton type="offer" tradeId={t.id} />
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
