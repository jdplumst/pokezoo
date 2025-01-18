import "../styles/globals.css";
import { getTheme } from "../server/actions/cookies/getTheme";
import { getTime } from "../server/actions/cookies/getTime";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const time = await getTime();
  const mode = time === "day" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${theme} ${mode}`}
    >
      <body>{children}</body>
    </html>
  );
}
