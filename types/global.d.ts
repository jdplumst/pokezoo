export {};

declare global {
  type Time = "day" | "night";

  // const Regions = ["All", "Kanto", "Johto", "Hoenn", "Sinnoh"] as const;
  // type Region = (typeof Regions)[number];

  type Starter = "Grass" | "Fire" | "Water";
}
