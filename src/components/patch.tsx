import { Separator } from "~/components/ui/separator";
import { type ReactNode } from "react";

export default function Patch(props: {
  patch: string;
  date: string;
  children: ReactNode;
}) {
  return (
    <>
      <Separator className="mb-4" />
      <section className="pb-4">
        <h3 className="py-4 text-3xl font-semibold">
          {props.patch} ({props.date})
        </h3>
        <Separator className="mb-4" />
        {props.children}
      </section>
    </>
  );
}
