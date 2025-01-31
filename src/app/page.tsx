import { type Metadata } from "next";
import BackgroundEffects from "./_components/BackgroundEffect";
import { auth, signIn } from "../server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PokéZoo",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/game");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4 text-white">
      <BackgroundEffects />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 flex items-center justify-center text-6xl font-bold">
          PokéZoo
        </h1>
        <p className="mb-8 text-xl leading-relaxed">
          Embark on an epic journey in your virtual Pokémon sanctuary!
          <span className="bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text font-semibold text-transparent">
            {" "}
            Collect
          </span>{" "}
          rare Pokémon,
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text font-semibold text-transparent">
            {" "}
            earn points
          </span>
          , and
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text font-semibold text-transparent">
            {" "}
            complete
          </span>{" "}
          your Pokédex. Discover new species, level up your collection, and
          become the ultimate Pokémon Master in this thrilling, interactive
          experience!
        </p>
        <form
          action={async () => {
            "use server";

            await signIn();
          }}
          className="inline-block transform rounded-full bg-violet-500 px-8 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-violet-600"
        >
          <button>Get Started</button>
        </form>
      </div>
    </main>
  );
}
