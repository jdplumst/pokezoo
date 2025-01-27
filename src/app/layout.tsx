import "../styles/globals.css";
import { getTheme, getTime } from "../server/actions/cookies";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getTheme();
  const time = getTime();
  const mode = time === "day" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${theme} ${mode}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
