import { MainExchange } from "../ui/main-exchange"
import { OrderBook } from "../ui/order-book"
import { TradeCard } from "../ui/trade-card"

export const ExchangeView = () => {
    return (
        <div className="flex h-[600px] overflow-hidden">
            <div className="w-[60%]">
                <MainExchange />
            </div>

            <div className="w-[15%]">
                <OrderBook />
            </div>
            
            <div className="bg-green-500 w-[25%]">
                <TradeCard />
            </div>
        </div>
    )
}