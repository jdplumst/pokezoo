import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function PatchNotes() {
  return (
    <>
      <Head>
        <title>PokéZoo - Patch Notes</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/master-ball.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
        <Sidebar page="PatchNotes">
          <div className="px-8">
            <h1 className="p-4 text-7xl font-bold">Patch Notes</h1>
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
              <p className="px-4 pt-4">
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
                <li className="ml-4">Epic chance changed from 5% to 10%</li>
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
