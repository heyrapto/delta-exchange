"use client"

import { useState } from "react"
import { MainExchange } from "../ui/main-exchange"
import { OrderBook } from "../ui/order-book"
import { TradeCard } from "../ui/trade-card"
import { StrategyBuilder } from "../ui/strategy-buillder"
import { ViewMode } from "@/types"

export const ExchangeView = () => {
    const [strategyView, setStrategyView] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("chart");

    return (
        <div className="flex flex-col lg:flex-row h-screen sm:h-[600px] lg:h-[700px] overflow-hidden">
            {/* Main Exchange - Full width on mobile, 60% on desktop */}
            <div className="w-full lg:w-[60%]">
                <MainExchange viewMode={viewMode} setViewMode={setViewMode} strategyView={strategyView} setStrategyView={setStrategyView} />
            </div>

            {/* Right Panel - Hidden on mobile when not in strategy view, visible on tablet+ */}
            {strategyView ? (
                <div className="w-[40%]">
                    <StrategyBuilder />
                </div>
            ) : (
                <>
                    <div className="w-[15%]">
                        <OrderBook />
                    </div>
                    
                    <div className="w-[25%]">
                        <TradeCard />
                    </div>
                </>
            )}
        </div>
    )
}
