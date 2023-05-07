import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function PatchNotes() {
  return (
    <>
      <Head>
        <title>PokéZoo - Patch Notes</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Sidebar page="PatchNotes">
          <div className="px-8">
            <h1 className="p-4 text-7xl font-bold">Patch Notes</h1>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.06 (May 5, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Pokédex filtering based on region.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.05 (May 5, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed Shop, Pokédex, Tutorial and Patch Notes sidebar icons.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.04 (May 4, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Dusk Ball.</p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.03 (May 4, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Poké Ball</div>
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">2.02 (May 1, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Poké Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 80% to 90%</li>
                <li className="ml-4">Rare chance changed from 20% to 10%</li>
              </ul>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.20 (April 26, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Changed Master Ball price from P50,000 to P100,000.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.17 (April 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added ability to sort obtained Pokémon by Oldest, Newest,
                Pokédex Number, and Rarity.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.16 (April 24, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added 2000 Pokémon limit.</p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.14 (April 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Net Ball.</p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.13 (April 23, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added tutorial page.</p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.12 (April 18, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="p-4">Added balance changes:</p>
              <div className="px-4 text-2xl font-bold">Great Ball</div>
              <ul className="list-disc px-4">
                <li className="ml-4">Common chance changed from 65% to 60%</li>
                <li className="ml-4">Epic chance changed from 5% to 10%</li>
              </ul>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.11 (April 16, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Sidebar item highlighting when mouse hovers over a menu
                item.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.09 (April 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">Added Sidebar.</p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.08 (April 14, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added confirmation modal when user tries to delete a Pokémon.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.07 (April 11, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added Shiny Pokémon. Every time a user gets a new Pokémon, there
                is a 1 in 4096 chance of the Pokémon being shiny.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.06 (April 10, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added a sell button that allows users to sell their Pokémon for
                5x the yield.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.05 (April 9, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added button to shop modal that closes the modal when pressed.
              </p>
              <p className="px-4">
                Changed shop modal message to say "an" instead of "a" when the
                species shown starts with a vowel.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.04 (April 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added loading screen when navigating between pages.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.03 (April 8, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Created a shop page where users can go to buy new Pokémon.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
              <h3 className="p-4 text-4xl font-bold">1.02 (April 6, 2023)</h3>
              <hr className="border-black"></hr>
              <p className="px-4 pt-4">
                Added daily rewards for players to claim. Each day the user
                accesses the app, they can claim P25.
              </p>
            </div>
            <hr className="border-black pb-4"></hr>
            <div className="pb-4">
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
            </div>
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
          </div>
        </Sidebar>
      </div>
    </>
  );
}
