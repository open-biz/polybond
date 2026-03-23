"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SafeContextType {
  safeAddress: string | null;
  setSafeAddress: (address: string | null) => void;
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export function SafeProvider({ children }: { children: ReactNode }) {
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  
  return (
    <SafeContext.Provider value={{ safeAddress, setSafeAddress }}>
      {children}
    </SafeContext.Provider>
  );
}

export function useSafe() {
  const context = useContext(SafeContext);
  if (context === undefined) {
    throw new Error("useSafe must be used within a SafeProvider");
  }
  return context;
}
