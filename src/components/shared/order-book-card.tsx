import { RecentTrade } from "@/types"

export const OrderBookRow = ({ 
    price, 
    size, 
    type, 
    onHover 
}: { 
    price: number
    size: number
    type: "buy" | "sell"
    onHover: (data: { price: number; size: number } | null, pos?: { x: number; y: number }) => void
}) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover({ price, size }, { x: rect.right + 10, y: rect.top + rect.height / 2 })
    }

    const handleMouseLeave = () => {
        onHover(null)
    }

    return (
        <div
            className="grid grid-cols-2 py-0.5 hover:bg-gray-100/50 cursor-pointer text-[10px] relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={type === "sell" ? "text-red-400" : "text-green-400"}>
                {price.toFixed(1)}
            </div>
            <div className="text-right text-gray-900">
                {size.toFixed(3)}
            </div>
            
        </div>
    )
}

export const RecentTradeRow = ({ 
    price, 
    size, 
    time, 
    type 
}: RecentTrade) => {
    return (
        <div className="grid grid-cols-3 py-0.5 hover:bg-gray-100/50 cursor-pointer text-[10px]">
            <div className={`flex items-center gap-1 ${type === "buy" ? "text-green-400" : "text-red-400"}`}>
                {price.toFixed(1)}
                {type === "sell" && <span className="text-[8px]">↓</span>}
            </div>
            <div className="text-right text-gray-900">
                {size.toFixed(3)}
            </div>
            <div className="text-right text-gray-900">
                {time}
            </div>
        </div>
    )
}