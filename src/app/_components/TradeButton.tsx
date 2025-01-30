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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function TradeButton(
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
  const [instance, setInstance] = useState<string | null>(null);

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
            shiny: z.boolean(),
            rarity: z.string(),
          }),
        ),
      });

      const data = resSchema.parse(await res.json());
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/trade/initiate", {
        method: "POST",
        body: JSON.stringify({
          instanceId: instance,
          description: description,
        }),
      });

      const resSchema = z.union([
        z.object({ message: z.undefined(), error: z.string() }),
        z.object({ message: z.string(), error: z.undefined() }),
      ]);

      const data = resSchema.parse(await res.json());
      return data;
    },
    onSuccess(data) {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        setDescription("");
        setSearch("");
        setInstance(null);
        setOpen(false);
        router.refresh();
      }
    },
    onError() {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      router.refresh();
    },
  });

  const offer = useMutation({
    mutationFn: async (input: { tradeId: string }) => {
      const res = await fetch("/api/trade/offer", {
        method: "POST",
        body: JSON.stringify({
          tradeId: input.tradeId,
          instanceId: instance,
        }),
      });

      const resSchema = z.union([
        z.object({ message: z.undefined(), error: z.string() }),
        z.object({ message: z.string(), error: z.undefined() }),
      ]);

      const data = resSchema.parse(await res.json());
      return data;
    },
    onSuccess(data) {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        setDescription("");
        setSearch("");
        setInstance(null);
        setOpen(false);
        router.refresh();
      }
    },
    onError() {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      router.refresh();
    },
  });

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
                    rarity={p.rarity as z.infer<typeof ZodRarity>}
                    selected={p.id === instance}
                  />
                </button>
              ))}
            </div>
            <Button
              onClick={() =>
                props.type === "initiate"
                  ? add.mutate()
                  : offer.mutate({ tradeId: props.tradeId })
              }
            >
              {props.type === "initiate" ? "Add Trade" : "Add Offer"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
