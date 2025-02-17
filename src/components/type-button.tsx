import { Button } from "~/components/ui/button";
import { type SpeciesType } from "~/lib/types";

export default function TypeButton(props: { type: SpeciesType }) {
  function getTypeColor(type: SpeciesType): string {
    switch (type) {
      case "Normal":
        return "bg-normal";
      case "Grass":
        return "bg-grass";
      case "Bug":
        return "bg-bug";
      case "Fire":
        return "bg-fire";
      case "Electric":
        return "bg-electric";
      case "Ground":
        return "bg-ground";
      case "Water":
        return "bg-water";
      case "Fighting":
        return "bg-fighting";
      case "Poison":
        return "bg-poison";
      case "Rock":
        return "bg-rock";
      case "Ice":
        return "bg-ice";
      case "Ghost":
        return "bg-ghost";
      case "Psychic":
        return "bg-psychic";
      case "Fairy":
        return "bg-psychic";
      case "Dark":
        return "bg-dark";
      case "Dragon":
        return "bg-dragon";
      case "Steel":
        return "bg-steel";
      case "Flying":
        return "bg-flying";
      default:
        return "bg-gray-500";
    }
  }
  return (
    <Button className={`pointer-events-none ${getTypeColor(props.type)}`}>
      {props.type}
    </Button>
  );
}
