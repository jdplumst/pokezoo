"use client";

import { Button } from "~/components/ui/button";
import Wildcard from "~/components/wildcard";
import { useRouter } from "next/navigation";
import { purchaseWildcardAction } from "~/server/actions/shop";
import { useActionState, useEffect } from "react";
import { type Rarity } from "~/lib/types";
import { toast } from "sonner";

export default function WildcardButtons(props: {
  wildcard: {
    name: Rarity;
    commonCost?: number;
    rareCost?: number;
    epicCost?: number;
    legendaryCost?: number;
  };
}) {
  const router = useRouter();

  const [data, action, isPending] = useActionState(
    purchaseWildcardAction,
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
    <div className="flex gap-1">
      {props.wildcard.commonCost && (
        <form action={action}>
          <input type="hidden" name="tradedWildcard" value="Common" />
          <input
            type="hidden"
            name="purchasedWildcard"
            value={props.wildcard.name}
          />
          <Button type="submit" disabled={isPending} className="flex gap-1">
            <Wildcard wildcard="Common" width={30} height={30} />
            {props.wildcard.commonCost}
          </Button>
        </form>
      )}
      {props.wildcard.rareCost && (
        <form action={action}>
          <input type="hidden" name="tradedWildcard" value="Rare" />
          <input
            type="hidden"
            name="purchasedWildcard"
            value={props.wildcard.name}
          />
          <Button type="submit" disabled={isPending} className="flex gap-1">
            <Wildcard wildcard="Rare" width={30} height={30} />
            {props.wildcard.rareCost}
          </Button>
        </form>
      )}
      {props.wildcard.epicCost && (
        <form action={action}>
          <input type="hidden" name="tradedWildcard" value="Epic" />
          <input
            type="hidden"
            name="purchasedWildcard"
            value={props.wildcard.name}
          />
          <Button type="submit" disabled={isPending} className="flex gap-1">
            <Wildcard wildcard="Epic" width={30} height={30} />
            {props.wildcard.epicCost}
          </Button>
        </form>
      )}
      {props.wildcard.legendaryCost && (
        <form action={action}>
          <input type="hidden" name="tradedWildcard" value="Legendary" />
          <input
            type="hidden"
            name="purchasedWildcard"
            value={props.wildcard.name}
          />
          <Button type="submit" disabled={isPending} className="flex gap-1">
            <Wildcard wildcard="Legendary" width={30} height={30} />
            {props.wildcard.legendaryCost}
          </Button>
        </form>
      )}
    </div>
  );
}
