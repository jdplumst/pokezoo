import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../server/db";
import Card from "../components/Card";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import DrowpdownItem from "../components/DropdownItem";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }
  const user = session.user;
  const species = await prisma.species.findMany();
  const instances = await prisma.instance.findMany({
    where: { userId: user.id },
    distinct: ["speciesId"]
  });
  const parsedInstances: typeof instances = JSON.parse(
    JSON.stringify(instances)
  );

  return {
    props: {
      user,
      species,
      instances: parsedInstances
    }
  };
};

interface Shiny {
  "Not Shiny": boolean;
  "Shiny": boolean;
}

interface Region {
  Kanto: boolean;
  Johto: boolean;
  Hoenn: boolean;
}

interface Rarity {
  Common: boolean;
  Rare: boolean;
  Epic: boolean;
  Legendary: boolean;
}

interface Type {
  normal: boolean;
  grass: boolean;
  bug: boolean;
  fire: boolean;
  electric: boolean;
  ground: boolean;
  water: boolean;
  fighting: boolean;
  poison: boolean;
  rock: boolean;
  ice: boolean;
  ghost: boolean;
  psychic: boolean;
  fairy: boolean;
  dark: boolean;
  dragon: boolean;
  steel: boolean;
  flying: boolean;
}

interface Habitat {
  "grassland": boolean;
  "forest": boolean;
  "waters-edge": boolean;
  "sea": boolean;
  "cave": boolean;
  "mountain": boolean;
  "rough-terrain": boolean;
  "urban": boolean;
  "rare": boolean;
}

export default function Pokedex({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [time, setTime] = useState<Time>("night");
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState(species.filter((s) => !s.shiny));
  const [shiny, setShiny] = useState<Shiny>({
    "Not Shiny": true,
    "Shiny": false
  });
  const [region, setRegion] = useState<Region>({
    Kanto: true,
    Johto: true,
    Hoenn: true
  });
  const [rarity, setRarity] = useState<Rarity>({
    Common: true,
    Rare: true,
    Epic: true,
    Legendary: true
  });
  const [type, setType] = useState<Type>({
    normal: true,
    grass: true,
    bug: true,
    fire: true,
    electric: true,
    ground: true,
    water: true,
    fighting: true,
    poison: true,
    rock: true,
    ice: true,
    ghost: true,
    psychic: true,
    fairy: true,
    dark: true,
    dragon: true,
    steel: true,
    flying: true
  });
  const [habitat, setHabitat] = useState<Habitat>({
    "grassland": true,
    "forest": true,
    "waters-edge": true,
    "sea": true,
    "cave": true,
    "mountain": true,
    "rough-terrain": true,
    "urban": true,
    "rare": true
  });

  // Dropdown open states
  const [shinyOpen, setShinyOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [rarityOpen, setRarityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [habitatOpen, setHabitatOpen] = useState(false);

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

  // Handle Shiny State
  const handleShiny = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Not Shiny") {
      setShiny({ "Shiny": !checked, "Not Shiny": checked });
    } else if (label === "Shiny") {
      setShiny({ "Shiny": checked, "Not Shiny": !checked });
    }
  };

  // Handle Region State
  const handleRegion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Kanto") {
      setRegion({ ...region, Kanto: checked });
    } else if (label === "Johto") {
      setRegion({ ...region, Johto: checked });
    } else if (label === "Hoenn") {
      setRegion({ ...region, Hoenn: checked });
    }
  };

  // Handle Rarity State
  const handleRarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "Common") {
      setRarity({ ...rarity, Common: checked });
    } else if (label === "Rare") {
      setRarity({ ...rarity, Rare: checked });
    } else if (label === "Epic") {
      setRarity({ ...rarity, Epic: checked });
    } else if (label === "Legendary") {
      setRarity({ ...rarity, Legendary: checked });
    }
  };

  // Handle Type State
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "normal") {
      setType({ ...type, normal: checked });
    } else if (label === "grass") {
      setType({ ...type, grass: checked });
    } else if (label === "bug") {
      setType({ ...type, bug: checked });
    } else if (label === "fire") {
      setType({ ...type, fire: checked });
    } else if (label === "electric") {
      setType({ ...type, electric: checked });
    } else if (label === "ground") {
      setType({ ...type, ground: checked });
    } else if (label === "water") {
      setType({ ...type, water: checked });
    } else if (label === "fighting") {
      setType({ ...type, fighting: checked });
    } else if (label === "poison") {
      setType({ ...type, poison: checked });
    } else if (label === "rock") {
      setType({ ...type, rock: checked });
    } else if (label === "ice") {
      setType({ ...type, ice: checked });
    } else if (label === "ghost") {
      setType({ ...type, ghost: checked });
    } else if (label === "psychic") {
      setType({ ...type, psychic: checked });
    } else if (label === "fairy") {
      setType({ ...type, fairy: checked });
    } else if (label === "dark") {
      setType({ ...type, dark: checked });
    } else if (label === "dragon") {
      setType({ ...type, dragon: checked });
    } else if (label === "steel") {
      setType({ ...type, steel: checked });
    } else if (label === "flying") {
      setType({ ...type, flying: checked });
    }
  };

  // Handle Habitat State
  const handleHabitat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.labels![0].htmlFor;
    const checked = e.target.checked;
    if (label === "grassland") {
      setHabitat({ ...habitat, grassland: checked });
    } else if (label === "forest") {
      setHabitat({ ...habitat, forest: checked });
    } else if (label === "waters-edge") {
      setHabitat({ ...habitat, "waters-edge": checked });
    } else if (label === "sea") {
      setHabitat({ ...habitat, sea: checked });
    } else if (label === "cave") {
      setHabitat({ ...habitat, cave: checked });
    } else if (label === "mountain") {
      setHabitat({ ...habitat, mountain: checked });
    } else if (label === "rough-terrain") {
      setHabitat({ ...habitat, "rough-terrain": checked });
    } else if (label === "urban") {
      setHabitat({ ...habitat, urban: checked });
    } else if (label === "rare") {
      setHabitat({ ...habitat, rare: checked });
    }
  };

  const filterSpecies = () => {
    // Filter based on shiny
    if (shiny.Shiny) {
      setCards(species.filter((s) => s.shiny));
    } else if (shiny["Not Shiny"]) {
      setCards(species.filter((s) => !s.shiny));
    }

    // Filter based on region
    setCards((p) =>
      p.filter((s) => {
        let generations = [];
        if (region.Kanto) {
          generations.push(1);
        }
        if (region.Johto) {
          generations.push(2);
        }
        if (region.Hoenn) {
          generations.push(3);
        }
        return generations.includes(s.generation);
      })
    );

    // Filter based on rarity
    setCards((p) =>
      p.filter((s) => {
        let rarities = [];
        if (rarity.Common) {
          rarities.push("Common");
        }
        if (rarity.Rare) {
          rarities.push("Rare");
        }
        if (rarity.Epic) {
          rarities.push("Epic");
        }
        if (rarity.Legendary) {
          rarities.push("Legendary");
        }
        return rarities.includes(s.rarity);
      })
    );

    // Filter based on type
    setCards((p) =>
      p.filter((s) => {
        let types = [];
        if (type.normal) {
          types.push("normal");
        }
        if (type.grass) {
          types.push("grass");
        }
        if (type.bug) {
          types.push("bug");
        }
        if (type.fire) {
          types.push("fire");
        }
        if (type.electric) {
          types.push("electric");
        }
        if (type.ground) {
          types.push("ground");
        }
        if (type.water) {
          types.push("water");
        }
        if (type.fighting) {
          types.push("fighting");
        }
        if (type.poison) {
          types.push("poison");
        }
        if (type.rock) {
          types.push("rock");
        }
        if (type.ice) {
          types.push("ice");
        }
        if (type.ghost) {
          types.push("ghost");
        }
        if (type.psychic) {
          types.push("psychic");
        }
        if (type.fairy) {
          types.push("fairy");
        }
        if (type.dark) {
          types.push("dark");
        }
        if (type.dragon) {
          types.push("dragon");
        }
        if (type.steel) {
          types.push("steel");
        }
        if (type.flying) {
          types.push("flying");
        }
        return types.includes(s.typeOne) || types.includes(s.typeTwo!);
      })
    );

    // Filter based on habitat
    setCards((p) =>
      p.filter((s) => {
        let habitats = [];
        if (habitat.grassland) {
          habitats.push("grassland");
        }
        if (habitat.forest) {
          habitats.push("forest");
        }
        if (habitat["waters-edge"]) {
          habitats.push("waters-edge");
        }
        if (habitat.sea) {
          habitats.push("sea");
        }
        if (habitat.cave) {
          habitats.push("cave");
        }
        if (habitat.mountain) {
          habitats.push("mountain");
        }
        if (habitat["rough-terrain"]) {
          habitats.push("rough-terrain");
        }
        if (habitat.urban) {
          habitats.push("urban");
        }
        if (habitat.rare) {
          habitats.push("rare");
        }
        return habitats.includes(s.habitat);
      })
    );
  };

  useEffect(() => {
    filterSpecies();
  }, [shiny, region, rarity, type, habitat]);

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Pokédex</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Pokedex">
          <main className="p-4">
            {user?.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <div className="flex justify-center gap-5">
              <div className="w-48">
                <button
                  onClick={() => setShinyOpen((p) => !p)}
                  className="w-full border-2 border-black bg-purple-btn-unfocus p-2 font-bold">
                  Select Shiny
                </button>
                {shinyOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Not Shiny"}
                        fn={handleShiny}
                        checked={shiny["Not Shiny"]}
                        colour="purple"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Shiny"
                        fn={handleShiny}
                        checked={shiny.Shiny}
                        colour="purple"
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() => setRegionOpen((p) => !p)}
                  className="w-full border-2 border-black bg-green-btn-unfocus p-2 font-bold">
                  Select Region
                </button>
                {regionOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Kanto"}
                        fn={handleRegion}
                        checked={region.Kanto}
                        colour={"green"}
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Johto"
                        fn={handleRegion}
                        checked={region.Johto}
                        colour={"green"}
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Hoenn"
                        fn={handleRegion}
                        checked={region.Hoenn}
                        colour={"green"}
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() => setRarityOpen((p) => !p)}
                  className="w-full border-2 border-black bg-orange-btn-unfocus p-2 font-bold">
                  Select Rarity
                </button>
                {rarityOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"Common"}
                        fn={handleRarity}
                        checked={rarity.Common}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Rare"
                        fn={handleRarity}
                        checked={rarity.Rare}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Epic"
                        fn={handleRarity}
                        checked={rarity.Epic}
                        colour="orange"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="Legendary"
                        fn={handleRarity}
                        checked={rarity.Legendary}
                        colour="orange"
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() => setTypeOpen((p) => !p)}
                  className="w-full border-2 border-black bg-blue-btn-unfocus p-2 font-bold">
                  Select Type
                </button>
                {typeOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"normal"}
                        fn={handleType}
                        checked={type.normal}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="grass"
                        fn={handleType}
                        checked={type.grass}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="bug"
                        fn={handleType}
                        checked={type.bug}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="fire"
                        fn={handleType}
                        checked={type.fire}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="electric"
                        fn={handleType}
                        checked={type.electric}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="ground"
                        fn={handleType}
                        checked={type.ground}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="water"
                        fn={handleType}
                        checked={type.water}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="fighting"
                        fn={handleType}
                        checked={type.fighting}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="poison"
                        fn={handleType}
                        checked={type.poison}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="rock"
                        fn={handleType}
                        checked={type.rock}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="ice"
                        fn={handleType}
                        checked={type.ice}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="ghost"
                        fn={handleType}
                        checked={type.ghost}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="psychic"
                        fn={handleType}
                        checked={type.psychic}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="fairy"
                        fn={handleType}
                        checked={type.fairy}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="dark"
                        fn={handleType}
                        checked={type.dark}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="dragon"
                        fn={handleType}
                        checked={type.dragon}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="steel"
                        fn={handleType}
                        checked={type.steel}
                        colour="blue"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="flying"
                        fn={handleType}
                        checked={type.flying}
                        colour="blue"
                      />
                    </li>
                  </ul>
                )}
              </div>
              <div className="w-48">
                <button
                  onClick={() => setHabitatOpen((p) => !p)}
                  className="w-full border-2 border-black bg-lime-btn-unfocus p-2 font-bold">
                  Select Habitat
                </button>
                {habitatOpen && (
                  <ul>
                    <li>
                      <DrowpdownItem
                        label={"grassland"}
                        fn={handleHabitat}
                        checked={habitat.grassland}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="forest"
                        fn={handleHabitat}
                        checked={habitat.forest}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="waters-edge"
                        fn={handleHabitat}
                        checked={habitat["waters-edge"]}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="sea"
                        fn={handleHabitat}
                        checked={habitat.sea}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="cave"
                        fn={handleHabitat}
                        checked={habitat.cave}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="mountain"
                        fn={handleHabitat}
                        checked={habitat.mountain}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="rough-terrain"
                        fn={handleHabitat}
                        checked={habitat["rough-terrain"]}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="urban"
                        fn={handleHabitat}
                        checked={habitat.urban}
                        colour="lime"
                      />
                    </li>
                    <li>
                      <DrowpdownItem
                        label="rare"
                        fn={handleHabitat}
                        checked={habitat.rare}
                        colour="lime"
                      />
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="cards grid justify-center gap-5 pt-5">
              {cards.map((c) => (
                <Card
                  key={c.id}
                  species={c}
                  caught={instances.some((i) => i.speciesId === c.id)}
                />
              ))}
            </div>
          </main>
        </Sidebar>
      </div>
    </>
  );
}
