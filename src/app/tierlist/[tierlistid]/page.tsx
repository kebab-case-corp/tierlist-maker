"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const path = usePathname();
  return <div>{path}</div>;
}

export default Page;
