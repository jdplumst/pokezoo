import { Button } from "@/components/ui/button";
import { type ZodSpeciesType } from "@/utils/zod";
import { type z } from "zod";

export default function TypeButton(props: {
  type: z.infer<typeof ZodSpeciesType>;
}) {
  return (
    <Button
      className={`pointer-events-none ${props.type === `Normal` && `bg-normal`} ${props.type === `Grass` && `bg-grass`} ${props.type === `Bug` && `bg-bug`} ${props.type === `Fire` && `bg-fire`} ${props.type === `Electric` && `bg-electric`} ${props.type === `Ground` && `bg-ground`} ${props.type === `Water` && `bg-water`} ${props.type === `Fighting` && `bg-fighting`} ${props.type === `Poison` && `bg-poison`} ${props.type === `Rock` && `bg-rock`} ${props.type === `Ice` && `bg-ice`} ${props.type === `Ghost` && `bg-ghost`} ${props.type === `Psychic` && `bg-psychic`} ${props.type === `Fairy` && `bg-fairy`} ${props.type === `Dark` && `bg-dark`} ${props.type === `Dragon` && `bg-dragon`} ${props.type === `Steel` && `bg-steel`} ${props.type === `Flying` && `bg-flying`}`}
    >
      {props.type}
    </Button>
  );
}
