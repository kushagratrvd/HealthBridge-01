"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/context/app-context"

export function AppProviderWrapper({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}

