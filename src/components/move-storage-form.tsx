"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import { moveToStorageAction } from "~/server/actions/game";
import { api } from "~/trpc/react";

export function MoveStorageForm(props: { instanceId: string }) {
  const utils = api.useUtils();

  const [data, action, isPending] = useActionState(
    moveToStorageAction,
    undefined,
  );

  useEffect(() => {
    if (data?.success === false) {
      toast.error(data.error);
    } else if (data?.success === true) {
      toast.message(data.message);
      void utils.game.getPokemon.invalidate();
    }
  }, [data, utils]);

  return (
    <form action={action}>
      <input type="hidden" name="instanceId" value={props.instanceId} />
      <Button>{isPending ? <LoadingSpinner /> : "Move To Storage"}</Button>
    </form>
  );
}
