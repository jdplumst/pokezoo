"use client";

import { signIn } from "next-auth/react";
import Github from "./Github";
import Twitch from "./Twitch";
import Google from "./Google";

export default function SignIn(props: {
  provider: "github" | "twitch" | "google";
}) {
  return (
    <button
      className={`mt-5 h-10 w-2/3 rounded-lg border-2 border-black capitalize ${props.provider === "github" && `bg-green-500`} ${props.provider === "twitch" && `bg-purple-500`} ${props.provider === "google" && `bg-orange-500`}`}
      onClick={() => signIn(props.provider)}
    >
      <span className="flex items-center justify-center gap-2">
        Sign in with {props.provider}
        {props.provider === "github" && (
          <Github
            width={20}
            height={20}
            fill="black"
          />
        )}
        {props.provider === "twitch" && (
          <Twitch
            width={20}
            height={20}
          />
        )}
        {props.provider === "google" && (
          <Google
            width={20}
            height={20}
          />
        )}
      </span>
    </button>
  );
}
