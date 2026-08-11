"use client";

import { useMemo } from "react";

export function useDemoAuth() {
  return useMemo(
    () => ({
      isAuthenticated: true,
      user: {
        firstName: "Diogo",
        email: "diogo@norteai.pt",
      },
    }),
    [],
  );
}
