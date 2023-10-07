interface ITopbar {
  username: string | null;
  balance: number;
  totalYield: number;
  totalCards: number;
  commonCards: number;
  rareCards: number;
  epicCards: number;
  legendaryCards: number;
}

export default function Topbar({
  username,
  balance,
  totalYield,
  totalCards,
  commonCards,
  rareCards,
  epicCards,
  legendaryCards
}: ITopbar) {
  return (
    <nav className="relative w-full py-4 shadow-lg">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <p>Hi {username}!</p>
          <p>You have {totalCards.toLocaleString()} / 2,000 Pokémon.</p>
          <p>Your current balance is P{balance.toLocaleString()}.</p>
          <p>
            You will receive P{totalYield.toLocaleString()} on the next payout.
          </p>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex flex-row items-end justify-end">
            <p>You have {commonCards} Common wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {rareCards} Rare wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {epicCards} Epic wildcards.</p>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
              height={25}
              width={25}
            />
          </div>
          <div className="flex flex-row items-end justify-end">
            <p>You have {legendaryCards} Legendary wildcards.</p>
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
