import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStorage } from "~/server/db/queries/storage";
import { StorageGrid } from "~/components/storage-grid";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "PokéZoo - Storage",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function StoragePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log("here!");
  const { id } = await params;
  const idInt = parseInt(id);
  if (isNaN(idInt) || idInt < 1 || idInt > 8) {
    notFound();
  }

  const nextPage = id === "8" ? 1 : parseInt(id) + 1;
  const prevPage = id === "1" ? 8 : parseInt(id) - 1;

  const pokemon = await getStorage(idInt);

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Pokémon Storage System
        </h1>

        <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          {/* Box header */}
          <div className="flex items-center justify-between bg-gray-700 p-4">
            <Link href={`/storage/${prevPage}`}>
              <button className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500">
                <ChevronLeft size={20} />
              </button>
            </Link>

            <div className="flex items-center text-white">Box {id}</div>

            <Link href={`/storage/${nextPage}`}>
              <button className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500">
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>

          {/* Box content */}
          <div
            className="relative p-6"
            style={{
              // backgroundImage: `url(${currentBox.wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Semi-transparent overlay for better visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Pokemon grid */}
            <StorageGrid pokemon={pokemon} />

            {/* Box controls */}
            <div className="bg-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <span className="text-gray-300">Box {id} of 8</span>
                </div>

                {/* <div className="flex space-x-2">
                <select
                  className="rounded-md bg-gray-600 px-3 py-1 text-sm text-white"
                  value={
                    wallpapers.find((w) => w.src === currentBox.wallpaper)
                      ?.id || 1
                  }
                  onChange={(e) => changeWallpaper(Number(e.target.value))}
                >
                  {wallpapers.map((wallpaper) => (
                    <option key={wallpaper.id} value={wallpaper.id}>
                      {wallpaper.name}
                    </option>
                  ))}
                </select>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
