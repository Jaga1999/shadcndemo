"use client";

import React from "react";

export const VersionContext = React.createContext<{
  version: string;
  setVersion: (version: string) => void;
}>({
  version: "1.0",
  setVersion: () => {},
});

export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = React.useState("1.0");

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}