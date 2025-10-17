import { TradeCard } from "../ui/trade-card"

export const ExchangeView = () => {
    return (
        <div className="flex h-[600px] bg-red-500">
            <div className="bg-blue-500 w-[60%]"></div>

            <div className="bg-orange-500 w-[15%]"></div>
            
            <div className="bg-green-500 w-[25%]">
                <TradeCard />
            </div>
        </div>
    )
}