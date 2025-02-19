"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { initiateTradeAction, offerTradeAction } from "~/server/actions/trades";
import LoadingSpinner from "~/components/loading-spinner";
import { api } from "~/trpc/react";
import { type Rarity } from "~/lib/types";

export default function TradeForm(
  props:
    | {
        type: "initiate";
      }
    | { type: "offer"; tradeId: string },
) {
  const router = useRouter();

  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [instance, setInstance] = useState<string>("");

  const pokemon = api.trades.getPokemonForTrades.useQuery({
    name: search,
  });

  const [initiateData, initiateAction, initiateIsPending] = useActionState(
    initiateTradeAction,
    undefined,
  );

  useEffect(() => {
    if (initiateData?.success === false) {
      toast({
        title: "Error",
        description: initiateData.error,
        variant: "destructive",
      });
    } else if (initiateData?.success === true) {
      toast({
        title: "Success! 🎉",
        description: initiateData.message,
      });
      setDescription("");
      setSearch("");
      setInstance("");
      setOpen(false);
      router.refresh();
    }
  }, [initiateData, toast, router]);

  const [offerData, offerAction, offerIsPending] = useActionState(
    offerTradeAction,
    undefined,
  );

  useEffect(() => {
    if (offerData) {
      if ("error" in offerData) {
        toast({
          title: "Error",
          description: offerData.error,
          variant: "destructive",
        });
      } else if (offerData.message) {
        toast({
          title: "Success! 🎉",
          description: offerData.message,
        });
        setDescription("");
        setSearch("");
        setInstance("");
        setOpen(false);
        router.refresh();
      }
    }
  }, [offerData, toast, router]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-fit">
        {props.type === "initiate" ? "Add Trade" : "Add Offer"}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Trade</SheetTitle>
            <SheetDescription hidden={true}>
              Select a pokémon to trade and add a description.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center gap-10 py-4">
            {props.type === "initiate" && (
              <div className="flex w-full flex-col">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                  placeholder="Enter a short message here."
                />
                <div>{description.length} / 100</div>
              </div>
            )}
            <Input
              placeholder="Search a pokémon to trade."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex h-[430px] w-full flex-col gap-2 overflow-y-scroll">
              {pokemon.data?.pokemon.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setInstance(p.id)}
                  className="w-full"
                >
                  <MiniPokemonCard
                    name={p.name}
                    img={p.img}
                    shiny={p.shiny}
                    rarity={p.rarity as Rarity}
                    selected={p.id === instance}
                  />
                </button>
              ))}
            </div>
            <form
              action={props.type === "initiate" ? initiateAction : offerAction}
            >
              <input type="hidden" name="description" value={description} />
              <input type="hidden" name="instanceId" value={instance} />
              {props.type === "offer" && (
                <input type="hidden" name="tradeId" value={props.tradeId} />
              )}
              <Button
                type="submit"
                disabled={initiateIsPending || offerIsPending}
              >
                {initiateIsPending || offerIsPending ? (
                  <LoadingSpinner />
                ) : props.type === "initiate" ? (
                  "Add Trade"
                ) : (
                  "Add Offer"
                )}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
