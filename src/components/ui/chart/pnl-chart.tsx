"use client"

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts"

interface PnLChartProps {
  prices: number[]
  pnlValues: number[]
  breakeven: number
  currentPrice: number
}

export const PnLChart = ({ prices, pnlValues, breakeven, currentPrice }: PnLChartProps) => {
  const data = prices.map((p, i) => ({
    price: p,
    pnl: pnlValues[i],
    oi: pnlValues[i] * 2_000_000, // mock open interest
    expiryPnL: pnlValues[i] * 1.2, // On expiry date line
    targetPnL: p > currentPrice ? pnlValues[i] * 0.8 : pnlValues[i] * 0.6, // On target date area
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2 rounded-md text-xs"
          style={{
            backgroundColor: "var(--trading-bg)",
            border: "1px solid var(--trading-border)",
            color: "var(--text-primary)",
          }}
        >
          <p>Price: {label.toFixed(2)}</p>
          <p>PnL: {payload[0]?.value.toFixed(2)} USD</p>
          <p>Open Interest: {payload[1]?.value.toFixed(0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[380px] bg-gray-100 rounded-lg p-4" style={{ backgroundColor: 'var(--trading-bg)' }}>
      {/* Chart Header */}
      <div className="flex justify-between items-center text-xs mb-4">
        <div className="flex gap-4">
          <span className="text-orange-500">On Expiry Date</span>
          <span className="text-green-500">On Target Date</span>
        </div>
        <div className="text-gray-600">Current Price: {currentPrice}</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="price"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Profit / Loss (USD)",
              angle: -90,
              position: "insideLeft",
              fill: "#6b7280",
              fontSize: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Open Interest ($)",
              angle: 90,
              position: "insideRight",
              fill: "#6b7280",
              fontSize: 10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* On Target Date Area (Green bars) */}
          <Bar
            yAxisId="right"
            dataKey="targetPnL"
            fill="#10b981"
            radius={[1, 1, 0, 0]}
            opacity={0.7}
          />

          {/* On Expiry Date Line (Orange) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="expiryPnL"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />

          {/* Current Price Line */}
          <ReferenceLine
            x={currentPrice}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{
              position: "top",
              value: `Current Price: ${currentPrice}`,
              fill: "#ef4444",
              fontSize: 10,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Projected Loss */}
      <div className="flex justify-center mt-2 text-xs text-gray-600">
        Projected Loss: <span className="ml-1 text-red-500">-0.10 (0%)</span>
      </div>
    </div>
  )
}
