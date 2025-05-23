"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Wildcard from "~/components/wildcard";
import { claimRewardAction } from "~/server/actions/game";
import { LoadingSpinner } from "~/components/loading-spinner";
import { type Time } from "~/lib/types";
import { toast } from "sonner";

export default function RewardButton(props: {
  time: Time;
  profile: { claimedDaily: boolean; claimedNightly: boolean };
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [data, action, isPending] = useActionState(
    claimRewardAction,
    undefined,
  );

  useEffect(() => {
    if (data?.success === false) {
      toast.error(data.error);
    } else if (data?.success === true) {
      setIsOpen(true);
      router.refresh();
    }
  }, [data, router]);

  return (
    <>
      {" "}
      {(props.time === "day" && props.profile.claimedDaily) ||
      (props.time === "night" && props.profile.claimedNightly) ? (
        <div>You have already claimed your reward.</div>
      ) : props.time === "day" ? (
        <form action={action}>
          <Button
            type="submit"
            disabled={isPending}
            className="w-40 bg-yellow-400 text-black hover:bg-yellow-500"
          >
            {isPending ? <LoadingSpinner /> : "Claim Daily Reward"}
          </Button>
        </form>
      ) : (
        <form action={action}>
          <Button
            type="submit"
            disabled={isPending}
            className="w-40 bg-purple-600 hover:bg-purple-700"
          >
            {isPending ? <LoadingSpinner /> : "Claim Nightly Reward"}
          </Button>
        </form>
      )}
      {data?.success === true && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-96">
            <DialogHeader>
              <DialogTitle>
                You have claimed your{" "}
                {props.time === "day" ? "daily" : "nightly"} reward!
              </DialogTitle>
              <DialogDescription hidden={true}>
                Here are the rewards you have claimed.
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-32 flex-col gap-2 overflow-y-scroll">
              <div className="font-semibold">
                You received P{data.reward.toLocaleString()}!
              </div>
              {data.cards.Common ? (
                <div className="flex gap-1">
                  <div>
                    You received {data.cards.Common} Common wildcard
                    {data.cards.Common > 1 && "s"}
                  </div>
                  <Wildcard wildcard="Common" width={20} height={20} />
                </div>
              ) : (
                <></>
              )}
              {data.cards.Rare ? (
                <div className="flex gap-1">
                  <div>
                    You received {data.cards.Rare} Rare wildcard
                    {data.cards.Rare > 1 && "s"}
                  </div>
                  <Wildcard wildcard="Rare" width={20} height={20} />
                </div>
              ) : (
                <></>
              )}
              {data.cards.Epic ? (
                <div className="flex gap-1">
                  <div>
                    You received {data.cards.Epic} Epic wildcard
                    {data.cards.Epic > 1 && "s"}
                  </div>
                  <Wildcard wildcard="Epic" width={20} height={20} />
                </div>
              ) : (
                <></>
              )}
              {data.cards.Legendary ? (
                <div className="flex gap-1">
                  <div>
                    You received {data.cards.Legendary} Legendary wildcard
                    {data.cards.Legendary > 1 && "s"}
                  </div>
                  <Wildcard wildcard="Legendary" width={20} height={20} />
                </div>
              ) : (
                <></>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
