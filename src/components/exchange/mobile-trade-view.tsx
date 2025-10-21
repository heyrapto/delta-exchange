"use client"

import { OrderBook } from "../ui/order-book"
import { TradeCard } from "../ui/trade-card"

export const MobileTradeView = () => {
    return (
        <div className="flex md:hidden overflow-hidden px-2 py-2">
            {/* Order Book - Top section */}
            <div className="flex-1 min-h-0 border border-gray-300 rounded-t-lg overflow-hidden">
                <OrderBook />
            </div>
            
            {/* Trade Card - Bottom section */}
            <div className="flex-1 min-h-0 border border-gray-300 border-t-0 rounded-b-lg overflow-hidden">
                <TradeCard />
            </div>
        </div>
    )
}
