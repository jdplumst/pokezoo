import { Separator } from "@/src/components/ui/separator";
import { getTrades } from "@/src/server/actions/trades";
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
        <TradeButton />
        <div className="grid-cols-1">
          {trades.map((t) => (
            <div className="flex h-80 w-full justify-between border-2 border-solid py-2">
              <div className="flex w-full flex-col items-center gap-4">
                <div className="h-1/5 px-2 text-center font-semibold">
                  {t.initatorName} wants to trade!
                </div>
                <div className="h-1/3 w-1/2">
                  <MiniPokemonCard
                    name={t.initiatorPokemonName}
                    img={t.initiatorPokemonImg}
                    shiny={t.initiatorPokemonShiny}
                    rarity={
                      t.initiatorPokemonRarity as z.infer<typeof ZodRarity>
                    }
                  />
                </div>
                {t.initiatorId === session.user.id && (
                  <form className="h-1/5">
                    <SubmitButton text="Cancel Trade" />
                  </form>
                )}
              </div>
              <Separator orientation="vertical" />
              {t.offererId &&
              t.offererName &&
              t.offererPokemonId &&
              t.offererPokemonImg &&
              t.offererPokemonName &&
              t.offererPokemonShiny &&
              t.offererPokemonRarity ? (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="h-1/5 px-2 text-center font-semibold">
                    {t.offererName} has an offer!
                  </div>
                  <div className="h-1/3 w-1/2">
                    <MiniPokemonCard
                      name={t.offererPokemonName}
                      img={t.offererPokemonImg}
                      shiny={t.offererPokemonShiny}
                      rarity={
                        t.offererPokemonRarity as z.infer<typeof ZodRarity>
                      }
                    />
                  </div>
                  {t.offererId === session.user.id && (
                    <form>
                      <SubmitButton text="Withdraw" />
                    </form>
                  )}
                  {t.initiatorId !== session.user.id && (
                    <div className="flex h-1/5 w-full justify-around">
                      <form>
                        <SubmitButton text="Accept" />
                      </form>
                      <form>
                        <SubmitButton text="Decline" />
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="h-1/5"></div>
                  <div className="h-3/5">
                    <div></div>
                    <div></div>
                  </div>
                  <form className="h-1/5">
                    <SubmitButton text="Add Offer" />
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
