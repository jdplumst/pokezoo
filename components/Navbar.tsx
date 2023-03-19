import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light relative flex w-full flex-wrap items-center justify-around py-4 font-bold shadow-lg">
      <div className="w-24"></div>
      <h1 className="text-4xl">PokéZoo</h1>
      <button
        onClick={() => signOut()}
        className="w-24 rounded-lg border-2 border-black bg-slate-400 p-2 font-bold hover:bg-slate-500">
        Sign Out
      </button>
    </nav>
  );
}
