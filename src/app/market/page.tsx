"use client"

import { PageLayout } from '@/components/layout/page-layout';
import { LoadingScreen } from '@/components/ui/loading-screen';
import React, { useEffect, useState } from 'react'

const MarketPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />
  
  return (
    <PageLayout>
      <div>
      </div>
    </PageLayout>
  )
}

export default MarketPage;