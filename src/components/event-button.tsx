"use client";

import { useActionState, useEffect, useState } from "react";
import LoadingSpinner from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import { type Rarity, type Event } from "~/lib/types";
import { claimEventAction } from "~/server/actions/game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import MiniPokemonCard from "~/components/mini-pokemon-card";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function EventButton(props: { event: Event }) {
  const utils = api.useUtils();

  const router = useRouter();

  const [data, action, isPending] = useActionState(claimEventAction, undefined);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data?.success) {
      setOpen(true);
      void utils.game.getPokemon.invalidate();
    }
  }, [data, utils]);

  useEffect(() => {
    if (!open) {
      router.refresh();
    }
  }, [open, router]);

  return (
    <>
      <form action={action}>
        <Button
          disabled={isPending}
          className="bg-green-500 hover:bg-green-600"
        >
          {isPending ? (
            <LoadingSpinner />
          ) : props.event === "Christmas" ? (
            "Claim Christmas Present"
          ) : props.event === "New Year's" ? (
            "Claim New Year's Present"
          ) : (
            "Claim PokéZoo Day Present"
          )}
        </Button>
      </form>
      {data?.success === true && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-96">
            <DialogHeader>
              <DialogTitle>You have obtained a gift!</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Here is the Pokémon you have obtained.
            </DialogDescription>
            <div className="flex h-80 flex-col gap-4 overflow-y-scroll">
              <MiniPokemonCard
                name={data.gift.name}
                img={data.gift.img}
                shiny={data.gift.shiny}
                rarity={data.gift.rarity as Rarity}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
