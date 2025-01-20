"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export default function CharmButton(props: { charmId: number }) {
  const { toast } = useToast();

  const purchase = useMutation({
    mutationFn: async (charmId: number) => {
      const res = await fetch("/api/charm", {
        method: "POST",
        body: JSON.stringify({ charmId: charmId }),
      });
      const data = await res.json();

      const resSchema = z.union([
        z.object({ name: z.string(), error: z.undefined() }),
        z.object({ name: z.undefined(), error: z.string() }),
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
          description: `You have successfully purchased the ${data.name} Charm!`,
        });
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
    <Button
      onClick={() => {
        purchase.mutate(props.charmId);
      }}
    >
      Buy
    </Button>
  );
}
