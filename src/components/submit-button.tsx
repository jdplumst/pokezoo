"use client";

import LoadingSpinner from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
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
      variant={props.variant ?? "default"}
      className="w-full"
    >
      {pending ? <LoadingSpinner /> : props.text}
    </Button>
  );
}
