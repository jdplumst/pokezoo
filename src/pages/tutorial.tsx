import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Tutorial() {
  return (
    <>
      <Head>
        <title>PokéZoo - Tutorial</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="color min-h-screen">
        <Sidebar page="Tutorial">
          <main className="px-8">
            <h1 className="py-4 text-7xl font-bold">Tutorial</h1>
            <hr className="border-black pb-4"></hr>
            <p>
              PokéZoo is a game where players collect Pokémon. Each Pokémon
              gives the user a certain amount of money depending on their
              rarity. Money can then be used to collect even more Pokémon.
            </p>
            <br></br>
            <p>
              Common Pokémon give P10 per day, Rare Pokémon give P50 per day,
              Epic Pokémon give P300 per day, and Legendary Pokémon give P1000
              per day. Shiny Pokémon give double the amount of their non-shiny
              counterparts.
            </p>
            <br></br>
            <p>
              Users are automatically gifted their total yield once per day
              around 9PM EDT. The daily reward is also reset at this time.
            </p>
            <br></br>
            <p>Daily Reward works as follows:</p>
            <ul className="list-disc px-4">
              <li>
                If player has total yield of less than P1,000, then they get a
                P25 daily reward.
              </li>
              <li>
                If player has total yield of P1,000 or more and less than
                P10,000, then they get a P100 daily reward.
              </li>
              <li>
                If player has total yield of P10,000 or more, then they get a
                P1,000 daily reward.
              </li>
            </ul>
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
              Pokémon can also be sold from the game page. Common Pokémon can be
              sold for P50, Rare Pokémon can be sold for P250, Epic Pokémon can
              be sold for P1,500, and Legendary Pokémon can be sold for P5,000.
              Shiny Pokémon can be sold for double the amount of their non-shiny
              counterparts.
            </p>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
