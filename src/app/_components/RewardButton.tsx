"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import { type ZodTime } from "@/src/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import Wildcard from "./Wildcard";

export default function RewardButton(props: {
  time: z.infer<typeof ZodTime>;
  profile: { claimedDaily: boolean; claimedNightly: boolean };
}) {
  const router = useRouter();

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const [rewards, setRewards] = useState<
    | {
        Reward: number | undefined;
        Cards:
          | {
              Common: number;
              Rare: number;
              Epic: number;
              Legendary: number;
            }
          | undefined;
      }
    | undefined
  >();

  const claim = useMutation({
    mutationFn: async (time: z.infer<typeof ZodTime>) => {
      const res = await fetch("/api/reward", {
        method: "POST",
        body: JSON.stringify({ time: time }),
      });

      const resSchema = z.union([
        z.object({
          reward: z.number(),
          cards: z.object({
            Common: z.number(),
            Rare: z.number(),
            Epic: z.number(),
            Legendary: z.number(),
          }),
          error: z.undefined(),
        }),
        z.object({
          reward: z.undefined(),
          cards: z.undefined(),
          error: z.string(),
        }),
      ]);

      const check = resSchema.parse(await res.json());
      return check;
    },

    onSuccess(data) {
      if (data.error) {
        console.error(data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        console.log("success!");
        setRewards({ Reward: data.reward, Cards: data.cards });
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
      {" "}
      {(props.time === "day" && props.profile.claimedDaily) ||
      (props.time === "night" && props.profile.claimedNightly) ? (
        <div>You have already claimed your reward.</div>
      ) : props.time === "day" ? (
        <Button
          onClick={() => claim.mutate(props.time)}
          disabled={claim.isLoading}
          className="w-40 bg-yellow-400 text-black hover:bg-yellow-500"
        >
          Claim Daily Reward
        </Button>
      ) : (
        <Button
          onClick={() => claim.mutate(props.time)}
          disabled={claim.isLoading}
          className="w-40 bg-purple-600 hover:bg-purple-700"
        >
          Claim Nightly Reward
        </Button>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>
              You have claimed your {props.time === "day" ? "daily" : "nightly"}{" "}
              reward!
            </DialogTitle>
            <DialogDescription hidden={true}>
              Here are the rewards you have claimed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-32 flex-col gap-2 overflow-y-scroll">
            <div className="font-semibold">
              You received P{rewards?.Reward?.toLocaleString()}!
            </div>
            {rewards?.Cards?.Common ? (
              <div className="flex gap-1">
                <div>
                  You received {rewards.Cards.Common} Common wildcard
                  {rewards.Cards.Common > 1 && "s"}
                </div>
                <Wildcard wildcard="Common" width={20} height={20} />
              </div>
            ) : (
              <></>
            )}
            {rewards?.Cards?.Rare ? (
              <div className="flex gap-1">
                <div>
                  You received {rewards.Cards.Rare} Rare wildcard
                  {rewards.Cards.Rare > 1 && "s"}
                </div>
                <Wildcard wildcard="Rare" width={20} height={20} />
              </div>
            ) : (
              <></>
            )}
            {rewards?.Cards?.Epic ? (
              <div className="flex gap-1">
                <div>
                  You received {rewards.Cards.Epic} Epic wildcard
                  {rewards.Cards.Epic > 1 && "s"}
                </div>
                <Wildcard wildcard="Epic" width={20} height={20} />
              </div>
            ) : (
              <></>
            )}
            {rewards?.Cards?.Legendary ? (
              <div className="flex gap-1">
                <div>
                  You received {rewards.Cards.Legendary} Legendary wildcard
                  {rewards.Cards.Legendary > 1 && "s"}
                </div>
                <Wildcard wildcard="Legendary" width={20} height={20} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
