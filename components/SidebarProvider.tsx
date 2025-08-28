"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}>({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
});

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarProvider"
    );
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}