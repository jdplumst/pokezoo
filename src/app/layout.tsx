import "@/styles/globals.css";
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
    <html lang="en" className={`${theme} ${mode}`}>
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
