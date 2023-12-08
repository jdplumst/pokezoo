import { type ReactNode, useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { ThemeContext } from "./ThemeContextProvider";

interface ITimeProps {
  children: ReactNode;
}

export default function Time({ children }: ITimeProps) {
  const { time, handleTheme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      handleTheme("day");
    } else {
      handleTheme("night");
    }
    setLoading(false);
  }, [handleTheme]);

  if (loading) return <Loading />;

  return (
    <div
      className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
      {children}
    </div>
  );
}
