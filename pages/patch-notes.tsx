import Navbar from "@/components/Navbar";
import Head from "next/head";

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
        <Navbar />
        <h1 className="p-4 text-7xl font-bold">Patch Notes</h1>
        <h3 className="p-4 text-4xl font-bold">1.0 (April 5, 2023)</h3>
        <hr className="mx-4 border-black"></hr>
        <p className="p-4">
          The base game is now released! Start creating your collection on your
          quest to complete the Pokédex!
        </p>
        <p className="px-4">
          Choose your starter between Bulbasaur, Charmander, and Squirtle, and
          try to collect all 151 Pokémon from the Kanto Pokédex!
        </p>
      </div>
    </>
  );
}
