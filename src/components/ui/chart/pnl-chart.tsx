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
    <div className="w-full h-[380px]">
      <div className="flex justify-between items-center text-xs mb-2 px-1">
        <div className="flex gap-4">
          <span style={{ color: "var(--text-secondary)" }}>On Expiry Date</span>
          <span style={{ color: "var(--text-secondary)" }}>On Target Date</span>
        </div>
        <div style={{ color: "var(--text-secondary)" }}>Current Price: {currentPrice}</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
          <CartesianGrid
            stroke="var(--trading-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="price"
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            axisLine={{ stroke: "var(--trading-border)" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Profit / Loss (USD)",
              angle: -90,
              position: "insideLeft",
              fill: "var(--text-secondary)",
              fontSize: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Open Interest ($)",
              angle: 90,
              position: "insideRight",
              fill: "var(--text-secondary)",
              fontSize: 10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Profit/Loss Bars */}
          <Bar
            yAxisId="left"
            dataKey="pnl"
            fill="var(--chart-negative)"
            radius={[3, 3, 0, 0]}
          />

          {/* PnL Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="oi"
            stroke="var(--chart-accent)"
            strokeWidth={2}
            dot={false}
          />

          {/* Breakeven Line */}
          <ReferenceLine
            x={breakeven}
            stroke="var(--chart-neutral)"
            strokeDasharray="3 3"
            label={{
              position: "top",
              value: `Breakeven ${breakeven}`,
              fill: "var(--text-secondary)",
              fontSize: 10,
            }}
          />

          {/* Current Price Line */}
          <ReferenceLine
            x={currentPrice}
            stroke="var(--chart-positive)"
            strokeWidth={1.5}
            label={{
              position: "top",
              value: `Current ${currentPrice}`,
              fill: "var(--text-primary)",
              fontSize: 10,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
        Projected Loss: <span className="ml-1 text-red-400">-0.10 (0%)</span>
      </div>
    </div>
  )
}
