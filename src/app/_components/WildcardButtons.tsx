"use client";

import { Button } from "@/components/ui/button";
import { ZodRarity } from "@/src/zod";
import { z } from "zod";
import Wildcard from "./Wildcard";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function WildcardButtons(props: {
  wildcard: {
    name: z.infer<typeof ZodRarity>;
    commonCost?: number;
    rareCost?: number;
    epicCost?: number;
    legendaryCost?: number;
  };
}) {
  const router = useRouter();

  const { toast } = useToast();

  const purchase = useMutation({
    mutationFn: async (input: {
      tradedWildcard: z.infer<typeof ZodRarity>;
      purchasedWildcard: z.infer<typeof ZodRarity>;
    }) => {
      const res = await fetch("/api/wildcard", {
        method: "POST",
        body: JSON.stringify({
          tradedWildcard: input.tradedWildcard,
          purchasedWildcard: input.purchasedWildcard,
        }),
      });

      const data = await res.json();

      const resSchema = z.union([
        z.object({ message: z.string(), error: z.undefined() }),
        z.object({ message: z.undefined(), error: z.string() }),
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
      } else {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        router.refresh();
      }
    },

    onError() {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex gap-1">
      {props.wildcard.commonCost && (
        <Button
          onClick={() => {
            purchase.mutate({
              tradedWildcard: "Common",
              purchasedWildcard: props.wildcard.name,
            });
          }}
          disabled={purchase.isLoading}
          className="flex gap-1"
        >
          <Wildcard
            wildcard="Common"
            width={30}
            height={30}
          />
          {props.wildcard.commonCost}
        </Button>
      )}
      {props.wildcard.rareCost && (
        <Button
          onClick={() => {
            purchase.mutate({
              tradedWildcard: "Rare",
              purchasedWildcard: props.wildcard.name,
            });
          }}
          disabled={purchase.isLoading}
          className="flex gap-1"
        >
          <Wildcard
            wildcard="Rare"
            width={30}
            height={30}
          />
          {props.wildcard.rareCost}
        </Button>
      )}
      {props.wildcard.epicCost && (
        <Button
          onClick={() => {
            purchase.mutate({
              tradedWildcard: "Epic",
              purchasedWildcard: props.wildcard.name,
            });
          }}
          disabled={purchase.isLoading}
          className="flex gap-1"
        >
          <Wildcard
            wildcard="Epic"
            width={30}
            height={30}
          />
          {props.wildcard.epicCost}
        </Button>
      )}
      {props.wildcard.legendaryCost && (
        <Button
          onClick={() => {
            purchase.mutate({
              tradedWildcard: "Legendary",
              purchasedWildcard: props.wildcard.name,
            });
          }}
          disabled={purchase.isLoading}
          className="flex gap-1"
        >
          <Wildcard
            wildcard="Legendary"
            width={30}
            height={30}
          />
          {props.wildcard.legendaryCost}
        </Button>
      )}
    </div>
  );
}
