"use client"

import { PageLayout } from '@/components/layout/page-layout'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PromotionalCards } from '@/components/ui/promotional-cards'
import { FuturesTable } from '@/components/ui/futures-table'
import { useEffect, useState } from 'react'

const MarketPage = () => {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Promotional Cards Section */}
        <PromotionalCards />

        {/* Futures Table Section */}
        <div className="flex-1">
          <FuturesTable />
        </div>
      </div>
    </PageLayout>
  )
}

export default MarketPage