"use client";

import { useSidebar } from "~/components/ui/sidebar";
import React from "react";

export default function ShopGrid(props: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex items-center justify-center">
      <div
        className={`grid ${open ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` : `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`} gap-10`}
      >
        {props.children}
      </div>
    </div>
  );
}
