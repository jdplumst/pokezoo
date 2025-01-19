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
import { trpc } from "@/src/utils/trpc";
import Image from "next/image";
import { useState } from "react";

export default function BallSlider(props: { ballId: string }) {
  const { toast } = useToast();

  const [sliderValue, setSliderValue] = useState([1]);

  const [purchasedSpecies, setPurchasedSpecies] = useState<
    { name: string; img: string; shiny: boolean }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);

  const purchaseBalls = trpc.ball.purchaseBalls.useMutation();

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
      <form
        action={async () => {
          purchaseBalls.mutate(
            { ballId: props.ballId, quantity: sliderValue[0] },
            {
              onSuccess(data) {
                setPurchasedSpecies(data.speciesList);
                setIsOpen(true);
              },
              onError(error) {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive",
                });
              },
            },
          );
        }}
      >
        <Button>Buy</Button>
      </form>

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>You have obtained new Pokémon!</DialogTitle>
            <DialogDescription className="h-80 overflow-y-scroll">
              {purchasedSpecies.map((s) => (
                <div className="flex items-center gap-4">
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
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
