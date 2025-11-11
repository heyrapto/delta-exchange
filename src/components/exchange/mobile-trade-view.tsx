"use client"

import { OrderBook } from "../ui/order-book"
import { TradeCard } from "../ui/trade-card"

export const MobileTradeView = () => {
    return (
        <div className="flex md:hidden overflow-hidden px-2 py-2">
            {/* Order Book - Top section */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <OrderBook />
            </div>
            
            {/* Trade Card - Bottom section */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <TradeCard />
            </div>
        </div>
    )
}
