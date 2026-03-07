import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/sonner";
import { getTheme, getTime } from "~/server/db/queries/cookies";
import { TRPCReactProvider } from "~/trpc/react";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = await getTheme();
	const time = await getTime();
	const mode = time === "day" ? "light" : "dark";

	return (
		<html className={`${GeistSans.className} ${theme} ${mode}`} lang="en">
			<body>
				<Toaster closeButton />
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
