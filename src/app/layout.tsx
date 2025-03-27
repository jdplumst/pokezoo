import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { getTheme, getTime } from "~/server/db/queries/cookies";
import { env } from "~/env";
import { ReactScan } from "~/components/react-scan";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const time = await getTime();
  const mode = time === "day" ? "light" : "dark";

  return (
    <html lang="en" className={`${GeistSans.className} ${theme} ${mode}`}>
      <body>
        {env.NODE_ENV === "development" && <ReactScan />}
        <Toaster />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
