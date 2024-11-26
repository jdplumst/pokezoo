import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";
import Topbar from "../components/Topbar";
import ThemeWrapper from "../components/ThemeWrapper";
import Patch from "../components/Patch";
import Note from "../components/Note";

export default function PatchNotes() {
  const { status } = useSession({
    required: true,
  });

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Patch Notes</title>
        <meta
          name="description"
          content="PokéZoo"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>
      <ThemeWrapper>
        <Sidebar page="PatchNotes">
          <Topbar />
          <main className="px-8">
            <h1 className="p-4 text-7xl font-bold">Patch Notes</h1>
            <Patch
              patch="8.04"
              date="November 26, 2024"
            >
              <Note
                note="Added Hisui Pokémon! Start collecting Pokémon from Hisui 
                alongside Pokémon from the previous regions."
              />
              <Note
                note="All exising users will get to choose a Galar starter between
                Hisuian Decidueye, Hisuian Typhlosion, and Hisuian Samurott for free!"
              />
            </Patch>
            <Patch
              patch="8.03"
              date="October 21, 2024"
            >
              <Note note="Added Galar and Gigantamax Achievements." />
            </Patch>
            <Patch
              patch="8.02"
              date="October 20, 2024"
            >
              <Note note="Added a new rarity: Gigantamax!" />
              <Note note="Added Gigantamax Pokémon." />
              <Note note="Added Dream Ball." />
            </Patch>
            <Patch
              patch="8.01"
              date="October 19, 2024"
            >
              <Note note="Added Galarian regional forms." />
            </Patch>
            <Patch
              patch="8.00"
              date="October 18, 2024"
            >
              <Note
                note="Added Galar Pokémon! Start collecting Pokémon from Galar
                alongside Pokémon from the previous regions."
              />
              <Note
                note="All exising users will get to choose a Galar starter between
                Grookey, Scorbunny, and Sobble for free!"
              />
            </Patch>
            <Patch
              patch="7.10"
              date="October 15, 2024"
            >
              <Note note="Added Quests! Go to the Quests page to claim quest rewards to increase your in-game currency." />
            </Patch>
            <Patch
              patch="7.09"
              date="July 7, 2024"
            >
              <Note note="Fixed achievement sorting on Firefox." />
            </Patch>
            <Patch
              patch="7.08"
              date="July 5, 2024"
            >
              <Note note="Fixed Alolan starter selection not showing correct Pokémon." />
            </Patch>
            <Patch
              patch="7.07"
              date="May 17, 2024"
            >
              <Note note="Changed style of Pokémon cards." />
            </Patch>
            <Patch
              patch="7.06"
              date="May 16, 2024"
            >
              <Note note="Added Mega and Ultra Beast Achievements." />
            </Patch>
            <Patch
              patch="7.05"
              date="May 5, 2024"
            >
              <Note note="Fixed claim button sometimes showing for achievements that have already been claimed." />
            </Patch>
            <Patch
              patch="7.04"
              date="April 27, 2024"
            >
              <Note note="Removed scroll when choosing a region with Premier Ball." />
            </Patch>
            <Patch
              patch="7.03"
              date="April 26, 2024"
            >
              <Note note="Added Alola Achievements." />
            </Patch>
            <Patch
              patch="7.02"
              date="April 25, 2024"
            >
              <Note note="Added Alolan regional forms." />
            </Patch>
            <Patch
              patch="7.01"
              date="April 24, 2024"
            >
              <Note note="Added a new rarity: Ultra Beast!" />
              <Note note="Added Ultra Beast Pokémon." />
              <Note note="Added Beast Ball." />
              <Note note="Changed daytime tooltip colour to slate." />
            </Patch>
            <Patch
              patch="7.00"
              date="April 23, 2024"
            >
              <Note
                note="Added Alola Pokémon! Start collecting Pokémon from Alola 
                alongside Pokémon from the previous regions."
              />
              <Note
                note="All exising users will get to choose an Alola starter between
                Rowlet, Litten, and Popplio for free!"
              />
            </Patch>
            <Patch
              patch="6.12"
              date="April 16, 2024"
            >
              <Note note="Set font to Geist." />
            </Patch>
            <Patch
              patch="6.11"
              date="March 16, 2024"
            >
              <Note note="Removed buy button on shop page for charms that a user has already purchased." />
            </Patch>
            <Patch
              patch="6.10"
              date="March 10, 2024"
            >
              <Note
                note="Added Wildcards to Shop! Users can now trade in 
                their wildcards for wildcards of other rarities."
              />
            </Patch>
            <Patch
              patch="6.09"
              date="February 18, 2024"
            >
              <Note note="Added Mark Charm." />
            </Patch>
            <Patch
              patch="6.08"
              date="February 17, 2024"
            >
              <Note note="Added Charms! Go to the Shop page to start buying charms" />
              <Note note="Added Catching Charm." />
            </Patch>
            <Patch
              patch="6.07"
              date="January 31, 2024"
            >
              <Note note="Excluded Megas from achievements." />
            </Patch>
            <Patch
              patch="6.06"
              date="January 29, 2024"
            >
              <Note note="Added Unova and Kalos Megas." />
            </Patch>
            <Patch
              patch="6.05"
              date="January 28, 2024"
            >
              <Note note="Added Sinnoh Megas." />
            </Patch>
            <Patch
              patch="6.04"
              date="January 27, 2024"
            >
              <Note note="Added Hoenn Megas." />
            </Patch>
            <Patch
              patch="6.03"
              date="January 26, 2024"
            >
              <Note note="Added Johto Megas" />
            </Patch>
            <Patch
              patch="6.02"
              date="January 25, 2024"
            >
              <Note note="Added a new rarity: Mega!" />
              <Note note="Added Kanto Megas." />
              <Note note="Added Cherish Ball." />
            </Patch>
            <Patch
              patch="6.01"
              date="January 24, 2024"
            >
              <Note note="Added Kalos Achievements." />
            </Patch>
            <Patch
              patch="6.00"
              date="January 23, 2024"
            >
              <Note
                note="Added Kalos Pokémon! Start collecting Pokémon from Kalos
                alongside Pokémon from Kanto, Johto, Hoenn, Sinnoh and Unova."
              />
              <Note
                note="All exising users will get to choose a Unova starter between
                Chespin, Fennekin, and Froakie for free!"
              />
            </Patch>
            <Patch
              patch="5.15"
              date="January 21, 2024"
            >
              <Note note="Added Generation information to cards." />
            </Patch>
            <Patch
              patch="5.14"
              date="December 19, 2023"
            >
              <Note note="Fixed duplicate Pokémon displaying on Game and Pokédex pages." />
            </Patch>
            <Patch
              patch="5.13"
              date="December 9, 2023"
            >
              <Note
                note="Added themes! Users can now go to the new Settings page to
                select day and night themes."
              />
            </Patch>
            <Patch
              patch="5.12"
              date="December 6, 2023"
            >
              <Note note="Fixed Pokédex page skipping over Pokémon." />
            </Patch>
            <Patch
              patch="5.11"
              date="November 29, 2023"
            >
              <Note note="Added a Pokédex # Descending sorting button to Game page." />
            </Patch>
            <Patch
              patch="5.10"
              date="November 26, 2023"
            >
              <Note note="Added dropdown filters to Game page." />
            </Patch>
            <Patch
              patch="5.09"
              date="November 25, 2023"
            >
              <Note note="Added a Rarity Descending sorting button to Game page." />
              <Note note="Removed white outline that sometimes appeared on buttons." />
            </Patch>
            <Patch
              patch="5.08"
              date="November 11, 2023"
            >
              <Note
                note="Traded Pokémon will now be sorted based on the date they were
                traded rather than the date they were initially obtained. This
                change is not applied to Pokémon traded before this patch."
              />
            </Patch>
            <Patch
              patch="5.07"
              date="October 20, 2023"
            >
              <Note
                note="Users can now purchase Pokémon using wildcards from the Pokédex
                page."
              />
            </Patch>
            <Patch
              patch="5.06"
              date="October 19, 2023"
            >
              <Note note="Added Region information to cards." />
            </Patch>
            <Patch
              patch="5.05"
              date="October 9, 2023"
            >
              <Note
                note="Display modal after user claims their daily and nightly rewards
                to show the rewards that they claimed."
              />
            </Patch>
            <Patch
              patch="5.04"
              date="October 7, 2023"
            >
              <Note
                note="Added Wildcards! Everytime a user claims a daily or nightly
                reward, they receive 1 wildcard in addition to the rewards they
                already receive."
              />
            </Patch>
            <Patch
              patch="5.03"
              date="October 3, 2023"
            >
              <Note
                note="Modified Daily and Nightly rewards to give users a random amount
                between 7.5% of their total yield to 12.5% of their total yield
                (rounded to the nearest integer)."
              />
            </Patch>
            <Patch
              patch="5.02"
              date="September 29, 2023"
            >
              <Note note="Added Unova Achievements." />
            </Patch>
            <Patch
              patch="5.01"
              date="September 28, 2023"
            >
              <Note note="Added Female forms of Hippopotas and Hippowdon." />
            </Patch>
            <Patch
              patch="5.00"
              date="September 27, 2023"
            >
              <Note
                note="Added Unova Pokémon! Start collecting Pokémon from Unova
                alongside Pokémon from Kanto, Johto, Hoenn and Sinnoh."
              />
              <Note
                note="All exising users will get to choose a Unova starter between
                Snivy, Tepig, and Oshawott for free!"
              />
            </Patch>
            <Patch
              patch="4.24"
              date="September 22, 2023"
            >
              <Note note="Close other dropdowns on Pokédex page when opening one." />
            </Patch>
            <Patch
              patch="4.23"
              date="September 20, 2023"
            >
              <Note note="Set maximum total yield to 1,000,000,000." />
            </Patch>
            <Patch
              patch="4.22"
              date="September 19, 2023"
            >
              <Note
                note="Sold Pokémon now get removed from the Pokémon list on the Game
                page without the user having to manually refresh the page."
              />
            </Patch>
            <Patch
              patch="4.21"
              date="September 18, 2023"
            >
              <Note note="Changed Add Trade button to be purple at night." />
            </Patch>
            <Patch
              patch="4.20"
              date="September 17, 2023"
            >
              <Note note="Sorted Pokémon on the Trades page modal in Pokédex order." />
              <Note
                note="Display a star next to the name of shinies on the Trades page
                modal."
              />
            </Patch>
            <Patch
              patch="4.19"
              date="September 16, 2023"
            >
              <Note
                note="Added Trading! Go to the Trades page to start trading Pokémon
                with other trainers."
              />
            </Patch>
            <Patch
              patch="4.18"
              date="August 30, 2023"
            >
              <Note
                note="Fixed Waters-Edge and Rough-Terrain not being selectable in the
                Habitat dropdown on the Pokédex page."
              />
            </Patch>
            <Patch
              patch="4.17"
              date="August 22, 2023"
            >
              <Note
                note="Fixed balance and total yield not updating correctly when
                selling multiple Pokémon at once."
              />
              <Note
                note="Updated all user's total yields to be their correct total
                yield."
              />
            </Patch>
            <Patch
              patch="4.16"
              date="August 16, 2023"
            >
              <Note note="Added Caught filter to Pokédex page." />
            </Patch>
            <Patch
              patch="4.15"
              date="August 14, 2023"
            >
              <Note
                note="Fixed rarity sorting on Game page also sorting by reverse
                Pokédex numbers. Rarity sorting now also sorts by Pokédex number
                from lowest to highest."
              />
            </Patch>
            <Patch
              patch="4.14"
              date="August 13, 2023"
            >
              <Note
                note="Changed modal to cover whole screen so that screen is not forced
                to scroll up."
              />
              <Note note="Fixed Waters-Edge and Rough-Terrain not displaying hyphens." />
              <Note
                note="Fixed habitat dropdown on Pokédex page not having a bottom
                border."
              />
            </Patch>
            <Patch
              patch="4.13"
              date="August 5, 2023"
            >
              <Note note="Fixed horizontal scrollbar showing when modal is open." />
            </Patch>
            <Patch
              patch="4.12"
              date="July 30, 2023"
            >
              <Note note="Fixed Shop page displaying incorrect Pokémon count." />
            </Patch>
            <Patch
              patch="4.11"
              date="July 29, 2023"
            >
              <Note note="Fixed Shop page tooltips not disappearing properly." />
              <Note
                note="Fixed Shop page buy buttons showing loading spinners for all
                balls instead of just the purchased ball."
              />
            </Patch>
            <Patch
              patch="4.10"
              date="July 28, 2023"
            >
              <Note note="Fixed Achievements page displaying incorrect Pokémon count." />
            </Patch>
            <Patch
              patch="4.09"
              date="July 27, 2023"
            >
              <Note
                note="Modified Pokédex page dropdowns to have smaller spacing between
                dropdown items and to overlap the displayed Pokémon."
              />
            </Patch>
            <Patch
              patch="4.08"
              date="July 26, 2023"
            >
              <Note
                note="Added usernames! Users can now select a username. Usernames will
                also be displayed on every page (except login page) along with
                balance, total yield and total number of Pokémon."
              />
              <Note
                note="Tutorial and Patch Notes pages now require users to be signed in
                for access."
              />
            </Patch>
            <Patch
              patch="4.07"
              date="July 25, 2023"
            >
              <Note note="Added Premier Ball." />
            </Patch>
            <Patch
              patch="4.06"
              date="July 24, 2023"
            >
              <Note
                note="Changed formatting of balance and total yield to be more
                readable."
              />
            </Patch>
            <Patch
              patch="4.05"
              date="July 14, 2023"
            >
              <Note
                note="Fixed Achievement Tier breakdown on Tutorial page not including
                Tier 5."
              />
            </Patch>
            <Patch
              patch="4.04"
              date="July 13, 2023"
            >
              <Note note="Added Sinnoh Achievements." />
            </Patch>
            <Patch
              patch="4.03"
              date="July 12, 2023"
            >
              <Note note="Fixed scrollbar sometimes showing on Sidebar when not needed." />
            </Patch>
            <Patch
              patch="4.02"
              date="July 11, 2023"
            >
              <Note note="Added ability to sell multiple Pokémon at once." />
            </Patch>
            <Patch
              patch="4.01"
              date="July 10, 2023"
            >
              <Note note="Added Castform-Sunny, Castform-Rainy, and Castform-Snowy." />
            </Patch>
            <Patch
              patch="4.00"
              date="July 9, 2023"
            >
              <Note
                note="Added Sinnoh Pokémon! Start collecting Pokémon from Sinnoh
                alongside Pokémon from Kanto, Johto, and Hoenn."
              />
              <Note
                note="All exising users will get to choose a Sinnoh starter between
                Turtwig, Chimchar, and Piplup for free!"
              />
            </Patch>
            <Patch
              patch="3.19"
              date="July 8, 2023"
            >
              <Note note="Added Achievement Tier breakdown to Tutorial page." />
            </Patch>
            <Patch
              patch="3.18"
              date="July 7, 2023"
            >
              <Note note='Added "Select All" option to Pokédex dropdowns.' />
            </Patch>
            <Patch
              patch="3.17"
              date="July 2, 2023"
            >
              <Note note="Added habitat filter to Pokédex page." />
            </Patch>
            <Patch
              patch="3.16"
              date="July 1, 2023"
            >
              <Note note="Added type filter to Pokédex page." />
            </Patch>
            <Patch
              patch="3.15"
              date="June 30, 2023"
            >
              <Note
                note="Changed existing Pokédex filters to use dropwdowns and allowing
                users to select multiple filters (e.g. can filter rarity to show
                both Commons and Legendaries)."
              />
            </Patch>
            <Patch
              patch="3.14"
              date="June 26, 2023"
            >
              <Note note="Added Pokéball icon on Pokédex page for caught Pokémon." />
            </Patch>
            <Patch
              patch="3.13"
              date="June 21, 2023"
            >
              <Note note="Sorted achievements by progress." />
            </Patch>
            <Patch
              patch="3.12"
              date="June 19, 2023"
            >
              <Note note="Added loading spinner to several buttons." />
            </Patch>
            <Patch
              patch="3.11"
              date="June 17, 2023"
            >
              <Note note="Added complete achievements for Kanto, Johto, and Hoenn." />
              <Note note="Added tier 5 achievements which increase yield by P20,000." />
            </Patch>
            <Patch
              patch="3.10"
              date="June 15, 2023"
            >
              <Note note="Added type achievements for Hoenn." />
            </Patch>
            <Patch
              patch="3.09"
              date="June 14, 2023"
            >
              <Note note="Added type achievements for Johto." />
            </Patch>
            <Patch
              patch="3.08"
              date="June 13, 2023"
            >
              <Note note="Added type achievements for Kanto." />
            </Patch>
            <Patch
              patch="3.07"
              date="June 11, 2023"
            >
              <Note note="Added habitat achievements for Hoenn." />
            </Patch>
            <Patch
              patch="3.06"
              date="June 10, 2023"
            >
              <Note note="Added habitat achievements for Johto." />
            </Patch>
            <Patch
              patch="3.05"
              date="June 9, 2023"
            >
              <Note note="Added habitat achievements for Kanto." />
            </Patch>
            <Patch
              patch="3.04"
              date="June 8, 2023"
            >
              <Note
                note="Added Achievements! Go to the Achievements page to claim
                achievements to increase your total yield."
              />
            </Patch>
            <Patch
              patch="3.03"
              date="June 4, 2023"
            >
              <Note note="Added Pokédex filtering based on rarity." />
            </Patch>
            <Patch
              patch="3.02"
              date="May 23, 2023"
            >
              <Note note="Added Safari Ball." />
            </Patch>
            <Patch
              patch="3.01"
              date="May 20, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Dusk Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed to 20%</li>
                <li className="ml-4">Rare chance changed to 50%</li>
                <li className="ml-4">Epic chance changed to 30%</li>
              </ul>
            </Patch>
            <Patch
              patch="3.00"
              date="May 19, 2023"
            >
              <Note
                note="Added Hoenn Pokémon! Start collecting Pokémon from Hoenn
                alongside Pokémon from Kanto and Johto."
              />
              <Note
                note="All exising users will get to choose a Hoenn starter between
                Treecko, Torchic, and Mudkip for free!"
              />
            </Patch>
            <Patch
              patch="2.16"
              date="May 18, 2023"
            >
              <Note note="Added Dive Ball." />
            </Patch>
            <Patch
              patch="2.15"
              date="May 16, 2023"
            >
              <Note
                note="Added day and night Pokémon! Now certain Pokémon can only be
                obtained during the day while certain others can only be
                obtained during the night."
              />
              <Note note="Temporarily modified Dusk Ball to only give Common Pokémon." />
            </Patch>
            <Patch
              patch="2.14"
              date="May 15, 2023"
            >
              <Note note="Added habitat information to cards." />
            </Patch>
            <Patch
              patch="2.13"
              date="May 14, 2023"
            >
              <p className="px-4 pt-4">
                Modified type colours to use the colours from{" "}
                <a href="https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3">
                  <span>here</span>
                </a>
                .
              </p>
            </Patch>
            <Patch
              patch="2.12"
              date="May 13, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Great Ball</div>
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
            </Patch>
            <Patch
              patch="2.11"
              date="May 11, 2023"
            >
              <Note
                note="Added nightly rewards. Nightly rewards give the same amount as
                daily rewards and can be claimed at night. Daily rewards can be
                claimed during the day."
              />
              <Note
                note="Daily and nightly rewards are now reset at around 3AM EDT
                instead of around 9PM EDT. Total yield is now gifted at around
                3AM EDT as well."
              />
            </Patch>
            <Patch
              patch="2.10"
              date="May 11, 2023"
            >
              <Note
                note="Added day and night colour themes. The day colour theme uses a
                slightly modified version of the previous theme. The night theme
                uses a slightly modified version of the newer darker theme. The
                day theme is used between 6am and 6pm. The night theme is used
                between 6pm and 6am."
              />
            </Patch>
            <Patch
              patch="2.09"
              date="May 10, 2023"
            >
              <Note note="Updated colour scheme to be darker." />
            </Patch>
            <Patch
              patch="2.08"
              date="May 10, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 40% to 30%</li>
                <li className="ml-4">Rare chance changed from 50% to 60%</li>
              </ul>
              <div className="px-4 pt-4 text-2xl font-bold">Ultra Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 10% to 0%</li>
                <li className="ml-4">Epic chance changed from 40% to 50%</li>
              </ul>
            </Patch>
            <Patch
              patch="2.07"
              date="May 7, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Great Ball</div>
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
            </Patch>
            <Patch
              patch="2.06"
              date="May 5, 2023"
            >
              <Note note="Added Pokédex filtering based on region." />
            </Patch>
            <Patch
              patch="2.05"
              date="May 5, 2023"
            >
              <Note note="Changed Shop, Pokédex, Tutorial and Patch Notes sidebar icons." />
            </Patch>
            <Patch
              patch="2.04"
              date="May 4, 2023"
            >
              <Note note="Added Dusk Ball." />
            </Patch>
            <Patch
              patch="2.03"
              date="May 4, 2023"
            >
              <Note note="Added balance changes:" />
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
            </Patch>
            <Patch
              patch="2.02"
              date="May 1, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Poké Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 80% to 90%</li>
                <li className="ml-4">Rare chance changed from 20% to 10%</li>
              </ul>
            </Patch>
            <Patch
              patch="2.01"
              date="April 28, 2023"
            >
              <Note note="Modified Daily Reward amount. Daily Reward now works as follows:" />
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
            </Patch>
            <Patch
              patch="2.00"
              date="April 27, 2023"
            >
              <Note
                note="Added Johto Pokémon! Start collecting Pokémon from Johto
                alongside Pokémon from Kanto."
              />
              <Note
                note="All exising users will get to choose a Johto starter between
                Chikorita, Cyndaquil, and Totodile for free!"
              />
            </Patch>
            <Patch
              patch="1.20"
              date="April 26, 2023"
            >
              <Note note="Changed Master Ball price from P50,000 to P100,000." />
            </Patch>
            <Patch
              patch="1.19"
              date="April 25, 2023"
            >
              <Note note="Added balance changes:" />
              <ul className="list-disc px-4">
                <li className="ml-4">
                  Epic yield changed from P150 to P300 (Shiny Epic yield changed
                  from P300 to P600)
                </li>
                <li className="ml-4">
                  Legendary yield changed from P500 to P1000 (Shiny Legendary
                  yield changed from P1000 to P2000)
                </li>
              </ul>
            </Patch>
            <Patch
              patch="1.18"
              date="April 24, 2023"
            >
              <Note note="Added Pokédex page." />
              <Note note="Changed Shiny card borders from Pink to Gold." />
              <Note
                note="Removed space from bottom of cards when sell button isn't
                present."
              />
            </Patch>
            <Patch
              patch="1.17"
              date="April 24, 2023"
            >
              <Note
                note="Added ability to sort obtained Pokémon by Oldest, Newest,
                Pokédex Number, and Rarity."
              />
            </Patch>
            <Patch
              patch="1.16"
              date="April 24, 2023"
            >
              <Note note="Added 2000 Pokémon limit." />
            </Patch>
            <Patch
              patch="1.15"
              date="April 23, 2023"
            >
              <Note note="Added balance changes:" />
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
              <div className="px-4 pt-4 text-2xl font-bold">Ultra Ball</div>
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
            </Patch>
            <Patch
              patch="1.14"
              date="April 23, 2023"
            >
              <Note note="Added Net Ball." />
            </Patch>
            <Patch
              patch="1.13"
              date="April 23, 2023"
            >
              <Note note="Added tutorial page." />
            </Patch>
            <Patch
              patch="1.12"
              date="April 18, 2023"
            >
              <Note note="Added balance changes:" />
              <div className="px-4 pt-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 65% to 60%</li>
                <li className="ml-4">Epic chance changed from 5% to 10%</li>
              </ul>
            </Patch>
            <Patch
              patch="1.11"
              date="April 16, 2023"
            >
              <Note
                note="Added Sidebar item highlighting when mouse hovers over a menu
                item."
              />
            </Patch>
            <Patch
              patch="1.10"
              date="April 15, 2023"
            >
              <Note note="Added several UI changes:" />
              <ul className="list-disc px-4">
                <li className="ml-4">Display types of species on cards.</li>
                <li className="ml-4">
                  Changed Legendary colour from Yellow to Emerald.
                </li>
                <li className="ml-4">Added a star emoji for shiny Pokémon.</li>
                <li className="ml-4">Display Pokédex number on cards.</li>
                <li className="ml-4">Styled the scrollbar.</li>
              </ul>
            </Patch>
            <Patch
              patch="1.09"
              date="April 14, 2023"
            >
              <Note note="Added Sidebar." />
            </Patch>
            <Patch
              patch="1.08"
              date="April 14, 2023"
            >
              <Note note="Added confirmation modal when user tries to delete a Pokémon." />
            </Patch>
            <Patch
              patch="1.07"
              date="April 11, 2023"
            >
              <Note
                note="Added Shiny Pokémon. Every time a user gets a new Pokémon, there
                is a 1 in 4096 chance of the Pokémon being shiny."
              />
            </Patch>
            <Patch
              patch="1.06"
              date="April 10, 2023"
            >
              <Note
                note="Added a sell button that allows users to sell their Pokémon for
                5x the yield."
              />
            </Patch>
            <Patch
              patch="1.05"
              date="April 9, 2023"
            >
              <Note note="Added button to shop modal that closes the modal when pressed." />
              <Note
                note='Changed shop modal message to say "an" instead of
                "a" when the species shown starts with a vowel.'
              />
            </Patch>
            <Patch
              patch="1.04"
              date="April 8, 2023"
            >
              <Note note="Added loading screen when navigating between pages." />
            </Patch>
            <Patch
              patch="1.03"
              date="April 8, 2023"
            >
              <Note note="Created a shop page where users can go to buy new Pokémon." />
            </Patch>
            <Patch
              patch="1.02"
              date="April 6, 2023"
            >
              <Note
                note="Added daily rewards for players to claim. Each day the user
                accesses the app, they can claim P25."
              />
            </Patch>
            <Patch
              patch="1.01"
              date="April 6, 2023"
            >
              <Note note="These are the first balance changes for the game." />
              <div className="px-4 pt-4 text-2xl font-bold">Poké Ball</div>
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
            </Patch>
            <Patch
              patch="1.00"
              date="April 5, 2023"
            >
              <Note
                note="The base game is now released! Start creating your collection on
              your quest to complete the Pokédex!"
              />
              <Note
                note="Choose your starter between Bulbasaur, Charmander, and Squirtle,
              and try to collect all 151 Pokémon from the Kanto Pokédex!"
              />
            </Patch>
          </main>
        </Sidebar>
      </ThemeWrapper>
    </>
  );
}
