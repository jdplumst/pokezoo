"use client";

import Image from "next/image";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { createProfileAction } from "~/server/actions/onboarding";
import { useActionState, useEffect } from "react";
import LoadingSpinner from "~/components/loading-spinner";

export default function OnboardingForm(props: {
  starters: { id: string; name: string; img: string }[];
}) {
  const { toast } = useToast();

  const [data, action, isPending] = useActionState(
    createProfileAction,
    undefined,
  );

  useEffect(() => {
    if (data?.success === false) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  }, [data, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-8 text-white">
      <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Welcome to PokéZoo!
        </h1>
        <form action={action} className="flex flex-col items-center space-y-6">
          <div className="w-full">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Choose your trainer name:
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              maxLength={30}
              className={`w-full rounded-md bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                data?.error && "border border-red-500"
              }`}
              placeholder="Enter username"
            />
          </div>
          <div className="w-full">
            <p className="mb-2 block text-sm font-medium">
              Select your starter Pokémon:
            </p>
            <div className="grid grid-cols-3 gap-4">
              {props.starters.map((p) => (
                <label
                  key={p.id}
                  htmlFor={p.id}
                  className={`rounded-lg bg-gray-700 p-2 transition-all hover:cursor-pointer hover:bg-gray-600 has-[:checked]:bg-violet-600 has-[:checked]:ring-violet-400 ${
                    data?.error && "border border-red-500"
                  }`}
                >
                  <input
                    type="radio"
                    id={p.id}
                    name="starterId"
                    value={p.id}
                    className="hidden"
                  />
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                  <p className="mt-2 text-center capitalize">{p.name}</p>
                </label>
              ))}
            </div>
          </div>
          {/* <SubmitButton text="Begin Journey" /> */}
          <button
            disabled={isPending}
            type="submit"
            className="w-full rounded-full bg-violet-500 px-4 py-2 font-bold text-white transition-colors hover:bg-violet-600"
          >
            {isPending ? <LoadingSpinner /> : "Begin Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
