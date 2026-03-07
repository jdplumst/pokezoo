"use client";

import { signOut } from "next-auth/react";

export default function SignOut(props: { children: React.ReactNode }) {
	return (
		<button
			className="w-full"
			onClick={() => signOut({ callbackUrl: "/" })}
			type="button"
		>
			{props.children}
		</button>
	);
}
