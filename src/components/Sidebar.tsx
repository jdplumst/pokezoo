import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { GoMarkGithub, GoSignOut } from "react-icons/go";

interface ISidebar {
  children: ReactNode;
  page: string;
}

export default function Sidebar({ children, page }: ISidebar) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div
        className={`${
          open ? `w-1/5` : `w-1/12`
        } sidebar sticky top-0 flex h-screen flex-col p-4 shadow-lg`}>
        <div className="flex items-center pb-10">
          <h1
            className={`${
              open ? `block w-1/5` : `hidden w-1/12`
            } text-4xl font-bold`}>
            PokéZoo
          </h1>
          <AiOutlineMenu
            size={30}
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            className={`${
              open ? `ml-auto` : `ml-auto mr-auto`
            } hover:cursor-pointer`}
          />
        </div>
        <Link href="/game">
          <div
            className={`${
              page === "Game" && `bg-white`
            } mb-4 flex w-full items-center`}>
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              alt="game"
              width={50}
              height={50}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Game
            </h2>
          </div>
        </Link>
        <Link href="/shop">
          <div
            className={`${
              page === "Shop" && `bg-white`
            } mb-4 flex w-full items-center`}>
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png"
              alt="shop"
              width={50}
              height={50}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Shop
            </h2>
          </div>
        </Link>
        <Link href="/patch-notes">
          <div
            className={`${
              page === "PatchNotes" && `bg-white`
            } mb-4 flex w-full items-center`}>
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rule-book.png"
              alt="patch_notes"
              width={50}
              height={50}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Patch Notes
            </h2>
          </div>
        </Link>
        <div className="mt-auto">
          <a href="https://pokeapi.co/" target="_blank">
            <div className="flex items-center pb-4">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="pokeapi"
                width={50}
                height={50}
                className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
              />
              <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
                PokéAPI
              </h2>
            </div>
          </a>
          <a href="https://github.com/jdplumst/pokezoo" target="_blank">
            <div className="flex items-center pb-6">
              <GoMarkGithub
                size={30}
                className={`${open ? `ml-3` : `ml-auto mr-auto`} pixelated`}
              />
              <h2
                className={`${
                  open ? `block pl-2` : `hidden`
                } text-2xl font-bold`}>
                GitHub
              </h2>
            </div>
          </a>
          <button
            onClick={() => signOut()}
            className={`${
              open ? `` : `ml-auto mr-auto`
            } pixelated flex items-center`}>
            <GoSignOut
              size={30}
              className={`${open ? `ml-3` : `ml-auto mr-auto`} pixelated mt-1`}
            />
            <h2
              className={`${
                open ? `block` : `hidden`
              } pl-2 text-2xl font-bold`}>
              Sign Out
            </h2>
          </button>
        </div>
      </div>
      <div className={`${open ? `w-4/5` : `w-11/12`}`}>{children}</div>
    </div>
  );
}
