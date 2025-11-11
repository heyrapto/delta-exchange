"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts"
import { useState } from "react"
import { Slider } from "../reusable/slider"

interface DepthChartProps {
  currentPrice: number
  buyOrders: Array<{ price: number; size: number; total: number }>
  sellOrders: Array<{ price: number; size: number; total: number }>
}

export const DepthChart = ({ currentPrice, buyOrders, sellOrders }: DepthChartProps) => {
  const [depth, setDepth] = useState(50)

  // Prepare data for the chart
  // Buy orders are below current price (bids), sell orders are above (asks)
  const minBuyPrice = buyOrders.length > 0 ? Math.min(...buyOrders.map(o => o.price)) : currentPrice * 0.999
  const maxSellPrice = sellOrders.length > 0 ? Math.max(...sellOrders.map(o => o.price)) : currentPrice * 1.001
  
  // Create price range for smooth chart
  const priceStep = (maxSellPrice - minBuyPrice) / 100
  const allPrices: number[] = []
  for (let p = minBuyPrice; p <= maxSellPrice; p += priceStep) {
    allPrices.push(p)
  }
  
  // Sort orders
  const sortedBuyOrders = [...buyOrders].sort((a, b) => b.price - a.price) // Highest buy price first
  const sortedSellOrders = [...sellOrders].sort((a, b) => a.price - b.price) // Lowest sell price first

  // Create chart data with cumulative totals
  const chartData = allPrices.map(price => {
    // Buy orders: cumulative from lowest price up to this price
    // (all buy orders at or below this price)
    const buyTotal = buyOrders
      .filter(o => o.price <= price)
      .reduce((sum, o) => sum + o.size, 0)
    
    // Sell orders: cumulative from this price to highest
    // (all sell orders at or above this price)
    const sellTotal = sellOrders
      .filter(o => o.price >= price)
      .reduce((sum, o) => sum + o.size, 0)
    
    return {
      price,
      buyTotal,
      sellTotal,
    }
  })

  const maxDepth = Math.max(
    ...chartData.map(d => Math.max(d.buyTotal, d.sellTotal))
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2 rounded-md text-xs shadow-lg bg-white border"
          style={{ borderColor: 'var(--trading-border)' }}
        >
          <p className="font-semibold">Price: ${label?.toFixed(2)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(2)} BTC
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300 relative">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 px-4">
        {["Traded Price", "Mark Price", "Funding", "Depth"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              tab === "Depth"
                ? "border-[#ADFF2F] text-black font-semibold"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Depth Slider */}
      <div className="px-4 py-2 border-gray-300">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">Depth</span>
          <div className="flex-1 max-w-[150px]">
            <Slider
              value={[depth]}
              onValueChange={(value) => setDepth(value[0])}
              max={100}
              min={0}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ADFF2F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ADFF2F" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="price"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "BTC",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 10,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={currentPrice}
              stroke="#6b7280"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {/* Buy Orders (Green) */}
            <Area
              type="stepAfter"
              dataKey="buyTotal"
              stroke="#ADFF2F"
              fill="url(#colorBuy)"
              strokeWidth={1.5}
            />
            {/* Sell Orders (Red) */}
            <Area
              type="stepBefore"
              dataKey="sellTotal"
              stroke="#ef4444"
              fill="url(#colorSell)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
