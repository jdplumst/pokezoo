import { User } from "next-auth";

interface ITopbar {
  user: User;
  balance: number;
  totalYield: number;
  totalCards: number;
}

export default function Topbar({
  user,
  balance,
  totalYield,
  totalCards
}: ITopbar) {
  return (
    <nav className="relative w-full py-4 shadow-lg">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <p>Hi {user.username}!</p>
          <p>You have {totalCards.toLocaleString()} / 2,000 Pokémon.</p>
        </div>
        <div className="flex flex-col text-right">
          <p>Your current balance is P{balance.toLocaleString()}.</p>
          <p>
            You will receive P{totalYield.toLocaleString()} on the next payout.
          </p>
        </div>
      </div>
    </nav>
  );
}
