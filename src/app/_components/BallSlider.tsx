"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

export default function BallSlider(props: { ballId: string }) {
  const router = useRouter();

  const { toast } = useToast();

  const [sliderValue, setSliderValue] = useState([1]);

  const [purchasedSpecies, setPurchasedSpecies] = useState<
    { name: string; img: string; shiny: boolean }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);

  const purchase = useMutation({
    mutationFn: async (input: {
      ballId: string;
      quantity: number;
      regionId?: number;
    }) => {
      const res = await fetch("/api/ball", {
        method: "POST",
        body: JSON.stringify({
          ballId: input.ballId,
          quantity: input.quantity,
          regionId: input.regionId,
        }),
      });

      const data = await res.json();

      const resSchema = z.union([
        z.object({
          speciesList: z
            .object({
              name: z.string(),
              img: z.string(),
              shiny: z.boolean(),
            })
            .array(),
          error: z.undefined(),
        }),
        z.object({ speciesList: z.undefined(), error: z.string() }),
      ]);
      const check = resSchema.parse(data);
      return check;
    },

    onSuccess(data) {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.speciesList) {
        setPurchasedSpecies(data.speciesList);
        setIsOpen(true);
        router.refresh();
      }
    },

    onError(error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div>Quantity: {sliderValue[0]}</div>
      <Slider
        defaultValue={[1]}
        max={30}
        step={1}
        value={sliderValue}
        onValueChange={(e) => setSliderValue(e)}
      />
      <Button
        onClick={() =>
          purchase.mutate({ ballId: props.ballId, quantity: sliderValue[0] })
        }
        disabled={purchase.isLoading}
      >
        {purchase.isLoading ? <LoadingSpinner /> : "Buy"}
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>You have obtained new Pokémon!</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Here is all the Pokémon you have obtained.
          </DialogDescription>
          <div className="flex h-80 flex-col gap-4 overflow-y-scroll">
            {purchasedSpecies.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2"
              >
                <Image
                  src={s.img}
                  alt={s.name}
                  width={70}
                  height={70}
                  className="pixelated"
                />{" "}
                <span className="text-xl capitalize">
                  {s.shiny && "🌟 "}
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
