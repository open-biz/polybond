"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";

interface SafeContextType {
  safeAddress: string | null;
  setSafeAddress: (address: string | null) => void;
  isLoadingSafe: boolean;
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export function SafeProvider({ children }: { children: ReactNode }) {
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [isLoadingSafe, setIsLoadingSafe] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    async function checkExistingSafes() {
      if (!address) {
        setSafeAddress(null);
        return;
      }

      try {
        setIsLoadingSafe(true);
        // Base mainnet Safe Transaction Service
        const response = await fetch(`https://safe-transaction-base.safe.global/api/v1/owners/${address}/safes/`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.safes && data.safes.length > 0) {
            // For simplicity, we just grab the first Safe associated with this EOA
            setSafeAddress(data.safes[0]);
          } else {
            setSafeAddress(null);
          }
        }
      } catch (error) {
        console.error("Error fetching existing safes:", error);
      } finally {
        setIsLoadingSafe(false);
      }
    }

    checkExistingSafes();
  }, [address]);
  
  return (
    <SafeContext.Provider value={{ safeAddress, setSafeAddress, isLoadingSafe }}>
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
