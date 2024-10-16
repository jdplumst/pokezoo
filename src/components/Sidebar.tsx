import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { AiOutlineMenu, AiOutlineGithub } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";

interface ISidebar {
  children: ReactNode;
  page:
    | "Game"
    | "Shop"
    | "Quests"
    | "Achievements"
    | "Pokedex"
    | "Trades"
    | "Tutorial"
    | "PatchNotes"
    | "Settings";
}

export default function Sidebar({ children, page }: ISidebar) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <nav
        className={`${
          open ? `w-1/5` : `w-1/12`
        } sidebar sticky top-0 flex h-screen max-h-screen flex-col gap-2 overflow-auto p-4 shadow-lg`}
      >
        <div className="flex items-center pb-10">
          <h1
            className={`${
              open ? `block w-1/5` : `hidden w-1/12`
            } text-4xl font-bold`}
          >
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
              page === "Game" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              alt="game"
              width={45}
              height={45}
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
              page === "Shop" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/coin-case.png"
              alt="shop"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Shop
            </h2>
          </div>
        </Link>
        <Link href="/quests">
          <div
            className={`${
              page === "Quests" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/honor-of-kalos.png"
              alt="shop"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Quests
            </h2>
          </div>
        </Link>
        <Link href="/achievements">
          <div
            className={`${
              page === "Achievements" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/29.png"
              alt="shop"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Achievements
            </h2>
          </div>
        </Link>
        <Link href="/pokedex">
          <div
            className={`${
              page === "Pokedex" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-radar.png"
              alt="pokedex"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Pokédex
            </h2>
          </div>
        </Link>
        <Link href="/trades">
          <div
            className={`${
              page === "Trades" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bloom-mail.png"
              alt="trades"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Trades
            </h2>
          </div>
        </Link>
        <Link href="/tutorial">
          <div
            className={`${
              page === "Tutorial" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wide-lens.png"
              alt="tutorial"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Tutorial
            </h2>
          </div>
        </Link>
        <Link href="/patch-notes">
          <div
            className={`${
              page === "PatchNotes" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pal-pad.png"
              alt="patch_notes"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Patch Notes
            </h2>
          </div>
        </Link>
        <Link href="/settings">
          <div
            className={`${
              page === "Settings" && `bg-sidebar-focus`
            } flex w-full items-center hover:bg-sidebar-unfocus`}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blue-card.png"
              alt="patch_notes"
              width={45}
              height={45}
              className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
            />
            <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
              Settings
            </h2>
          </div>
        </Link>
        <div className="mt-auto flex flex-col gap-2">
          <a
            href="https://pokeapi.co/"
            target="_blank"
          >
            <div className="flex items-center hover:bg-sidebar-unfocus">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="pokeapi"
                width={45}
                height={45}
                className={`${open ? `` : `ml-auto mr-auto`} pixelated`}
              />
              <h2 className={`${open ? `block` : `hidden`} text-2xl font-bold`}>
                PokéAPI
              </h2>
            </div>
          </a>
          <a
            href="https://github.com/jdplumst/pokezoo"
            target="_blank"
          >
            <div className="flex items-center py-2 hover:bg-sidebar-unfocus">
              <AiOutlineGithub
                size={30}
                className={`${open ? `ml-3` : `ml-auto mr-auto`} pixelated`}
              />
              <h2
                className={`${
                  open ? `block pl-2` : `hidden`
                } text-2xl font-bold`}
              >
                GitHub
              </h2>
            </div>
          </a>
          <button
            onClick={() => signOut()}
            className={`${
              open ? `` : `ml-auto mr-auto`
            } pixelated flex w-full items-center py-1 hover:bg-sidebar-unfocus`}
          >
            <GoSignOut
              size={30}
              className={`${open ? `ml-3` : `ml-auto mr-auto`} pixelated mt-1`}
            />
            <h2
              className={`${open ? `block` : `hidden`} pl-2 text-2xl font-bold`}
            >
              Sign Out
            </h2>
          </button>
        </div>
      </nav>
      <div className={`${open ? `w-4/5` : `w-11/12`}`}>{children}</div>
    </div>
  );
}
