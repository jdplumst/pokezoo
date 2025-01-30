"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function StarterSelect(props: {
  regionId: number;
  regionName: string;
}) {
  const { toast } = useToast();

  const router = useRouter();

  const [starterId, setStarterId] = useState<string | null>(null);

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

  const select = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/starter", {
        method: "POST",
        body: JSON.stringify({
          starterId: starterId,
        }),
      });

      const resSchema = z.union([
        z.object({ message: z.undefined(), error: z.string() }),
        z.object({ message: z.string(), error: z.undefined() }),
      ]);

      const data = resSchema.parse(await res.json());
      return data;
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
        setStarterId(null);
        router.refresh();
      }
    },
    onError() {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      router.refresh();
    },
  });

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
          <Button onClick={() => select.mutate()} disabled={select.isLoading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
