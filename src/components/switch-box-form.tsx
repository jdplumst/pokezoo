"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { switchBoxAction } from "~/server/actions/storage";

export function SwitchBoxForm(props: { instanceId: string }) {
  const router = useRouter();

  const [data, action, isPending] = useActionState(switchBoxAction, undefined);

  const [box, setBox] = useState("1");

  useEffect(() => {
    if (data?.success === false) {
      toast.error(data.error);
    } else if (data?.success === true) {
      toast.message(data.message);
      router.refresh();
    }
  }, [data, router]);

  const boxes = Array.from(Array(31).keys()).filter((b) => b > 0);

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Box {box}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-80 overflow-y-scroll">
          <DropdownMenuGroup className="mx-auto text-center">
            {boxes.map((b) => (
              <DropdownMenuItem key={b} className="flex justify-center">
                <button className="w-full" onClick={() => setBox(String(b))}>
                  Box {b}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <form action={action}>
        <input type="hidden" name="instanceId" value={props.instanceId} />
        <input type="hidden" name="box" value={box} />
        <Button>{isPending ? <LoadingSpinner /> : "Switch Box"}</Button>
      </form>
    </div>
  );
}
