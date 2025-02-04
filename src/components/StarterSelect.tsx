"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { selectStarter } from "@/server/actions/starters";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StarterSelect(props: {
  regionId: number;
  regionName: string;
}) {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const [starterId, setStarterId] = useState<string>("");

  const [data, action, isPending] = useActionState(selectStarter, undefined);

  const starters = useQuery({
    queryKey: ["starters"],
    queryFn: async () => {
      const res = await fetch(`/api/starter?regionId=${props.regionId}`);
      const resSchema = z.object({
        starters: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            img: z.string(),
          }),
        ),
      });
      const data = resSchema.parse(await res.json());
      return data;
    },
  });

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
      void queryClient.invalidateQueries(["pokemon"]);
      router.refresh();
    }
  }, [data, toast, router, queryClient]);

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
