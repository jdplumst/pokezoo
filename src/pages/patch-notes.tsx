import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import Topbar from "../components/Topbar";

export default function PatchNotes() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);
  }, []);

  if (loading || status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Patch Notes</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="PatchNotes">
          <Topbar
            username={session.user.username}
            balance={session.user.balance}
            totalYield={session.user.totalYield}
            totalCards={session.user.instanceCount}
          />
          <main className="px-8">
            {session.user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <h1 className="p-4 text-7xl font-bold">Patch Notes</h1>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">
                4.21 (September 18, 2023)
              </h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Luxury Ball.</p>
              <p className="px-4">
                Changed Add Trade button to be purple at night.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">
                4.20 (September 17, 2023)
              </h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Sorted Pokémon on the Trades page modal in Pokédex order.
              </p>
              <p className="px-4">
                Display a star next to the name of shinies on the Trades page
                modal.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">
                4.19 (September 16, 2023)
              </h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Trading! Go to the Trades page to start trading Pokémon
                with other trainers.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.18 (August 30, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed Waters-Edge and Rough-Terrain not being selectable in the
                Habitat dropdown on the Pokédex page.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.17 (August 22, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed balance and total yield not updating correctly when
                selling multiple Pokémon at once.
              </p>
              <p className="px-4">
                Updated all user's total yields to be their correct total yield.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.16 (August 16, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Caught filter to Pokédex page.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.15 (August 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed rarity sorting on Game page also sorting by reverse
                Pokédex numbers. Rarity sorting now also sorts by Pokédex number
                from lowest to highest.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.14 (August 13, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed modal to cover whole screen so that screen is not forced
                to scroll up.
              </p>
              <p className="px-4">
                Fixed Waters-Edge and Rough-Terrain not displaying hyphens.
              </p>
              <p className="px-4">
                Fixed habitat dropdown on Pokédex page not having a bottom
                border.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.13 (August 5, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed horizontal scrollbar showing when modal is open.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.12 (July 30, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed Shop page displaying incorrect Pokémon count.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.11 (July 29, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed Shop page tooltips not disappearing properly.
              </p>
              <p className="px-4">
                Fixed Shop page buy buttons showing loading spinners for all
                balls instead of just the purchased ball.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.10 (July 28, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed Achievements page displaying incorrect Pokémon count.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.09 (July 27, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Modified Pokédex page dropdowns to have smaller spacing between
                dropdown items and to overlap the displayed Pokémon.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.08 (July 26, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added usernames! Users can now select a username. Usernames will
                also be displayed on every page (except login page) along with
                balance, total yield and total number of Pokémon.
              </p>
              <p className="px-4">
                Tutorial and Patch Notes pages now require users to be signed in
                for access.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.07 (July 25, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Premier Ball.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.06 (July 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed formatting of balance and total yield to be more
                readable.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.05 (July 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed Achievement Tier breakdown on Tutorial page not including
                Tier 5.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.04 (July 13, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Sinnoh Achievements.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.03 (July 12, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Fixed scrollbar sometimes showing on Sidebar when not needed.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.02 (July 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added ability to sell multiple Pokémon at once.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.01 (July 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Castform-Sunny, Castform-Rainy, and Castform-Snowy.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">4.00 (July 9, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Sinnoh Pokémon! Start collecting Pokémon from Sinnoh
                alongside Pokémon from Kanto, Johto, and Hoenn.
              </p>
              <p className="px-4">
                All exising users will get to choose a Sinnoh starter between
                Turtwig, Chimchar, and Piplup for free!
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.19 (July 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Achievement Tier breakdown to Tutorial page.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.18 (July 7, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added "Select All" option to Pokédex dropdowns.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.17 (July 2, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added habitat filter to Pokédex page.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.16 (July 1, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added type filter to Pokédex page.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.15 (June 30, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed existing Pokédex filters to use dropwdowns and allowing
                users to select multiple filters (e.g. can filter rarity to show
                both Commons and Legendaries).
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.14 (June 26, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Pokéball icon on Pokédex page for caught Pokémon.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.13 (June 21, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Sorted achievements by progress.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.12 (June 19, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added loading spinner to several buttons.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.11 (June 17, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added complete achievements for Kanto, Johto, and Hoenn.
              </p>
              <p className="px-4">
                Added tier 5 achievements which increase yield by P20,000.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.10 (June 15, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added type achievements for Hoenn.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.09 (June 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added type achievements for Johto.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.08 (June 13, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added type achievements for Kanto.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.07 (June 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added habitat achievements for Hoenn.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.06 (June 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added habitat achievements for Johto.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.05 (June 9, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added habitat achievements for Kanto.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.04 (June 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Achievements! Go to the Achievements page to claim
                achievements to increase your total yield.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.03 (June 4, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Pokédex filtering based on rarity.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.02 (May 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Safari Ball.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.01 (May 20, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Dusk Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed to 20%</li>
                <li className="ml-4">Rare chance changed to 50%</li>
                <li className="ml-4">Epic chance changed to 30%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">3.00 (May 19, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Hoenn Pokémon! Start collecting Pokémon from Hoenn
                alongside Pokémon from Kanto and Johto.
              </p>
              <p className="px-4">
                All exising users will get to choose a Hoenn starter between
                Treecko, Torchic, and Mudkip for free!
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.16 (May 18, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Dive Ball.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.15 (May 16, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added day and night Pokémon! Now certain Pokémon can only be
                obtained during the day while certain others can only be
                obtained during the night.
              </p>
              <p className="px-4 pt-4">
                Temporarily modified Dusk Ball to only give Common Pokémon.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.14 (May 15, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added habitat information to cards.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.13 (May 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Modified type colours to use the colours from{" "}
                <a href="https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3">
                  <span>here</span>
                </a>
                .
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.12 (May 13, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 30% to 20%</li>
                <li className="ml-4">Epic chance changed from 10% to 20%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Rare chance changed from 50% to 25%</li>
                <li className="ml-4">Epic chance changed from 50% to 75%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Master Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Rare chance changed from 20% to 0%</li>
                <li className="ml-4">Epic chance changed from 75% to 95%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.11 (May 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added nightly rewards. Nightly rewards give the same amount as
                daily rewards and can be claimed at night. Daily rewards can be
                claimed during the day.
              </p>
              <p className="px-4 pt-4">
                Daily and nightly rewards are now reset at around 3AM EDT
                instead of around 9PM EDT. Total yield is now gifted at around
                3AM EDT as well.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.10 (May 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added day and night colour themes. The day colour theme uses a
                slightly modified version of the previous theme. The night theme
                uses a slightly modified version of the newer darker theme. The
                day theme is used between 6am and 6pm. The night theme is used
                between 6pm and 6am.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.09 (May 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Updated colour scheme to be darker.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.08 (May 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 40% to 30%</li>
                <li className="ml-4">Rare chance changed from 50% to 60%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 10% to 0%</li>
                <li className="ml-4">Epic chance changed from 40% to 50%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.07 (May 7, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 60% to 40%</li>
                <li className="ml-4">Rare chance changed from 30% to 50%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 25% to 10%</li>
                <li className="ml-4">Epic chance changed from 25% to 40%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Master Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 10% to 0%</li>
                <li className="ml-4">Rare chance changed from 25% to 20%</li>
                <li className="ml-4">Epic chance changed from 50% to 75%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.06 (May 5, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Pokédex filtering based on region.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.05 (May 5, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed Shop, Pokédex, Tutorial and Patch Notes sidebar icons.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.04 (May 4, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Dusk Ball.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.03 (May 4, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added balance changes:</p>
              <ul className="list-disc px-4">
                <li className="ml-4">
                  Rare sell price changed from P100 to P250 (Shiny Rare sell
                  price changed from P200 to P500)
                </li>
                <li className="ml-4">
                  Epic sell price changed from P250 to P1,500 (Shiny Epic sell
                  price changed from P500 to P3,000)
                </li>
                <li className="ml-4">
                  Legendary sell price changed from P500 to P5,000 (Shiny
                  Legendary sell price changed from P1,000 to P10,000)
                </li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.02 (May 1, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Poké Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 80% to 90%</li>
                <li className="ml-4">Rare chance changed from 20% to 10%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.01 (April 28, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Modified Daily Reward amount. Daily Reward now works as follows:
              </p>
              <ul className="list-disc px-4">
                <li className="ml-4">
                  If player has total yield of less than P1,000, then they get a
                  P25 daily reward.
                </li>
                <li className="ml-4">
                  If player has total yield of P1,000 or more and less than
                  P10,000, then they get a P100 daily reward.
                </li>
                <li className="ml-4">
                  If player has total yield of P10,000 or more, then they get a
                  P1,000 daily reward.
                </li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.00 (April 27, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Johto Pokémon! Start collecting Pokémon from Johto
                alongside Pokémon from Kanto.
              </p>
              <p className="px-4">
                All exising users will get to choose a Johto starter between
                Chikorita, Cyndaquil, and Totodile for free!
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.20 (April 26, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed Master Ball price from P50,000 to P100,000.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.19 (April 25, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added balance changes:</p>
              <ul className="list-disc px-4">
                <li className="ml-4">
                  Epic yield changed from P150 to P300 (Shiny Rare yield changed
                  from 300 to P600)
                </li>
                <li className="ml-4">
                  Legendary yield changed from P500 to P1000 (Shiny Epic yield
                  changed from P1000 to P200)
                </li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.18 (April 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Pokédex page.</p>
              <p className="px-4">
                Changed Shiny card borders from Pink to Gold.
              </p>
              <p className="px-4">
                Removed space from bottom of cards when sell button isn't
                present.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.17 (April 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added ability to sort obtained Pokémon by Oldest, Newest,
                Pokédex Number, and Rarity.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.16 (April 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added 2000 Pokémon limit.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.15 (April 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added balance changes:</p>
              <ul className="list-disc px-4">
                <li className="ml-4">
                  Rare yield changed from P20 to P50 (Shiny Rare yield changed
                  from P40 to P100)
                </li>
                <li className="ml-4">
                  Epic yield changed from P50 to P150 (Shiny Epic yield changed
                  from P100 to P300)
                </li>
                <li className="ml-4">
                  Legendary yield changed from P100 to P500 (Shiny Legendary
                  yield changed from P200 to P1000)
                </li>
              </ul>
              <div className="px-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4 pb-4">
                <li className="ml-4">Epic chance changed from 23% to 25%</li>
                <li className="ml-4">Legendary chance changed from 2% to 0%</li>
              </ul>
              <div className="px-4 text-2xl font-bold">Master Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Changed price from P100,000 to P50,000</li>
                <li className="ml-4">Common chance changed from 15% to 10%</li>
                <li className="ml-4">
                  Legendary chance changed from 10% to 5%
                </li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.14 (April 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Net Ball.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.13 (April 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added tutorial page.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.12 (April 18, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 65% to 60%</li>
                <li className="ml-4">Epic chance changed from 5% to 10%</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.11 (April 16, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Sidebar item highlighting when mouse hovers over a menu
                item.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.10 (April 15, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added several UI changes:</p>
              <ul className="list-disc px-4">
                <li className="ml-4">Display types of species on cards.</li>
                <li className="ml-4">
                  Changed Legendary colour from Yellow to Emerald.
                </li>
                <li className="ml-4">Added a star emoji for shiny Pokémon.</li>
                <li className="ml-4">Display Pokédex number on cards.</li>
                <li className="ml-4">Styled the scrollbar.</li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.09 (April 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Sidebar.</p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.08 (April 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added confirmation modal when user tries to delete a Pokémon.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.07 (April 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Shiny Pokémon. Every time a user gets a new Pokémon, there
                is a 1 in 4096 chance of the Pokémon being shiny.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.06 (April 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added a sell button that allows users to sell their Pokémon for
                5x the yield.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.05 (April 9, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added button to shop modal that closes the modal when pressed.
              </p>
              <p className="px-4">
                Changed shop modal message to say "an" instead of "a" when the
                species shown starts with a vowel.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.04 (April 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added loading screen when navigating between pages.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.03 (April 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Created a shop page where users can go to buy new Pokémon.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.02 (April 6, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added daily rewards for players to claim. Each day the user
                accesses the app, they can claim P25.
              </p>
            </section>
            <hr className="border-black pb-4"></hr>
            <section className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.01 (April 6, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">
                These are the first balance changes for the game.
              </p>
              <div className="px-4 text-2xl font-bold">Poké Ball</div>
              <ul className="list-disc px-4 pb-4">
                <li className="ml-4">Rare chance changed from 15% to 20%</li>
                <li className="ml-4">Epic chance changed from 5% to 0%</li>
              </ul>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4 pb-4">
                <li className="ml-4">Common chance changed from 60% to 65%</li>
                <li className="ml-4">Epic chance changed from 10% to 5%</li>
              </ul>
              <div className="px-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4 pb-4">
                <li className="ml-4">Common chance changed from 40% to 25%</li>
                <li className="ml-4">Rare chance changed from 40% to 50%</li>
                <li className="ml-4">Epic chance changed from 18% to 23%</li>
              </ul>
              <div className="px-4 text-2xl font-bold">Master Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Changed price from P100,000 to P50,000</li>
                <li className="ml-4">Common chance changed from 25% to 15%</li>
                <li className="ml-4">Rare chance changed from 35% to 25%</li>
                <li className="ml-4">Epic chance changed from 35% to 50%</li>
                <li className="ml-4">
                  Legendary chance changed from 5% to 10%
                </li>
              </ul>
            </section>
            <hr className="border-black pb-4"></hr>
            <h3 className="p-4 text-4xl font-bold">1.00 (April 5, 2023)</h3>
            <hr className="border-black"></hr>
            <p className="p-4">
              The base game is now released! Start creating your collection on
              your quest to complete the Pokédex!
            </p>
            <p className="px-4 pb-4">
              Choose your starter between Bulbasaur, Charmander, and Squirtle,
              and try to collect all 151 Pokémon from the Kanto Pokédex!
            </p>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
