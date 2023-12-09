import { useSession } from "next-auth/react";
import ThemeWrapper from "../components/ThemeWrapper";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { ZodTheme, type ZodTime } from "../zod";
import { type z } from "zod";
import Loading from "../components/Loading";
import { ThemeContext } from "../components/ThemeContextProvider";

export default function Settings() {
  const { status } = useSession({ required: true });

  const { handleTheme } = useContext(ThemeContext);

  const [dayTheme, setDayTheme] = useState<z.infer<typeof ZodTheme>>("blue");
  const [nightTheme, setNightTheme] =
    useState<z.infer<typeof ZodTheme>>("purple");

  useEffect(() => {
    let initialDayTheme = localStorage.getItem("day-theme");
    if (!ZodTheme.safeParse(initialDayTheme).success) {
      localStorage.setItem("day-theme", "blue");
      initialDayTheme = "blue";
    }
    setDayTheme(initialDayTheme as z.infer<typeof ZodTheme>);

    let initialNightTheme = localStorage.getItem("night-theme");
    if (!ZodTheme.safeParse(initialNightTheme).success) {
      localStorage.setItem("night-theme", "purple");
      initialNightTheme = "purple";
    }
    setNightTheme(initialNightTheme as z.infer<typeof ZodTheme>);
  }, []);

  const saveTheme = (
    day: z.infer<typeof ZodTime>,
    theme: z.infer<typeof ZodTheme>
  ) => {
    if (day === "day") {
      localStorage.setItem("day-theme", theme);
    } else if (day === "night") {
      localStorage.setItem("night-theme", theme);
    }
  };

  if (status === "loading") return <Loading />;

  return (
    <ThemeWrapper>
      <Sidebar page="Settings">
        <Topbar />
        <main className="p-8">
          <div className="flex justify-around">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">Day Theme</p>
              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setDayTheme("blue");
                    handleTheme("day", "blue");
                  }}
                  className={`h-20 w-20 border-2 border-black ${
                    dayTheme === "blue" ? `bg-blue-600` : `bg-blue-500`
                  } hover:bg-blue-600 `}>
                  Blue
                </button>
                <button
                  onClick={() => {
                    setDayTheme("purple");
                    handleTheme("day", "purple");
                  }}
                  className={`h-20 w-20 border-2 border-black ${
                    dayTheme === "purple" ? `bg-purple-600` : `bg-purple-500`
                  } hover:bg-purple-600`}>
                  Purple
                </button>
                <button
                  onClick={() => {
                    setDayTheme("green");
                    handleTheme("day", "green");
                  }}
                  className={`h-20 w-20 border-2 border-black ${
                    dayTheme === "green" ? `bg-green-600` : `bg-green-500`
                  } hover:bg-green-600`}>
                  Green
                </button>
                <button
                  onClick={() => {
                    setDayTheme("orange");
                    handleTheme("day", "orange");
                  }}
                  className={`h-20 w-20 border-2 border-black ${
                    dayTheme === "orange" ? `bg-orange-600` : `bg-orange-500`
                  } hover:bg-orange-600`}>
                  Orange
                </button>
              </div>
              <button
                onClick={() => saveTheme("day", dayTheme)}
                className="w-full rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold outline-none hover:bg-red-btn-focus">
                Save
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">Night Theme</p>
              <div className="flex gap-5">
                <button
                  onClick={() => setNightTheme("blue")}
                  className={`h-20 w-20 border-2 border-black ${
                    nightTheme === "blue" ? `bg-blue-600` : `bg-blue-500`
                  } hover:bg-blue-600 `}>
                  Blue
                </button>
                <button
                  onClick={() => setNightTheme("purple")}
                  className={`h-20 w-20 border-2 border-black ${
                    nightTheme === "purple" ? `bg-purple-600` : `bg-purple-500`
                  } hover:bg-purple-600`}>
                  Purple
                </button>
                <button
                  onClick={() => setNightTheme("green")}
                  className={`h-20 w-20 border-2 border-black ${
                    nightTheme === "green" ? `bg-green-600` : `bg-green-500`
                  } hover:bg-green-600`}>
                  Green
                </button>
                <button
                  onClick={() => setNightTheme("orange")}
                  className={`h-20 w-20 border-2 border-black ${
                    nightTheme === "orange" ? `bg-orange-600` : `bg-orange-500`
                  } hover:bg-orange-600`}>
                  Orange
                </button>
              </div>
              <button
                onClick={() => saveTheme("night", nightTheme)}
                className="w-full rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold outline-none hover:bg-red-btn-focus">
                Save
              </button>
            </div>
          </div>
        </main>
      </Sidebar>
    </ThemeWrapper>
  );
}
