"use client"

import { useState } from "react"
import { MainExchange } from "../ui/main-exchange"
import { OrderBook } from "../ui/order-book"
import { TradeCard } from "../ui/trade-card"
import { StrategyBuilder } from "../ui/strategy-buillder"

export const ExchangeView = () => {
    const [strategyView, setStrategyView] = useState("Normal");

    return (
        <div className="flex h-[700px] overflow-hidden">
            <div className="w-[60%]">
                <MainExchange />
            </div>

            <div className="w-[15%]">
                <OrderBook />
            </div>
            
            <div className="w-[25%]">
                <TradeCard />
            </div>

            {/* <div className="w-[40%]">
                <StrategyBuilder />
            </div> */}
        </div>
    )
}