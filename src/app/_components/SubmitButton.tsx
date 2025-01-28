"use client";

import { Button } from "@/src/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton(props: {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant={props.variant || "default"}
    >
      {props.text}
    </Button>
  );
}
