import { type ReactNode, createContext, useState } from "react";
import { type z } from "zod";
import { ZodTheme, type ZodTime } from "../zod";

export const ThemeContext = createContext<{
  time: z.infer<typeof ZodTime>;
  theme: z.infer<typeof ZodTheme>;
  handleTheme: (
    time: z.infer<typeof ZodTime>,
    theme: z.infer<typeof ZodTheme>
  ) => void;
}>({
  time: "day",
  theme: "blue",
  handleTheme: () => {
    return;
  }
});

interface IThemeContextProviderProps {
  children: ReactNode;
}

export default function ThemeContextProvider({
  children
}: IThemeContextProviderProps) {
  const [time, setTime] = useState<z.infer<typeof ZodTime>>("day");
  const [theme, setTheme] = useState<z.infer<typeof ZodTheme>>("blue");

  const handleTheme = (
    time: z.infer<typeof ZodTime>,
    theme: z.infer<typeof ZodTheme>
  ) => {
    setTime(time);
    setTheme(theme);
  };
  return (
    <ThemeContext.Provider
      value={{ time: time, theme: theme, handleTheme: handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
