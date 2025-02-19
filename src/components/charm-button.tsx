"use client";

import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import LoadingSpinner from "./loading-spinner";
import { useActionState, useEffect } from "react";
import { purchaseCharmAction } from "~/server/actions/shop";
import { useRouter } from "next/navigation";

export default function CharmButton(props: { charmId: number }) {
  const { toast } = useToast();

  const router = useRouter();

  const [data, action, isPending] = useActionState(
    purchaseCharmAction,
    undefined,
  );

  useEffect(() => {
    if (data?.success === false) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    } else if (data?.success === true) {
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
