import { type ReactNode } from "react";

export default function Patch(props: {
  patch: string;
  date: string;
  children: ReactNode;
}) {
  return (
    <>
      <hr className="border-black pb-4"></hr>
      <section className="pb-4">
        <h3 className="p-4 text-3xl font-semibold">
          {props.patch} ({props.date})
        </h3>
        <hr className="border-black pb-4"></hr>
        {props.children}
      </section>
    </>
  );
}
