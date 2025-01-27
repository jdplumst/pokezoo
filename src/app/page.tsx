import { type Metadata } from "next";
import { redirect } from "next/navigation";
import SignIn from "./_components/SignIn";
import { auth } from "../server/auth";

export const metadata: Metadata = {
  title: "PokéZoo",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect("/game");
  }

  return (
    <main className="absolute flex h-screen w-screen flex-col items-center bg-[url('../img/pokemon-bg.jpg')] bg-cover pt-10 font-bold fade-in">
      <h1 className="mb-20 text-7xl">PokéZoo</h1>
      <div className="w-1/3 rounded-lg border-4 border-black bg-white py-5 text-center">
        <p>
          <strong className="text-2xl text-black">Login</strong>
        </p>
        <SignIn provider="github" />
        <SignIn provider="twitch" />
        <SignIn provider="google" />
      </div>
      <div className="absolute bottom-2 w-screen text-center text-white">
        Image from{" "}
        <a href="https://unsplash.com/photos/two-red-and-white-balls-sitting-in-the-grass-1fZC2rYbpsU">
          <span className="text-white underline">
            Bahnijit Barman on Unsplash
          </span>
        </a>
      </div>
    </main>
  );
}
