import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Tutorial() {
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
            <h1 className="py-4 text-7xl font-bold">Tutorial</h1>
            <hr className="border-black pb-4"></hr>
            <p>
              PokéZoo is a game where players collect Pokémon. Each Pokémon
              gives the user a certain amount of money depending on their
              rarity. Money can then ben used to collect even more Pokémon.
            </p>
            <br></br>
            <p>
              Common Pokémon give P10 per day, Rare Pokémon give P20 per day,
              Epic Pokémon give P50 per day, and Legendary Pokémon give P100 per
              day.
            </p>
            <br></br>
            <p>
              Users are automatically gifted their total yield once per day
              around 9PM EDT. The daily reward of P25 is also reset at this
              time.
            </p>
            <br></br>
            <p>
              Pokémon rarity is calculated as following (using terms from{" "}
              <a
                href="https://bulbapedia.bulbagarden.net/wiki/Experience"
                className="text-blue-600 visited:text-purple-600">
                Bulbapedia
              </a>
              ):
            </p>
            <ul className="list-disc">
              <li className="ml-4">
                If a Pokémon is Legendary or Mythical, then it has Legendary
                rarity.
              </li>
              <li className="ml-4">
                If a Pokémon is in the Medium-Fast experience group, then it has
                Common rarity.
              </li>
              <li className="ml-4">
                If a Pokémon is in the Medium-Slow or Fast experience groups,
                then it has Rare rarity.
              </li>
              <li className="ml-4">
                If a Pokémon is in the Slow, Erratic, or Fluctuating experience
                groups, then it has Epic rarity.
              </li>
            </ul>
            <br></br>
            <p>
              New Pokémon can be obtained through the shop page. There are
              different balls which each contain their own rarity chances. Each
              ball also has a 1 in 4096 chance of giving the user a shiny
              Pokémon.
            </p>
            <br></br>
            <p>
              Pokémon can also be sold from the game page for 5x their yield
              amount.
            </p>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
