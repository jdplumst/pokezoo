"use client";

import { useSidebar } from "@/src/components/ui/sidebar";
import Wildcard from "./Wildcard";
import { useIsLarge } from "../_hooks/use-large";

export default function TopbarContent(props: {
  profile: {
    id: string;
    username: string | null;
    admin: boolean;
    totalYield: number;
    balance: number;
    instanceCount: number;
    commonCards: number;
    rareCards: number;
    epicCards: number;
    legendaryCards: number;
    catchingCharm: number | null;
  };
}) {
  const { open, isMobile } = useSidebar();
  const isLarge = useIsLarge();

  return (
    <div className="flex justify-between px-4">
      <div className="flex flex-col">
        <p>Hi {props.profile.username ?? ""}!</p>
        {isMobile || (open && !isLarge) ? (
          <p>
            {props.profile.instanceCount.toLocaleString()} /{" "}
            {props.profile.catchingCharm ? "3,000 " : "2,000 "}
            Pokémon
          </p>
        ) : (
          <p>
            You have {props.profile.instanceCount.toLocaleString()} /{" "}
            {props.profile.catchingCharm ? "3,000 " : "2,000 "} Pokémon
          </p>
        )}
        {isMobile || (open && !isLarge) ? (
          <p>Balance: P{props.profile.balance.toLocaleString()}</p>
        ) : (
          <p>
            Your current balance is P{props.profile.balance.toLocaleString()}.
          </p>
        )}
        {isMobile || (open && !isLarge) ? (
          <p>Yield: P{props.profile.totalYield.toLocaleString()} </p>
        ) : (
          <p>
            You will receive P{props.profile.totalYield.toLocaleString()} on the
            next payout.
          </p>
        )}
      </div>
      <div className="flex flex-col text-right">
        <div className="flex flex-row items-end justify-end">
          {isMobile || (open && !isLarge) ? (
            <p>{props.profile.commonCards}</p>
          ) : (
            <p>You have {props.profile.commonCards} Common wildcards.</p>
          )}
          <Wildcard
            wildcard="Common"
            height={25}
            width={25}
          />
        </div>
        <div className="flex flex-row items-end justify-end">
          {isMobile || (open && !isLarge) ? (
            <p>{props.profile.rareCards}</p>
          ) : (
            <p>You have {props.profile.rareCards} Rare wildcards.</p>
          )}
          <Wildcard
            wildcard="Rare"
            height={25}
            width={25}
          />
        </div>
        <div className="flex flex-row items-end justify-end">
          {isMobile || (open && !isLarge) ? (
            <p>{props.profile.epicCards}</p>
          ) : (
            <p>You have {props.profile.epicCards} Epic wildcards.</p>
          )}
          <Wildcard
            wildcard="Epic"
            height={25}
            width={25}
          />
        </div>
        <div className="flex flex-row items-end justify-end">
          {isMobile || (open && !isLarge) ? (
            <p>{props.profile.legendaryCards}</p>
          ) : (
            <p>You have {props.profile.legendaryCards} Legendary wildcards.</p>
          )}
          <Wildcard
            wildcard="Legendary"
            height={25}
            width={25}
          />
        </div>
      </div>
    </div>
  );
}
