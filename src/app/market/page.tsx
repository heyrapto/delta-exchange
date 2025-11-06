"use client"

import { PageLayout } from '@/components/layout/page-layout'
import { PromotionalCards } from '@/components/ui/promotional-cards'
import { MarketsTable } from '@/components/ui/futures-table'

const MarketPage = () => {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Promotional Cards Section */}
        <PromotionalCards />

        {/* Futures Table Section */}
        <div className="flex-1">
          <MarketsTable />
        </div>
    </div>
    </PageLayout>
  )
}

export default MarketPage