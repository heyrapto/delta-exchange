import { useState } from "react"
import { OptionData, TableView } from "@/types"

export const OptionsTableRow = ({
  data,
  isSelected,
  view,
}: {
  data: OptionData
  isSelected: boolean
  view: TableView,
  type: "calls" | "puts"
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const showStars = isSelected || isHovered

  const rowClass = `grid text-[9px] py-0.5 cursor-pointer border-b border-gray-800/50 hover:bg-gray-800/50 ${
    isSelected ? "bg-green-900/20 border-green-500/30" : ""
  }`

  // Generate PUTS data (mirrored from CALLS)
  const putsDelta = -data.delta
  const putsBid = data.bid * 0.8
  const putsMark = data.mark * 0.8
  const putsAsk = data.ask * 0.8

  return (
    <div
      className={
        view === "standard"
          ? `${rowClass} grid-cols-[repeat(8,1fr)_80px_repeat(8,1fr)]`
          : `${rowClass} grid-cols-[repeat(7,1fr)_80px_repeat(7,1fr)]`
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CALLS SIDE */}
      {view === "standard" && (
        <>
          <div className="text-gray-300 px-1 text-right">{data.delta.toFixed(2)}</div>
          <div className="text-gray-300 px-1 text-right">{data.bidQty.toFixed(3)}</div>
          <div className="px-1 text-right">
            <div className="text-green-400">${data.bid.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((data.bid / data.mark) * 100).toFixed(1)}%</div>
          </div>
          <div className="px-1 text-right">
            <div className="text-white">${data.mark.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((data.mark / data.mark) * 100).toFixed(1)}%</div>
          </div>
          <div className="px-1 text-right">
            <div className="text-red-400">${data.ask.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((data.ask / data.mark) * 100).toFixed(1)}%</div>
          </div>
          <div className="text-gray-300 px-1 text-right">{data.askQty.toFixed(3)}</div>
          <div className="text-gray-300 px-1 text-right">${data.oi.toFixed(2)}K</div>
          <div className="text-gray-300 px-1 text-right">${(data.oi * 10).toFixed(2)}K</div>
        </>
      )}

      {view === "greek" && (
        <>
          <div className="text-gray-300 px-1 text-right">{data.vega?.toFixed(2)}</div>
          <div className="text-gray-300 px-1 text-right">{data.gamma?.toFixed(5)}</div>
          <div className="text-gray-300 px-1 text-right">-</div>
          <div className="text-gray-300 px-1 text-right">${data.oi.toFixed(2)}</div>
          <div className="text-gray-300 px-1 text-right">${data.volume.toFixed(2)}K</div>
          <div className="text-gray-300 px-1 text-right">{data.delta.toFixed(2)}</div>
          <div className="text-gray-300 px-1 text-right">{data.bidQty.toFixed(2)}</div>
        </>
      )}

      {view === "greekDetailed" && (
        <>
          <div className="text-gray-300 px-1 text-right">{data.low?.toFixed(1)}</div>
          <div className="text-gray-300 px-1 text-right">{data.high?.toFixed(1)}</div>
          <div className="text-gray-300 px-1 text-right">{data.open?.toFixed(1)}</div>
          <div className="text-gray-300 px-1 text-right">${data.last?.toFixed(1)}</div>
          <div className={`px-1 text-right ${data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.change24h.toFixed(2)}%
          </div>
          <div className="text-gray-300 px-1 text-right">{data.theta?.toFixed(2)}</div>
          <div className="text-gray-300 px-1 text-right">{data.vega?.toFixed(2)}</div>
        </>
      )}

      {/* STRIKE COLUMN */}
      <div className="text-center font-medium px-1 flex items-center justify-center gap-1 bg-gray-900/30">
        {showStars && <span className="text-blue-400">★</span>}
        <span className="text-white">{data.strike}</span>
        {showStars && <span className="text-blue-400">★</span>}
      </div>

      {/* PUTS SIDE */}
      {view === "standard" && (
        <>
          <div className="text-gray-300 px-1">${(data.oi * 8).toFixed(2)}K</div>
          <div className="text-gray-300 px-1">{data.bidQty.toFixed(3)}</div>
          <div className="px-1">
            <div className="text-green-400">${putsBid.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((putsBid / putsMark) * 100).toFixed(1)}%</div>
          </div>
          <div className="px-1">
            <div className="text-white">${putsMark.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((putsMark / putsMark) * 100).toFixed(1)}%</div>
          </div>
          <div className="px-1">
            <div className="text-red-400">${putsAsk.toFixed(1)}</div>
            <div className="text-gray-500 text-[8px]">{((putsAsk / putsMark) * 100).toFixed(1)}%</div>
          </div>
          <div className="text-gray-300 px-1">{data.askQty.toFixed(3)}</div>
          <div className="text-gray-300 px-1">{(data.bidQty * 0.9).toFixed(3)}</div>
          <div className="text-gray-300 px-1">{putsDelta.toFixed(2)}</div>
        </>
      )}

      {view === "greek" && (
        <>
          <div className="text-gray-300 px-1">{(data.bidQty * 1.2).toFixed(0)}</div>
          <div className="text-gray-300 px-1">{putsDelta.toFixed(2)}</div>
          <div className="text-gray-300 px-1">${(data.volume * 0.8).toFixed(2)}K</div>
          <div className="text-gray-300 px-1">${data.oi.toFixed(2)}</div>
          <div className="text-gray-300 px-1">-</div>
          <div className="text-gray-300 px-1">{data.gamma?.toFixed(5)}</div>
          <div className="text-gray-300 px-1">{data.vega?.toFixed(2)}</div>
        </>
      )}

      {view === "greekDetailed" && (
        <>
          <div className="text-gray-300 px-1">{(data.vega! * 0.9).toFixed(2)}</div>
          <div className="text-gray-300 px-1">{(data.theta! * 0.95).toFixed(2)}</div>
          <div className={`px-1 ${-data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {(-data.change24h).toFixed(2)}%
          </div>
          <div className="text-gray-300 px-1">${(data.last! * 0.85).toFixed(1)}</div>
          <div className="text-gray-300 px-1">{(data.open! * 0.8).toFixed(1)}</div>
          <div className="text-gray-300 px-1">{(data.high! * 0.9).toFixed(1)}</div>
          <div className="text-gray-300 px-1">{(data.low! * 0.85).toFixed(1)}</div>
        </>
      )}
    </div>
  )
}

// ============= TABLE HEADER COMPONENT =============
export const TableHeader = ({ view, type }: { view: TableView, type: "calls" | "puts" }) => {
    const headerClass = "text-gray-400 text-[8px] px-1 py-1 font-medium"
    
    if (view === "standard") {
        const callsHeaders = ["Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI", "OI"]
        const putsHeaders = ["OI", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "Bid Qty\nBTC", "Delta"]

        return (
            <div className="grid grid-cols-[repeat(8,1fr)_80px_repeat(8,1fr)] border-b border-gray-700 bg-gray-900/50 sticky top-0">
                {/* CALLS HEADERS */}
                {callsHeaders.map((h, i) => (
                    <div key={`call-${i}`} className={`${headerClass} text-right`}>
                        {h.split('\n').map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                ))}
                
                {/* STRIKE HEADER */}
                <div className={`${headerClass} text-center bg-gray-900/50`}>
                    <div>Strike 🔽</div>
                </div>

                {/* PUTS HEADERS */}
                {putsHeaders.map((h, i) => (
                    <div key={`put-${i}`} className={headerClass}>
                        {h.split('\n').map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    if (view === "greek") {
        const callsHeaders = ["Vega", "Gamma", "POS\nBTC", "6H OI Chg.", "Volume", "Delta", "Bid OI\nBTC"]
        const putsHeaders = ["Qty\nBTC", "Delta", "Volume", "6H OI Chg.", "POS\nBTC", "Gamma", "Vega"]

        return (
            <div className="grid grid-cols-[repeat(7,1fr)_80px_repeat(7,1fr)] border-b border-gray-700 bg-gray-900/50 sticky top-0">
                {callsHeaders.map((h, i) => (
                    <div key={`call-${i}`} className={`${headerClass} text-right`}>
                        {h.split('\n').map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                ))}
                
                <div className={`${headerClass} text-center bg-gray-900/50`}>
                    <div>Strike 🔽</div>
                </div>

                {putsHeaders.map((h, i) => (
                    <div key={`put-${i}`} className={headerClass}>
                        {h.split('\n').map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    // Greek Detailed
    const callsHeaders = ["Low", "High", "Open", "Last", "24hr Chg.", "Theta", "Vega"]
    const putsHeaders = ["Vega", "Theta", "24hr Chg.", "Last", "Open", "High", "Low"]

    return (
        <div className="grid grid-cols-[repeat(7,1fr)_80px_repeat(7,1fr)] border-b border-gray-700 bg-gray-900/50 sticky top-0">
            {callsHeaders.map((h, i) => (
                <div key={`call-${i}`} className={`${headerClass} text-right`}>
                    {h}
                </div>
            ))}
            
            <div className={`${headerClass} text-center bg-gray-900/50`}>
                <div>Strike 🔽</div>
            </div>

            {putsHeaders.map((h, i) => (
                <div key={`put-${i}`} className={headerClass}>
                    {h}
                </div>
            ))}
        </div>
    )
}