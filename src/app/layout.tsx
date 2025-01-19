import "../styles/globals.css";
import { getTheme, getTime } from "../server/actions/cookies";

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
