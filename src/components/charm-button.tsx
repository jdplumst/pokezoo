"use client";

import { Button } from "~/components/ui/button";
import { useActionState, useEffect } from "react";
import { purchaseCharmAction } from "~/server/actions/shop";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";

export default function CharmButton(props: { charmId: number }) {
  const router = useRouter();

  const [data, action, isPending] = useActionState(
    purchaseCharmAction,
    undefined,
  );

  useEffect(() => {
    if (data?.success === false) {
      toast.error(data.error);
    } else if (data?.success === true) {
      toast.message(data.message);
      router.refresh();
    }
  }, [data, router]);

  return (
    <form action={action}>
      <input type="hidden" name="charmId" value={props.charmId} />
      <Button disabled={isPending}>
        {isPending ? <LoadingSpinner /> : "Buy"}
      </Button>
    </form>
  );
}
