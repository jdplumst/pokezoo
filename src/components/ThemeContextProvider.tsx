import { type ReactNode, createContext, useState } from "react";
import { type z } from "zod";
import { type ZodTime } from "../zod";

export const ThemeContext = createContext<{
  time: z.infer<typeof ZodTime>;
  handleTheme: (t: z.infer<typeof ZodTime>) => void;
}>({
  time: "day",
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

  const handleTheme = (t: z.infer<typeof ZodTime>) => {
    setTime(t);
  };
  return (
    <ThemeContext.Provider value={{ time: time, handleTheme: handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
