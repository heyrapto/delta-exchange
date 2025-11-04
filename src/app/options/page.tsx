"use client"

import { Exchange } from '@/components/exchange';
import { MobileTradeView } from '@/components/exchange/mobile-trade-view';
import { PageLayout } from '@/components/layout/page-layout';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useUiStore } from '@/store/ui-store';
import React, { useEffect, useState } from 'react'

const OptionsTradePage = () => {
  const [loading, setLoading] = useState(true)
  const activeTab = useUiStore((s) => s.activeTab)

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