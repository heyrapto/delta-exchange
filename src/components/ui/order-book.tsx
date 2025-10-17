"use client"

import { useState } from "react"
import { BiChevronDown } from "react-icons/bi"

// Types
type OrderBookEntry = {
    price: number
    size: number
}

type RecentTrade = {
    price: number
    size: number
    time: string
    type: "buy" | "sell"
}

type ViewMode = "all" | "buy" | "sell"

// Order Book Row Component
const OrderBookRow = ({ 
    price, 
    size, 
    type, 
    onHover 
}: { 
    price: number
    size: number
    type: "buy" | "sell"
    onHover: (data: { price: number; size: number } | null) => void
}) => {
    return (
        <div
            className="grid grid-cols-2 py-0.5 hover:bg-gray-800/50 cursor-pointer text-[10px] relative"
            onMouseEnter={() => onHover({ price, size })}
            onMouseLeave={() => onHover(null)}
        >
            <div className={type === "sell" ? "text-red-400" : "text-green-400"}>
                {price.toFixed(1)}
            </div>
            <div className="text-right text-gray-300">
                {size.toFixed(3)}
            </div>
            {/* Background bar */}
            <div 
                className={`absolute right-0 top-0 bottom-0 ${
                    type === "sell" ? "bg-red-900/20" : "bg-green-900/20"
                }`}
                style={{ width: `${Math.min(size / 5, 100)}%` }}
            />
        </div>
    )
}

// Recent Trade Row Component
const RecentTradeRow = ({ 
    price, 
    size, 
    time, 
    type 
}: RecentTrade) => {
    return (
        <div className="grid grid-cols-3 py-0.5 hover:bg-gray-800/50 cursor-pointer text-[10px]">
            <div className={`flex items-center gap-1 ${type === "buy" ? "text-green-400" : "text-red-400"}`}>
                {price.toFixed(1)}
                {type === "sell" && <span className="text-[8px]">↓</span>}
            </div>
            <div className="text-right text-gray-300">
                {size.toFixed(3)}
            </div>
            <div className="text-right text-gray-400">
                {time}
            </div>
        </div>
    )
}

// Main OrderBook Component
export const OrderBook = () => {
    const [viewMode, setViewMode] = useState<ViewMode>("all")
    const [lotSize, setLotSize] = useState(0.1)
    const [hoveredData, setHoveredData] = useState<{ price: number; size: number } | null>(null)

    // Sample data
    const sellOrders: OrderBookEntry[] = [
        { price: 6041.0, size: 1.293 },
        { price: 5972.0, size: 1.189 },
        { price: 5889.0, size: 2.098 },
        { price: 5789.0, size: 2.557 },
        { price: 5711.0, size: 1.991 },
        { price: 5663.0, size: 1.550 },
        { price: 5631.0, size: 1.546 },
    ]

    const buyOrders: OrderBookEntry[] = [
        { price: 5532.0, size: 2.314 },
        { price: 5503.0, size: 2.320 },
        { price: 5461.0, size: 2.981 },
        { price: 5390.0, size: 3.829 },
        { price: 5301.0, size: 3.141 },
        { price: 5227.0, size: 1.779 },
        { price: 5165.0, size: 1.934 },
        { price: 5092.0, size: 2.102 },
    ]

    const recentTrades: RecentTrade[] = [
        { price: 5390.0, size: 0.025, time: "23:01:24", type: "sell" },
        { price: 5718.0, size: 0.035, time: "20:26:01", type: "sell" },
        { price: 5750.0, size: 0.001, time: "18:14:19", type: "sell" },
        { price: 5886.0, size: 0.001, time: "17:53:24", type: "sell" },
    ]

    const currentPrice = 5390.0
    const spread = 99
    const spreadPercent = 0.09

    const viewModeIcons = [
        { mode: "sell" as ViewMode, icon: "📊", color: "text-red-400" },
        { mode: "all" as ViewMode, icon: "📈", color: "text-gray-400" },
        { mode: "buy" as ViewMode, icon: "📉", color: "text-green-400" },
    ]

    const calculateHoverStats = () => {
        if (!hoveredData) return null
        
        const avgPrice = hoveredData.price * 0.9 // Simplified calculation
        const amount = hoveredData.size
        const premium = hoveredData.price * hoveredData.size

        return { avgPrice, amount, premium }
    }

    const hoverStats = calculateHoverStats()

    return (
        <div className="w-full max-w-md bg-[#1a1d25] text-white h-[600px] flex flex-col">
            {/* Header */}
            <div className="px-3 py-2 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 text-xs">⭐</span>
                    <span className="text-white text-xs font-medium">P-BTC-106000-281125</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="text-gray-400 text-[9px]">24h Change</div>
                        <div className="text-green-400 text-[11px] font-medium">14.68%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-400 text-[9px]">Price</div>
                        <div className="text-red-400 text-[11px] font-medium">$5390</div>
                    </div>
                </div>
            </div>

            {/* Order Book Title & Controls */}
            <div className="px-3 py-2 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-xs font-medium">Order Book</h3>
                    <div className="flex items-center gap-2">
                        {/* View Mode Icons */}
                        <div className="flex gap-1">
                            {viewModeIcons.map((item) => (
                                <button
                                    key={item.mode}
                                    onClick={() => setViewMode(item.mode)}
                                    className={`text-xs ${
                                        viewMode === item.mode ? item.color : "text-gray-600"
                                    } hover:opacity-80`}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                        {/* Lot Size Dropdown */}
                        <button className="flex items-center gap-1 text-[10px] text-white">
                            {lotSize}
                            <BiChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Column Headers */}
                <div className="grid grid-cols-2 mt-2 text-[9px] text-gray-400">
                    <div>Price (USD)</div>
                    <div className="text-right">Size (BTC)</div>
                </div>
            </div>

            {/* Order Book Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Sell Orders */}
                {(viewMode === "all" || viewMode === "sell") && (
                    <div className="overflow-y-auto px-3 py-1 flex-1">
                        {sellOrders.map((order, idx) => (
                            <OrderBookRow
                                key={`sell-${idx}`}
                                price={order.price}
                                size={order.size}
                                type="sell"
                                onHover={setHoveredData}
                            />
                        ))}
                    </div>
                )}

                {/* Current Price & Spread */}
                <div className="px-3 py-1.5 bg-[#23262f] border-y border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="text-red-400 text-sm font-bold">
                            ${currentPrice.toFixed(1)}
                        </div>
                        <div className="text-gray-400 text-[9px]">
                            Spread: <span className="text-white">{spread}</span> ({spreadPercent}%)
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[9px]">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400">I</span>
                            <span className="text-white">106913.4</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400">M</span>
                            <span className="text-white">5582.1</span>
                        </div>
                    </div>
                </div>

                {/* Buy Orders */}
                {(viewMode === "all" || viewMode === "buy") && (
                    <div className="overflow-y-auto px-3 py-1 flex-1">
                        {buyOrders.map((order, idx) => (
                            <OrderBookRow
                                key={`buy-${idx}`}
                                price={order.price}
                                size={order.size}
                                type="buy"
                                onHover={setHoveredData}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Stats Overlay */}
            {hoverStats && (
                <div className="absolute right-0 top-32 bg-[#23262f] rounded-l-lg shadow-lg p-2 border border-gray-700">
                    <div className="space-y-1 text-[9px]">
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-400">Avg. Price</span>
                            <span className="text-white">~{hoverStats.avgPrice.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-400">Amount (BTC)</span>
                            <span className="text-white">{hoverStats.amount.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-400">Premium (USD)</span>
                            <span className="text-white">{hoverStats.premium.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Trades */}
            <div className="border-t border-gray-700 px-3 py-2">
                <h3 className="text-white text-xs font-medium mb-2">Recent Trades</h3>
                
                {/* Column Headers */}
                <div className="grid grid-cols-3 text-[9px] text-gray-400 mb-1">
                    <div>Price (USD)</div>
                    <div className="text-right">Size (BTC)</div>
                    <div className="text-right">Time</div>
                </div>

                {/* Trades List */}
                <div className="max-h-24 overflow-y-auto">
                    {recentTrades.map((trade, idx) => (
                        <RecentTradeRow
                            key={idx}
                            price={trade.price}
                            size={trade.size}
                            time={trade.time}
                            type={trade.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}