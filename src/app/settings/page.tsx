import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isAuthed } from "@/src/server/actions/auth";
import {
  getTimezone,
  setTheme,
  setTimezone,
  timezones,
} from "@/src/server/actions/cookies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@radix-ui/react-dropdown-menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PokéZoo - Settings",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Settings() {
  await isAuthed();

  const timezone = await getTimezone();

  return (
    <div className="px-8">
      <h1 className="py-4 text-5xl font-bold">Settings</h1>
      <hr className="border-black pb-4"></hr>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Pick a Theme</h3>
          <div className="flex gap-5">
            <form
              className="blue dark"
              action={async () => {
                "use server";

                await setTheme("blue");
              }}
            >
              <Button>Blue</Button>
            </form>
            <form
              className="purple dark"
              action={async () => {
                "use server";

                await setTheme("purple");
              }}
            >
              {" "}
              <Button>Purple</Button>
            </form>
            <form
              className="green dark"
              action={async () => {
                "use server";

                await setTheme("green");
              }}
            >
              <Button>Green</Button>
            </form>
            <form
              className="orange dark"
              action={async () => {
                "use server";

                await setTheme("orange");
              }}
            >
              <Button>Orange</Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold">Select a Timezone</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[400px]"
              >
                {timezone}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-80 overflow-y-scroll">
              <DropdownMenuGroup>
                {timezones.map((t) => (
                  <form
                    key={t.name}
                    action={async () => {
                      "use server";

                      await setTimezone(t.name, t.offset);
                    }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full rounded-none"
                    >
                      {t.name}
                    </Button>
                  </form>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
