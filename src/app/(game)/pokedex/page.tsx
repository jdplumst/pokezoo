import { isAuthed } from "~/server/db/queries/auth";
import { type Metadata } from "next";
import PokedexGrid from "~/components/pokedex-grid";

export const metadata: Metadata = {
  title: "PokéZoo - Pokédex",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Pokedex() {
  await isAuthed();

  return (
    <div className="flex flex-col gap-4 p-8">
      <PokedexGrid />
    </div>
  );
}
