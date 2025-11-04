"use client"

import { Exchange } from '@/components/exchange';
import { MobileTradeView } from '@/components/exchange/mobile-trade-view';
import { PageLayout } from '@/components/layout/page-layout';
import { LoadingScreen } from '@/components/ui/loading-screen';
import React, { useEffect, useState } from 'react'

const OptionsTradePage = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />
  
  return (
    <PageLayout>
      <div>
      {activeTab === "trade" ? (
        <MobileTradeView />
      ) : (
        <Exchange />
      )}
      </div>
    </PageLayout>
  )
}

export default OptionsTradePage;