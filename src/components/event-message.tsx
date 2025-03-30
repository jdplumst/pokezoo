import { type Event } from "~/lib/types";

export function EventMessage(props: { event: Event }) {
  return (
    <div className="pt-4">
      {props.event === "Christmas" && (
        <div className="candy-cane pb-4 text-center text-7xl">
          Merry Christmas!
        </div>
      )}

      {props.event === "New Year's" && (
        <div className="new-year pb-4 text-center text-7xl">
          Happy New Year!
        </div>
      )}

      {props.event === "PokéZoo Day" && (
        <>
          <div
            className="pokezoo pb-4 text-center text-7xl"
            data-text="Happy PokéZoo Day!"
          >
            <span style={{ "--i": 1 } as React.CSSProperties}>H</span>
            <span style={{ "--i": 2 } as React.CSSProperties}>a</span>
            <span style={{ "--i": 3 } as React.CSSProperties}>p</span>
            <span style={{ "--i": 4 } as React.CSSProperties}>p</span>
            <span style={{ "--i": 5 } as React.CSSProperties}>y</span>
            <span style={{ "--i": 6 } as React.CSSProperties} className="ml-4">
              P
            </span>
            <span style={{ "--i": 7 } as React.CSSProperties}>o</span>
            <span style={{ "--i": 8 } as React.CSSProperties}>k</span>
            <span style={{ "--i": 9 } as React.CSSProperties}>é</span>
            <span style={{ "--i": 10 } as React.CSSProperties}>Z</span>
            <span style={{ "--i": 11 } as React.CSSProperties}>o</span>
            <span style={{ "--i": 12 } as React.CSSProperties}>o</span>
            <span style={{ "--i": 13 } as React.CSSProperties} className="ml-4">
              D
            </span>
            <span style={{ "--i": 14 } as React.CSSProperties}>a</span>
            <span style={{ "--i": 15 } as React.CSSProperties}>y</span>
            <span style={{ "--i": 16 } as React.CSSProperties}>!</span>
          </div>
        </>
      )}
    </div>
  );
}
