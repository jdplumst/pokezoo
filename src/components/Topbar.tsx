import { useContext } from "react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";
import { ThemeContext } from "./ThemeContextProvider";

export default function Topbar() {
  const { time, theme, handleTheme } = useContext(ThemeContext);

  const getProfile = trpc.profile.getProfile.useQuery();

  if (getProfile.isLoading)
    return (
      <div className="flex h-32 items-center justify-center shadow-lg">
        <LoadingSpinner />
      </div>
    );

  return (
    <nav
      className={`relative ${
        getProfile.data?.admin ? `h-56` : `h-32`
      } w-full py-4 shadow-lg`}>
      {getProfile.data?.admin && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-5">
            <button
              onClick={() => handleTheme("day", theme)}
              className="w-40 rounded-lg border-2 border-black bg-yellow-500 p-2 font-bold">
              Day
            </button>
            <button
              onClick={() => handleTheme("night", theme)}
              className="w-40 rounded-lg border-2 border-black bg-purple-500 p-2 font-bold">
              Night
            </button>
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => handleTheme(time, "blue")}
              className="w-40 rounded-lg border-2 border-black bg-blue-500 p-2 font-bold">
              Blue
            </button>
            <button
              onClick={() => handleTheme(time, "purple")}
              className="w-40 rounded-lg border-2 border-black bg-purple-500 p-2 font-bold">
              Purple
            </button>
            <button
              onClick={() => handleTheme(time, "green")}
              className="w-40 rounded-lg border-2 border-black bg-green-500 p-2 font-bold">
              Green
            </button>
            <button
              onClick={() => handleTheme(time, "orange")}
              className="w-40 rounded-lg border-2 border-black bg-orange-500 p-2 font-bold">
              Orange
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <p>Hi {getProfile.data?.username ?? ""}!</p>
          <p>
            You have {getProfile.data?.instanceCount.toLocaleString()} / 2,000
            Pokémon.
          </p>
          <p>
            Your current balance is P{getProfile.data?.balance.toLocaleString()}
            .
          </p>
          <p>
            You will receive P{getProfile.data?.totalYield.toLocaleString()} on
            the next payout.
          </p>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex flex-row items-end justify-end">
            <p>You have {getProfile.data?.commonCards} Common wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
              alt="common-wildcard"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {getProfile.data?.rareCards} Rare wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
              alt="rare-wildcard"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {getProfile.data?.epicCards} Epic wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
              alt="epic-wildcard"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>
              You have {getProfile.data?.legendaryCards} Legendary wildcards.
            </p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png"
              alt="legendary-wildcard"
              height={25}
              width={25}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
