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
import { useActionState, useEffect, useState } from "react";
import { type z } from "zod";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { RegionsList } from "@/utils/constants";
import { type ZodRegion } from "@/utils/zod";
import MiniPokemonCard from "@/components/MiniPokemonCard";
import { purchaseBalls } from "@/server/actions/shop";

export default function BallSlider(props: {
  ballId: string;
  ballName: string;
}) {
  const { toast } = useToast();

  const [sliderValue, setSliderValue] = useState([1]);

  const [premierRegion, setPremierRegion] =
    useState<z.infer<typeof ZodRegion>>("Kanto");

  const [isOpen, setIsOpen] = useState(false);

  const [data, action, isPending] = useActionState(purchaseBalls, undefined);

  useEffect(() => {
    if (data?.error) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    } else if (data?.purchasedSpecies) {
      setIsOpen(true);
    }
  }, [data, toast]);

  return (
    <>
      <div>Quantity: {sliderValue[0]}</div>
      <Slider
        defaultValue={[1]}
        min={1}
        max={10}
        step={1}
        value={sliderValue}
        onValueChange={(e) => setSliderValue(e)}
      />
      {props.ballName === "Premier" ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Buy</Button>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col items-center">
            <DrawerHeader className="flex flex-col items-center">
              <DrawerTitle>Premier Ball</DrawerTitle>
              <DrawerDescription>Please select a region.</DrawerDescription>
            </DrawerHeader>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-sm"
            >
              <CarouselContent>
                {RegionsList.map((r) => (
                  <CarouselItem key={r} className="md:basis-1/2 lg:basis-1/3">
                    <div className={`p-1`}>
                      <Card
                        className={`${premierRegion === r && `bg-secondary`}`}
                      >
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <button
                            onClick={() => {
                              setPremierRegion(r);
                            }}
                            className="text-3xl font-semibold"
                          >
                            {r}
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <DrawerFooter className="flex flex-col items-center">
              <form action={action}>
                <input type="hidden" name="ballId" value={props.ballId} />
                <input
                  type="number"
                  name="quantity"
                  value={sliderValue[0]}
                  className="hidden"
                />
                <input type="hidden" name="regionName" value={premierRegion} />
                <Button type="submit" disabled={isPending}>
                  {isPending ? <LoadingSpinner /> : "Submit"}
                </Button>
              </form>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <form action={action}>
          <input type="hidden" name="ballId" value={props.ballId} />
          <input
            type="number"
            name="quantity"
            defaultValue={sliderValue[0]}
            className="hidden"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner /> : "Buy"}
          </Button>
        </form>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>You have obtained new Pokémon!</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Here is all the Pokémon you have obtained.
          </DialogDescription>
          <div className="flex h-80 flex-col gap-4 overflow-y-scroll">
            {data?.purchasedSpecies?.map((s, idx) => (
              <MiniPokemonCard
                key={idx}
                name={s.name}
                img={s.img}
                shiny={s.shiny}
                rarity={s.rarity}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
