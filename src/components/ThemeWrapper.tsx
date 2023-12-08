import { type ReactNode, useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { ThemeContext } from "./ThemeContextProvider";
import { ZodTheme } from "../zod";
import { type z } from "zod";

interface ITimeProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ITimeProps) {
  const { time, theme, handleTheme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      let dayTheme = localStorage.getItem("day-theme");
      if (!ZodTheme.safeParse(dayTheme).success) {
        localStorage.setItem("day-theme", "blue");
        dayTheme = "blue";
      }
      handleTheme("day", dayTheme as z.infer<typeof ZodTheme>);
    } else {
      let nightTheme = localStorage.getItem("night-theme");
      if (!ZodTheme.safeParse(nightTheme).success) {
        localStorage.setItem("night-theme", "purple");
        nightTheme = "purple";
      }
      handleTheme("night", nightTheme as z.infer<typeof ZodTheme>);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div
      className={`${time} ${theme} min-h-screen bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
      {children}
    </div>
  );
}
