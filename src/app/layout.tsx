import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { getTheme, getTime } from "@/server/actions/cookies";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/app/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getTheme();
  const time = getTime();
  const mode = time === "day" ? "light" : "dark";

  return (
    <html lang="en" className={`${GeistSans.className} ${theme} ${mode}`}>
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
