import { Button } from "@/components/ui/button";
import { setTheme, toggleTime } from "@/src/server/actions/cookies";
import { getProfile } from "@/src/server/actions/profile";
import Wildcard from "./Wildcard";

export default async function Topbar() {
  const profile = await getProfile();

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
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <p>Hi {profile.username ?? ""}!</p>
          <p>
            You have {profile.instanceCount.toLocaleString()} /{" "}
            {profile.catchingCharm ? "3,000 " : "2,000 "}
            Pokémon.
          </p>
          <p>Your current balance is P{profile.balance.toLocaleString()}.</p>
          <p>
            You will receive P{profile.totalYield.toLocaleString()} on the next
            payout.
          </p>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex flex-row items-end justify-end">
            <p>You have {profile.commonCards} Common wildcards.</p>
            <Wildcard
              wildcard="Common"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {profile.rareCards} Rare wildcards.</p>
            <Wildcard
              wildcard="Rare"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {profile.epicCards} Epic wildcards.</p>
            <Wildcard
              wildcard="Epic"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {profile.legendaryCards} Legendary wildcards.</p>
            <Wildcard
              wildcard="Legendary"
              height={25}
              width={25}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
