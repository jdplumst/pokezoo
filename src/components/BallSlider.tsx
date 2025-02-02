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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
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
import { ZodRarity, type ZodRegion } from "@/utils/zod";
import MiniPokemonCard from "@/components/MiniPokemonCard";

export default function BallSlider(props: {
  ballId: string;
  ballName: string;
}) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const [sliderValue, setSliderValue] = useState([1]);

  const [premierRegion, setPremierRegion] =
    useState<z.infer<typeof ZodRegion>>("Kanto");

  const [purchasedSpecies, setPurchasedSpecies] = useState<
    {
      name: string;
      img: string;
      shiny: boolean;
      rarity: z.infer<typeof ZodRarity>;
    }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);

  const purchase = useMutation({
    mutationFn: async (input: {
      ballId: string;
      quantity: number;
      regionName?: string;
    }) => {
      const res = await fetch("/api/ball", {
        method: "POST",
        body: JSON.stringify({
          ballId: input.ballId,
          quantity: input.quantity,
          regionName: input.regionName,
        }),
      });

      const resSchema = z.union([
        z.object({
          speciesList: z
            .object({
              name: z.string(),
              img: z.string(),
              shiny: z.boolean(),
              rarity: ZodRarity,
            })
            .array(),
          error: z.undefined(),
        }),
        z.object({ speciesList: z.undefined(), error: z.string() }),
      ]);
      const check = resSchema.parse(await res.json());
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
        void queryClient.invalidateQueries({ queryKey: ["pokemon"] });
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
              <Button
                onClick={() => {
                  purchase.mutate({
                    ballId: props.ballId,
                    quantity: sliderValue[0],
                    regionName: premierRegion,
                  });
                }}
                disabled={purchase.isLoading}
              >
                Submit
              </Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Button
          onClick={() =>
            purchase.mutate({ ballId: props.ballId, quantity: sliderValue[0] })
          }
          disabled={purchase.isLoading}
        >
          {purchase.isLoading ? <LoadingSpinner /> : "Buy"}
        </Button>
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
            {purchasedSpecies.map((s, idx) => (
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
