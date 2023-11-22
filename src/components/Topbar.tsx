import { User } from "next-auth";

interface ITopbar {
  user: User;
}

export default function Topbar({ user }: ITopbar) {
  return (
    <nav className="relative w-full py-4 shadow-lg">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <p>Hi {user.username}!</p>
          <p>You have {user.instanceCount.toLocaleString()} / 2,000 Pokémon.</p>
          <p>Your current balance is P{user.balance.toLocaleString()}.</p>
          <p>
            You will receive P{user.totalYield.toLocaleString()} on the next
            payout.
          </p>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex flex-row items-end justify-end">
            <p>You have {user.commonCards} Common wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {user.rareCards} Rare wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {user.epicCards} Epic wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {user.legendaryCards} Legendary wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png"
              height={25}
              width={25}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
