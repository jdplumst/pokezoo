"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useActionState, useEffect } from "react";
import { purchaseCharm } from "@/server/actions/shop";
import { useRouter } from "next/navigation";

export default function CharmButton(props: { charmId: number }) {
  const { toast } = useToast();

  const router = useRouter();

  const [data, action, isPending] = useActionState(purchaseCharm, undefined);

  useEffect(() => {
    if (data?.error) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    } else if (data?.message) {
      toast({
        title: "Success! 🎉",
        description: data.message,
      });
      router.refresh();
    }
  }, [data, toast, router]);

  return (
    <form action={action}>
      <input type="hidden" name="charmId" value={props.charmId} />
      <Button disabled={isPending}>
        {isPending ? <LoadingSpinner /> : "Buy"}
      </Button>
    </form>
  );
}
