"use client";

import { Button } from "@/src/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton(props: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {props.text}
    </Button>
  );
}
