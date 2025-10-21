"use client"

import { useEffect, useState } from "react"
import { Exchange } from "@/components/exchange"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Banner } from "@/components/ui/banner"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { BottomNavigation } from "@/components/layout/bottom-nav"
import { MobileTradeView } from "@/components/exchange/mobile-trade-view"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <div className="relative mx-auto w-full xl:max-w-[120rem] min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--page-bg-color)' }}>
      <Banner />
      <Header />
      
      {/* Conditional rendering based on active tab */}
      {activeTab === "trade" ? (
        <MobileTradeView />
      ) : (
        <Exchange />
      )}
      
      <Footer />
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
