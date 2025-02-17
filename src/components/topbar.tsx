import { Button } from "~/components/ui/button";
import { setTheme, toggleTime } from "~/server/actions/cookies";
import { getTopbar } from "~/server/actions/topbar";
import TopbarContent from "~/components/topbar-content";

export default async function Topbar() {
  const profile = await getTopbar();

  return (
    <div
      className={`relative ${
        profile.admin ? `h-56` : `h-32`
      } w-full py-4 shadow-lg`}
    >
      {profile.admin && (
        <div className="flex flex-col items-center gap-5">
          <form
            action={async () => {
              "use server";

              await toggleTime();
            }}
          >
            <Button>Toggle Time</Button>
          </form>
          <div className="flex gap-5">
            <form
              action={async () => {
                "use server";

                await setTheme("blue");
              }}
              className="blue dark"
            >
              <Button>Blue</Button>
            </form>
            <form
              action={async () => {
                "use server";

                await setTheme("purple");
              }}
              className="purple dark"
            >
              <Button>Purple</Button>
            </form>
            <form
              action={async () => {
                "use server";

                await setTheme("green");
              }}
              className="green dark"
            >
              <Button>Green</Button>
            </form>
            <form
              action={async () => {
                "use server";

                await setTheme("orange");
              }}
              className="orange dark"
            >
              <Button>Orange</Button>
            </form>
          </div>
        </div>
      )}
      <TopbarContent profile={profile} />
    </div>
  );
}
