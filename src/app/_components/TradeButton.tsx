"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Textarea } from "@/src/components/ui/textarea";
import { useState } from "react";
import MiniPokemonCard from "./MiniPokemonCard";
import { z } from "zod";
import { ZodRarity } from "@/src/zod";
import { useQuery } from "@tanstack/react-query";

export default function TradeButton() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const pokemon = useQuery({
    queryKey: ["distinct", search],
    queryFn: async () => {
      const res = await fetch(`/api/pokemon/distinct?name=${search}`);

      const resSchema = z.object({
        pokemon: z.array(
          z.object({
            id: z.string(),
            speciesId: z.string(),
            name: z.string(),
            img: z.string(),
            rarity: z.string(),
          }),
        ),
      });

      const data = resSchema.parse(await res.json());
      return data;
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-fit">
        Add Trade
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Trade</SheetTitle>
            <SheetDescription hidden={true}>
              Select a pokémon to trade and add a description.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-10 py-4">
            <Textarea
              maxLength={30}
              placeholder="Enter a short message here."
            />
            <Input
              placeholder="Search a pokémon to trade."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex h-[460px] flex-col gap-2 overflow-y-scroll">
              {pokemon.data?.pokemon.map((p) => (
                <MiniPokemonCard
                  key={p.id}
                  name={p.name}
                  img={p.img}
                  rarity={p.rarity as z.infer<typeof ZodRarity>}
                />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
