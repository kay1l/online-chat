
"use client";

import { useEffect } from "react";
import { initAuth } from "@/lib/initAuth";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initAuth(); 
  }, []);

  return <>{children}</>;
};