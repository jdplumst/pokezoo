"use client";

import { signOut } from "next-auth/react";

export default function SignOut(props: { children: React.ReactNode }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full"
    >
      {props.children}
    </button>
  );
}
