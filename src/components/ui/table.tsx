import { OptionData, OptionType, TableView } from "@/types"

export const OptionsTableRow = ({ 
    data, 
    type, 
    isSelected,
    view 
}: { 
    data: OptionData
    type: OptionType
    isSelected: boolean
    view: TableView
}) => {
    const rowClass = `grid text-[9px] py-0.5 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800/50 ${
        isSelected ? 'bg-orange-900/20 border-orange-500/30' : ''
    }`

    if (view === "standard") {
        return (
            <div className={`${rowClass} ${type === "calls" ? "grid-cols-9" : "grid-cols-9"}`}>
                <div className="text-gray-300 px-1">{data.delta.toFixed(2)}</div>
                <div className="text-gray-300 px-1">{data.bidQty.toFixed(3)}</div>
                <div className="text-green-400 px-1">
                    ${data.bid.toFixed(1)}
                    <div className="text-gray-500 text-[8px]">{((data.bid / data.mark) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-white px-1">
                    ${data.mark.toFixed(1)}
                    <div className="text-gray-500 text-[8px]">{((data.mark / data.mark) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-red-400 px-1">
                    ${data.ask.toFixed(1)}
                    <div className="text-gray-500 text-[8px]">{((data.ask / data.mark) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-gray-300 px-1">{data.askQty.toFixed(3)}</div>
                <div className="text-gray-300 px-1">${data.oi}K</div>
                <div className="text-center font-medium px-1">{data.strike}</div>
                <div className={`px-1 ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.change24h.toFixed(2)}%
                </div>
            </div>
        )
    }

    if (view === "greek") {
        return (
            <div className={`${rowClass} ${type === "calls" ? "grid-cols-8" : "grid-cols-8"}`}>
                <div className="text-gray-300 px-1">{data.vega?.toFixed(2)}</div>
                <div className="text-gray-300 px-1">{data.gamma?.toFixed(5)}</div>
                <div className="text-gray-300 px-1">-</div>
                <div className="text-gray-300 px-1">${data.oi}</div>
                <div className="text-gray-300 px-1">${data.volume}K</div>
                <div className="text-gray-300 px-1">{data.delta.toFixed(2)}</div>
                <div className="text-gray-300 px-1">{data.bidQty.toFixed(2)}</div>
                <div className="text-center font-medium px-1">{data.strike}</div>
            </div>
        )
    }

    // Greek Detailed view
    return (
        <div className={`${rowClass} grid-cols-8`}>
            <div className="text-gray-300 px-1">{data.low?.toFixed(1)}</div>
            <div className="text-gray-300 px-1">{data.high?.toFixed(1)}</div>
            <div className="text-gray-300 px-1">{data.open?.toFixed(1)}</div>
            <div className="text-gray-300 px-1">${data.last?.toFixed(1)}</div>
            <div className={`px-1 ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.change24h.toFixed(2)}%
            </div>
            <div className="text-gray-300 px-1">{data.theta?.toFixed(2)}</div>
            <div className="text-gray-300 px-1">{data.vega?.toFixed(2)}</div>
            <div className="text-center font-medium px-1">{data.strike}</div>
        </div>
    )
}

// ============= TABLE HEADER COMPONENT =============
export const TableHeader = ({ type, view }: { type: OptionType; view: TableView }) => {
    const headerClass = "text-gray-400 text-[8px] px-1 py-1 font-medium"
    
    const standardHeaders = type === "calls" 
        ? ["Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI", "Strike 🔽", "Delta"]
        : ["Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI", "Strike 🔽", "Delta"]

    const greekHeaders = ["Vega", "Gamma", "POS\nBTC", "6H OI Chg.", "Volume", "Delta", "Bid OI\nBTC", "Strike 🔽"]
    
    const greekDetailedHeaders = ["Low", "High", "Open", "Last", "24hr Chg.", "Theta", "Vega", "Strike 🔽"]

    const headers = view === "standard" ? standardHeaders : view === "greek" ? greekHeaders : greekDetailedHeaders

    return (
        <div className={`grid ${view === "standard" ? "grid-cols-9" : "grid-cols-8"} border-b border-gray-700 bg-gray-900/50 sticky top-0`}>
            {headers.map((h, i) => (
                <div key={i} className={headerClass}>
                    {h.split('\n').map((line, j) => (
                        <div key={j}>{line}</div>
                    ))}
                </div>
            ))}
        </div>
    )
}