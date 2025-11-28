"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "../ThemeProvider";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as any}
      className="toaster group"
      dir="rtl"
      toastOptions={{
        classNames: {
          toast: "glass-card border-0",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

export default Toaster;
