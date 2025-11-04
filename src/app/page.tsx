"use client"

import { useEffect, useState } from "react"
import { Exchange } from "@/components/exchange"
import { Footer } from "@/components/layout/footer"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { BottomNavigation } from "@/components/layout/bottom-nav"
import { MobileTradeView } from "@/components/exchange/mobile-trade-view"
import { PageLayout } from "@/components/layout/page-layout"
import { useUiStore } from "@/store/ui-store"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const activeTab = useUiStore((s) => s.activeTab)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <PageLayout>
      {activeTab === "trade" ? (
        <MobileTradeView />
      ) : (
        <Exchange />
      )}
    </PageLayout>
  )
}