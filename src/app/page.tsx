"use client"

import { useEffect, useState } from "react"
import { Exchange } from "@/components/exchange"
import { Footer } from "@/components/layout/footer"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { BottomNavigation } from "@/components/layout/bottom-nav"
import { MobileTradeView } from "@/components/exchange/mobile-trade-view"
import { PageLayout } from "@/components/layout/page-layout"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")

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
      
      <Footer />
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </PageLayout>
  )
}