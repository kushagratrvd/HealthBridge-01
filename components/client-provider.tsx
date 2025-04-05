"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/context/app-context"

export function ClientProvider({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}

