"use client"

import { create } from "zustand"

export type ActiveTab = "trade" | "chart"

interface UiState {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: "chart",
  setActiveTab: (tab) => set({ activeTab: tab }),
}))


