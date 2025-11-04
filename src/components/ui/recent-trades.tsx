"use client"

import { RecentTrade } from "@/types"
import { BiTrendingDown, BiTrendingUp } from "react-icons/bi"

interface RecentTradesProps {
  trades: RecentTrade[]
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300">
        <h3 className="text-sm font-medium">Recent Trades</h3>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-4 text-xs px-3 py-1 bg-gray-50 border-b border-gray-200">
        <div className="text-gray-600">Price (USD)</div>
        <div className="text-gray-600 text-center">Taker</div>
        <div className="text-gray-600 text-right">Size (BTC)</div>
        <div className="text-gray-600 text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto">
        {trades.map((trade, index) => (
          <div
            key={index}
            className="grid grid-cols-4 text-xs px-3 py-1 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className={`flex items-center gap-1 ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
              {trade.type === 'buy' ? (
                <BiTrendingUp className="w-3 h-3" />
              ) : (
                <BiTrendingDown className="w-3 h-3" />
              )}
              <span>{trade.price.toFixed(1)}</span>
            </div>
            <div className="text-center text-gray-600">
              {trade.type === 'buy' ? 'B' : 'S'}
            </div>
            <div className="text-right text-gray-800">{trade.size.toFixed(3)}</div>
            <div className="text-right text-gray-600">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
