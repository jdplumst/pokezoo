import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function Tutorial() {
  const { data: session } = useSession();
  const user = session?.user;

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

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Tutorial</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Tutorial">
          <main className="px-8">
            {user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <h1 className="py-4 text-7xl font-bold">Tutorial</h1>
            <hr className="border-black pb-4"></hr>
            <p>
              PokéZoo is a game where players collect Pokémon. Each Pokémon
              gives the user a certain amount of money depending on their
              rarity. Money can then be used to collect even more Pokémon and
              claim achievements.
            </p>
            <br></br>
            <p>
              Pokémon are one source of yield. Common Pokémon give P10 per day,
              Rare Pokémon give P50 per day, Epic Pokémon give P300 per day, and
              Legendary Pokémon give P1000 per day. Shiny Pokémon give double
              the amount of their non-shiny counterparts.
            </p>
            <br></br>
            <p>
              Achievements are the second source of yield. Users can claim
              achievements from the achievements page. Tier 1 achievements give
              P1,000 per day, tier 2 achievements give P2,000 per day, tier 3
              achievements give P5,000 per day, tier 4 achievements give P10,000
              per day, and tier 5 achievements give P20,000 per day.
            </p>
            <br></br>
            <p>
              Users are automatically gifted their total yield once per day
              around 3AM EDT. The daily and nightly rewards are also reset at
              this time.
            </p>
            <br></br>
            <p>Daily and Nightly Rewards work as follows:</p>
            <ul className="list-disc px-4">
              <li>
                If player has total yield of less than P1,000, then they get a
                P25 reward.
              </li>
              <li>
                If player has total yield of P1,000 or more and less than
                P10,000, then they get a P100 reward.
              </li>
              <li>
                If player has total yield of P10,000 or more, then they get a
                P1,000 reward.
              </li>
            </ul>
            <br></br>
            <p>
              Pokémon rarity is calculated as following (using terms from{" "}
              <a href="https://bulbapedia.bulbagarden.net/wiki/Experience">
                <span>Bulbapedia</span>
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
            <p>Achievement Tiers work as follows:</p>
            <div className="grid grid-cols-4">
              <div>
                <p>Tier 1:</p>
                <ul className="list-disc px-4">
                  <li>Common Rarity</li>
                  <li>Cave Habitat</li>
                  <li>Rough-Terrain Habitat</li>
                  <li>Normal Type</li>
                  <li>Poison Type</li>
                  <li>Ground Type</li>
                  <li>Rock Type</li>
                  <li>Ice Type</li>
                  <li>Bug Type</li>
                </ul>
              </div>
              <div>
                <p>Tier 2:</p>
                <ul className="list-disc px-4">
                  <li>Rare Rarity</li>
                  <li>Sea Habitat</li>
                  <li>Mountain Habitat</li>
                  <li>Urban Habitat</li>
                  <li>Waters-Edge Habitat</li>
                  <li>Fire Type</li>
                  <li>Water Type</li>
                  <li>Grass Type</li>
                  <li>Electric Type</li>
                  <li>Ghost Type</li>
                  <li>Fairy Type</li>
                  <li>Dark Type</li>
                </ul>
              </div>
              <div>
                <p>Tier 3:</p>
                <ul className="list-disc px-4">
                  <li>Epic Rarity</li>
                  <li>Grassland Habitat</li>
                  <li>Forest Habitat</li>
                  <li>Fighting Type</li>
                  <li>Flying Type</li>
                </ul>
              </div>
              <div>
                <p>Tier 4:</p>
                <ul className="list-disc px-4">
                  <li>Legendary Rarity</li>
                  <li>Rare Habitat</li>
                  <li>Psychic Type</li>
                  <li>Dragon Type</li>
                  <li>Steel Type</li>
                </ul>
              </div>
            </div>
            <br></br>
            <p>
              New Pokémon can be obtained through the{" "}
              <a href="https://pokezoo.vercel.app/shop">
                <span>shop page</span>
              </a>
              . There are different balls which each contain their own rarity
              chances. Each ball also has a 1 in 4096 chance of giving the user
              a shiny Pokémon.
            </p>
            <br></br>
            <p>
              Additionally, there is daytime and nighttime. Daytime occurs
              between 6am and 6pm EDT and nighttime occurs between 6pm and 6am
              EDT. During daytime, Pokémon with a cave or forest habitat cannot
              be obtained. During nighttime, Pokémon with a grassland habitat
              cannot be obtained.
            </p>
            <br></br>
            <p className="pb-4">
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
