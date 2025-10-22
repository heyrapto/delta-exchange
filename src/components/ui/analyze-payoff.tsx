"use client"

import { useState } from "react"
import { useStrategyStore } from "@/store/strategy-store"

interface AnalyzePayoffProps {
  onBack: () => void
}

export const AnalyzePayoff = ({ onBack }: AnalyzePayoffProps) => {
  const { selectedOrders } = useStrategyStore()
  const [targetPrice, setTargetPrice] = useState(3798)
  const [targetDate, setTargetDate] = useState("23 Oct 2025, 01:00pm IST")

  const calculateMaxProfit = () => {
    // Simple calculation - in reality this would be more complex
    return "Unlimited"
  }

  const calculateMaxLoss = () => {
    // Simple calculation based on selected orders
    const totalCost = selectedOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
    return `-${totalCost.toFixed(2)} USD`
  }

  const calculateBreakeven = () => {
    // Simple breakeven calculation
    return "3802.90"
  }

  return (
    <div className="h-[700px] w-full flex flex-col" style={{ color: 'var(--text-secondary)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:text-blue-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Basket Analyze
        </button>
      </div>

      {/* Key Metrics */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-green-400">Max Profit</span>
            <span className="text-green-400 font-medium">{calculateMaxProfit()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">Max Loss</span>
            <span className="text-red-400 font-medium">{calculateMaxLoss()}</span>
          </div>
          <div className="flex justify-between">
            <span>Reward / Risk</span>
            <span>NA</span>
          </div>
          <div className="flex justify-between">
            <span>Breakeven</span>
            <span className="font-medium">{calculateBreakeven()}</span>
          </div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <button className="px-4 py-2 text-sm border-b-2 border-orange-500" style={{ color: 'var(--text-primary)' }}>
          PnL Chart
        </button>
        <button className="px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          PnL Table
        </button>
        <button className="px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Greeks Table
        </button>
      </div>

      {/* PnL Chart */}
      <div className="flex-1 p-4">
        <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center relative" style={{ backgroundColor: 'var(--trading-bg)' }}>
          {/* Chart Placeholder */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>PnL Chart</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Chart visualization would be implemented here
            </p>
            <div className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <p>Current Price: {targetPrice}</p>
              <p>Projected Loss: -0.10 (0%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--trading-border)' }}>
        <div className="grid grid-cols-2 gap-4">
          {/* ETH Target Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">ETH Target Price</label>
              <button className="text-xs text-blue-400 hover:text-blue-300">Reset</button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="flex-1 px-3 py-2 border rounded text-sm"
                style={{ borderColor: 'var(--trading-border)' }}
              />
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-1/2 h-full bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Target Date</label>
              <button className="text-xs text-blue-400 hover:text-blue-300">Reset</button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-sm"
                style={{ borderColor: 'var(--trading-border)' }}
              />
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-3/4 h-full bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>0 days to Expiry</p>
          </div>
        </div>
      </div>
    </div>
  )
}
