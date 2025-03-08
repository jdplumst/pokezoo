"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { selectStarterAction } from "~/server/actions/starters";
import LoadingSpinner from "~/components/loading-spinner";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function StarterSelect(props: {
  regionId: number;
  regionName: string;
}) {
  const router = useRouter();

  const utils = api.useUtils();

  const [starterId, setStarterId] = useState<string>("");

  const [data, action, isPending] = useActionState(
    selectStarterAction,
    undefined,
  );

  const starters = api.game.getStarters.useQuery({
    regionId: props.regionId,
  });

  useEffect(() => {
    if (data?.success === false) {
      toast.error(data.error);
    } else if (data?.success === true) {
      toast.message(data.message);
      void utils.game.invalidate();
      router.refresh();
    }
  }, [data, router, utils.game]);

  return (
    <Dialog open={true}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            Selecting a {props.regionName} Starter
          </DialogTitle>
          <DialogDescription className="text-center">
            Please select one of the following starter pokémon:
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          {starters.data?.starters?.map((s) => (
            <div
              key={s.id}
              onClick={() => setStarterId(s.id)}
              className={`w-1/3 border-2 border-solid border-black bg-rare-unfocus p-4 hover:cursor-pointer hover:bg-rare-focus ${s.id === starterId && "border-4 border-yellow-400"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Image src={s.img} alt={s.name} width={70} height={70} />
                <div className="font-lg text-center font-semibold capitalize">
                  {s.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="mx-auto">
          <form action={action}>
            <input type="hidden" name="starterId" value={starterId} />
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : "Confirm"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
