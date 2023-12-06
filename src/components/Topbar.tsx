import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";

export default function Topbar() {
  const getProfile = trpc.profile.getProfile.useQuery();

  if (getProfile.isLoading)
    return (
      <div className="flex h-32 items-center justify-center shadow-lg">
        <LoadingSpinner />
      </div>
    );

  return (
    <nav className="relative h-32 w-full py-4 shadow-lg">
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
