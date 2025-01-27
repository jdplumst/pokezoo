import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { isAuthed } from "@/src/server/actions/auth";
import {
  getTimezone,
  setTheme,
  setTimezone,
} from "@/src/server/actions/cookies";
import { timezones } from "@/src/utils/timezones";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@radix-ui/react-dropdown-menu";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "PokéZoo - Settings",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Settings() {
  await isAuthed();

  const timezone = getTimezone();

  return (
    <div className="px-8">
      <h1 className="py-4 text-5xl font-bold">Settings</h1>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Pick a Theme</h3>
          <div className="flex gap-5">
            <form
              className="blue dark"
              // eslint-disable-next-line @typescript-eslint/require-await
              action={async () => {
                "use server";

                setTheme("blue");
              }}
            >
              <Button>Blue</Button>
            </form>
            <form
              className="purple dark"
              // eslint-disable-next-line @typescript-eslint/require-await
              action={async () => {
                "use server";

                setTheme("purple");
              }}
            >
              {" "}
              <Button>Purple</Button>
            </form>
            <form
              className="green dark"
              // eslint-disable-next-line @typescript-eslint/require-await
              action={async () => {
                "use server";

                setTheme("green");
              }}
            >
              <Button>Green</Button>
            </form>
            <form
              className="orange dark"
              // eslint-disable-next-line @typescript-eslint/require-await
              action={async () => {
                "use server";

                setTheme("orange");
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
              <Button variant="outline" className="w-[400px]">
                {timezone}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-80 overflow-y-scroll">
              <DropdownMenuGroup>
                {timezones.map((t) => (
                  <form
                    key={t.name}
                    // eslint-disable-next-line @typescript-eslint/require-await
                    action={async () => {
                      "use server";

                      setTimezone(t.name, t.offset);
                    }}
                  >
                    <Button variant="secondary" className="w-full rounded-none">
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
