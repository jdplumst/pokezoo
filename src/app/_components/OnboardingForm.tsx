"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export default function OnboardingForm(props: {
  starters: { id: string; name: string; img: string }[];
}) {
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const router = useRouter();

  const onboarding = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          starterId: selectedPokemon,
        }),
      });

      const resSchema = z.union([
        z.object({ message: z.undefined(), error: z.string() }),
        z.object({ message: z.string(), error: z.undefined() }),
      ]);

      const data = resSchema.parse(await res.json());
      return data;
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        router.push("/game");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-8 text-white">
      <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Welcome to PokéZoo!
        </h1>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block text-sm font-medium">
              Choose your trainer name:
            </div>
            <Input
              type="text"
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <p className="mb-2 block text-sm font-medium">
              Select your starter Pokémon:
            </p>
            <div className="grid grid-cols-3 gap-4">
              {props.starters.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPokemon(p.id)}
                  className={`rounded-lg p-2 transition-all ${
                    selectedPokemon === p.id
                      ? "bg-violet-600 ring-2 ring-violet-400"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                  <p className="mt-2 text-center capitalize">{p.name}</p>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onboarding.mutate()}
            disabled={onboarding.isLoading}
            className="w-full rounded-full bg-violet-500 px-4 py-2 font-bold text-white transition-colors hover:bg-violet-600"
          >
            Begin Journey
          </button>
        </div>
      </div>
    </div>
  );
}
