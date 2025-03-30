import { EventButton } from "~/components/event-button";
import { EventMessage } from "~/components/event-message";
import { getEvent } from "~/server/db/queries/game";

export async function Event() {
  const claimedEvent = await getEvent();

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return (
    <div>
      {/* Christmas Unclaimed */}
      {day >= 25 && month === 12 && !claimedEvent && (
        <EventButton event="Christmas" />
      )}

      {/* Christmas Claimed */}
      {day >= 25 && month === 12 && claimedEvent && (
        <EventMessage event="Christmas" />
      )}

      {/* New Year's Unclaimed */}
      {day <= 7 && month === 1 && !claimedEvent && (
        <EventButton event="New Year's" />
      )}

      {/* New Year's Claimed */}
      {day <= 7 && month === 1 && claimedEvent && (
        <EventMessage event="New Year's" />
      )}

      {/* PokéZoo Day Unclaimed */}
      {day >= 29 && day <= 31 && month === 3 && !claimedEvent && (
        <EventButton event="PokéZoo Day" />
      )}

      {/* PokéZoo Day Claimed */}
      {day >= 29 && day <= 31 && month === 3 && claimedEvent && (
        <EventMessage event="PokéZoo Day" />
      )}
    </div>
  );
}
