import { type ReactNode } from "react";

interface IModal {
  size: "Small" | "Large";
  children: ReactNode;
}

export default function Modal({ size, children }: IModal) {
  return (
    <div className="fixed top-0 z-10 flex min-h-screen w-full items-center justify-center overflow-auto bg-white/50">
      <div
        className={`absolute ${
          size === "Large" && `top-0`
        } z-10 flex min-w-[25%] flex-col items-center justify-center bg-black p-4 text-white opacity-100`}>
        {children}
      </div>
    </div>
  );
}
