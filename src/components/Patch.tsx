import { type ReactNode } from "react";

interface IPatchProps {
  patch: string;
  date: string;
  children: ReactNode;
}

export default function Patch({ patch, date, children }: IPatchProps) {
  return (
    <>
      <hr className="border-black pb-4"></hr>
      <section className="pb-4">
        <h3 className="p-4 text-4xl font-bold">
          {patch} ({date})
        </h3>
        <hr className="border-black pb-4"></hr>
        {children}
      </section>
    </>
  );
}
