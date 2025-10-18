"use client"

import { useState, useRef, useEffect } from "react"
import { OptionData, TableView } from "@/types"

interface OptionsChainProps {
  optionsData: OptionData[]
  selectedStrike: number
  onStrikeSelect: (strike: number) => void
  view: TableView
  loading: boolean
}

export const OptionsChain = ({ 
  optionsData, 
  selectedStrike, 
  onStrikeSelect, 
  view, 
  loading 
}: OptionsChainProps) => {
  const callsScrollRef = useRef<HTMLDivElement>(null)
  const putsScrollRef = useRef<HTMLDivElement>(null)
  const callsHeaderRef = useRef<HTMLDivElement>(null)
  const putsHeaderRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  // Handle calls side horizontal scroll - MIRROR BOTH HEADERS AND CONTENT
  const handleCallsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    
    // Mirror puts header AND content with calls scroll
    if (putsHeaderRef.current) {
      putsHeaderRef.current.scrollLeft = scrollLeft
    }
    if (putsScrollRef.current) {
      putsScrollRef.current.scrollLeft = scrollLeft
    }
  }

  // Handle puts side horizontal scroll - MIRROR BOTH HEADERS AND CONTENT
  const handlePutsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    
    // Mirror calls header AND content with puts scroll
    if (callsHeaderRef.current) {
      callsHeaderRef.current.scrollLeft = scrollLeft
    }
    if (callsScrollRef.current) {
      callsScrollRef.current.scrollLeft = scrollLeft
    }
  }

  // Handle main container vertical scroll - SYNC ALL SECTIONS
  const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    
    // Sync vertical scroll for both sides
    if (callsScrollRef.current) {
      callsScrollRef.current.scrollTop = scrollTop
    }
    if (putsScrollRef.current) {
      putsScrollRef.current.scrollTop = scrollTop
    }
  }

  // Handle calls vertical scroll - SYNC WITH MAIN
  const handleCallsVerticalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    
    // Sync with main container and puts
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = scrollTop
    }
    if (putsScrollRef.current) {
      putsScrollRef.current.scrollTop = scrollTop
    }
  }

  // Handle puts vertical scroll - SYNC WITH MAIN
  const handlePutsVerticalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    
    // Sync with main container and calls
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = scrollTop
    }
    if (callsScrollRef.current) {
      callsScrollRef.current.scrollTop = scrollTop
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div 
      ref={mainContainerRef}
      className="h-full flex overflow-hidden"
      onScroll={handleMainScroll}
    >
      {/* CALLS SECTION */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Calls Header */}
        <div 
          ref={callsHeaderRef}
          className="overflow-x-auto scrollbar-hide border-b border-gray-700 bg-gray-900/50"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <CallsHeader view={view} />
        </div>
        
        {/* Calls Data */}
        <div 
          ref={callsScrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide"
          onScroll={(e) => {
            handleCallsScroll(e)
            handleCallsVerticalScroll(e)
          }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="min-w-max">
            {optionsData.map((data, idx) => (
              <CallsRow
                key={idx}
                data={data}
                isSelected={data.strike === selectedStrike}
                view={view}
                onSelect={() => onStrikeSelect(data.strike)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FIXED STRIKE COLUMN */}
      <div className="w-20 flex-shrink-0 bg-gray-900/30 border-l border-r border-gray-700">
        {/* Strike Header */}
        <div className="text-gray-400 text-[8px] px-1 py-1 font-medium text-center border-b border-gray-700 bg-gray-900/50">
          <div>Strike 🔽</div>
        </div>
        
        {/* Strike Data - PERFECTLY ALIGNED WITH ROWS */}
        <div className="overflow-y-auto scrollbar-hide">
          {optionsData.map((data, idx) => (
            <StrikeCell
              key={idx}
              strike={data.strike}
              isSelected={data.strike === selectedStrike}
              onSelect={() => onStrikeSelect(data.strike)}
            />
          ))}
        </div>
      </div>

      {/* PUTS SECTION */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Puts Header */}
        <div 
          ref={putsHeaderRef}
          className="overflow-x-auto scrollbar-hide border-b border-gray-700 bg-gray-900/50"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <PutsHeader view={view} />
        </div>
        
        {/* Puts Data */}
        <div 
          ref={putsScrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide"
          onScroll={(e) => {
            handlePutsScroll(e)
            handlePutsVerticalScroll(e)
          }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="min-w-max">
            {optionsData.map((data, idx) => (
              <PutsRow
                key={idx}
                data={data}
                isSelected={data.strike === selectedStrike}
                view={view}
                onSelect={() => onStrikeSelect(data.strike)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// CALLS HEADER COMPONENT
const CallsHeader = ({ view }: { view: TableView }) => {
  const headerClass = "text-gray-400 text-[8px] px-1 py-1 font-medium text-right whitespace-nowrap min-w-[80px]"
  
  if (view === "standard") {
    const headers = [
      "Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", 
      "Ask Qty\nBTC", "OI", "Volume", "6H OI Chg.", "POS\nBTC", "Gamma", "Vega", 
      "Theta", "Low", "High", "Open", "Last", "24hr Chg."
    ]
    
    return (
      <div className="flex">
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

  if (view === "greek") {
    const headers = [
      "Vega", "Gamma", "POS\nBTC", "6H OI Chg.", "Volume", "Delta", "Bid Qty\nBTC",
      "Bid\n(Price / IV)", "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI",
      "Theta", "Low", "High", "Open", "Last", "24hr Chg."
    ]
    
    return (
      <div className="flex">
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

  // Greek Detailed
  const headers = [
    "Low", "High", "Open", "Last", "24hr Chg.", "Theta", "Vega", "Gamma", "POS\nBTC",
    "6H OI Chg.", "Volume", "Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)",
    "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI"
  ]
  
  return (
    <div className="flex">
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

// PUTS HEADER COMPONENT
const PutsHeader = ({ view }: { view: TableView }) => {
  const headerClass = "text-gray-400 text-[8px] px-1 py-1 font-medium text-left whitespace-nowrap min-w-[80px]"
  
  if (view === "standard") {
    const headers = [
      "OI", "Volume", "6H OI Chg.", "POS\nBTC", "Gamma", "Vega", "Theta", "Low", "High",
      "Open", "Last", "24hr Chg.", "Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", 
      "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC"
    ]
    
    return (
      <div className="flex">
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

  if (view === "greek") {
    const headers = [
      "Qty\nBTC", "Delta", "Volume", "6H OI Chg.", "POS\nBTC", "Gamma", "Vega", "Theta",
      "Low", "High", "Open", "Last", "24hr Chg.", "Bid Qty\nBTC", "Bid\n(Price / IV)",
      "Mark\n(Price / IV)", "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI"
    ]
    
    return (
      <div className="flex">
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

  // Greek Detailed
  const headers = [
    "Vega", "Theta", "24hr Chg.", "Last", "Open", "High", "Low", "Gamma", "POS\nBTC",
    "6H OI Chg.", "Volume", "Delta", "Bid Qty\nBTC", "Bid\n(Price / IV)", "Mark\n(Price / IV)",
    "Ask\n(Price / IV)", "Ask Qty\nBTC", "OI"
  ]
  
  return (
    <div className="flex">
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

// CALLS ROW COMPONENT
const CallsRow = ({ 
  data, 
  isSelected, 
  view, 
  onSelect 
}: { 
  data: OptionData
  isSelected: boolean
  view: TableView
  onSelect: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const rowClass = `flex py-0.5 cursor-pointer border-b border-gray-800/50 hover:bg-gray-800/50 ${
    isSelected ? "bg-orange-900/20 border-orange-500/30" : ""
  }`

  const cellClass = "text-gray-300 px-1 text-right min-w-[80px] flex items-center justify-end text-[9px]"

  return (
    <div
      className={rowClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {view === "standard" && (
        <>
          <div className={cellClass}>{data.delta.toFixed(2)}</div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${data.bid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.bid / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${data.mark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.mark / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${data.ask.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.ask / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
          <div className={cellClass}>${data.oi.toFixed(2)}K</div>
          <div className={cellClass}>${data.volume.toFixed(2)}K</div>
          <div className={cellClass}>${(data.oi * 0.1).toFixed(2)}K</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>{data.vega?.toFixed(2)}</div>
          <div className={cellClass}>{data.theta?.toFixed(2)}</div>
          <div className={cellClass}>{data.low?.toFixed(1)}</div>
          <div className={cellClass}>{data.high?.toFixed(1)}</div>
          <div className={cellClass}>{data.open?.toFixed(1)}</div>
          <div className={cellClass}>${data.last?.toFixed(1)}</div>
          <div className={`${cellClass} ${data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.change24h.toFixed(2)}%
          </div>
        </>
      )}

      {view === "greek" && (
        <>
          <div className={cellClass}>{data.vega?.toFixed(2)}</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>${(data.oi * 0.1).toFixed(2)}K</div>
          <div className={cellClass}>${data.volume.toFixed(2)}K</div>
          <div className={cellClass}>{data.delta.toFixed(2)}</div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${data.bid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.bid / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${data.mark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.mark / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${data.ask.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.ask / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
          <div className={cellClass}>${data.oi.toFixed(2)}K</div>
          <div className={cellClass}>{data.theta?.toFixed(2)}</div>
          <div className={cellClass}>{data.low?.toFixed(1)}</div>
          <div className={cellClass}>{data.high?.toFixed(1)}</div>
          <div className={cellClass}>{data.open?.toFixed(1)}</div>
          <div className={cellClass}>${data.last?.toFixed(1)}</div>
          <div className={`${cellClass} ${data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.change24h.toFixed(2)}%
          </div>
        </>
      )}

      {view === "greekDetailed" && (
        <>
          <div className={cellClass}>{data.low?.toFixed(1)}</div>
          <div className={cellClass}>{data.high?.toFixed(1)}</div>
          <div className={cellClass}>{data.open?.toFixed(1)}</div>
          <div className={cellClass}>${data.last?.toFixed(1)}</div>
          <div className={`${cellClass} ${data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.change24h.toFixed(2)}%
          </div>
          <div className={cellClass}>{data.theta?.toFixed(2)}</div>
          <div className={cellClass}>{data.vega?.toFixed(2)}</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>${(data.oi * 0.1).toFixed(2)}K</div>
          <div className={cellClass}>${data.volume.toFixed(2)}K</div>
          <div className={cellClass}>{data.delta.toFixed(2)}</div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${data.bid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.bid / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${data.mark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.mark / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${data.ask.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((data.ask / data.mark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
          <div className={cellClass}>${data.oi.toFixed(2)}K</div>
        </>
      )}
    </div>
  )
}

// PUTS ROW COMPONENT
const PutsRow = ({ 
  data, 
  isSelected, 
  view, 
  onSelect 
}: { 
  data: OptionData
  isSelected: boolean
  view: TableView
  onSelect: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const rowClass = `flex py-0.5 cursor-pointer border-b border-gray-800/50 hover:bg-gray-800/50 ${
    isSelected ? "bg-orange-900/20 border-orange-500/30" : ""
  }`

  const cellClass = "text-gray-300 px-1 text-left min-w-[80px] flex items-center text-[9px]"

  // Generate PUTS data (mirrored from CALLS)
  const putsDelta = -data.delta
  const putsBid = data.bid * 0.8
  const putsMark = data.mark * 0.8
  const putsAsk = data.ask * 0.8

  return (
    <div
      className={rowClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {view === "standard" && (
        <>
          <div className={cellClass}>${(data.oi * 8).toFixed(2)}K</div>
          <div className={cellClass}>${(data.volume * 1.2).toFixed(2)}K</div>
          <div className={cellClass}>${(data.oi * 0.15).toFixed(2)}K</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>{data.vega?.toFixed(2)}</div>
          <div className={cellClass}>{data.theta?.toFixed(2)}</div>
          <div className={cellClass}>{data.low?.toFixed(1)}</div>
          <div className={cellClass}>{data.high?.toFixed(1)}</div>
          <div className={cellClass}>{data.open?.toFixed(1)}</div>
          <div className={cellClass}>${data.last?.toFixed(1)}</div>
          <div className={`${cellClass} ${-data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {(-data.change24h).toFixed(2)}%
          </div>
          <div className={cellClass}>{putsDelta.toFixed(2)}</div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${putsBid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsBid / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${putsMark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsMark / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${putsAsk.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsAsk / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
        </>
      )}

      {view === "greek" && (
        <>
          <div className={cellClass}>{(data.bidQty * 1.2).toFixed(0)}</div>
          <div className={cellClass}>{putsDelta.toFixed(2)}</div>
          <div className={cellClass}>${(data.volume * 0.8).toFixed(2)}K</div>
          <div className={cellClass}>${(data.oi * 0.15).toFixed(2)}K</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>{data.vega?.toFixed(2)}</div>
          <div className={cellClass}>{data.theta?.toFixed(2)}</div>
          <div className={cellClass}>{data.low?.toFixed(1)}</div>
          <div className={cellClass}>{data.high?.toFixed(1)}</div>
          <div className={cellClass}>{data.open?.toFixed(1)}</div>
          <div className={cellClass}>${data.last?.toFixed(1)}</div>
          <div className={`${cellClass} ${-data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {(-data.change24h).toFixed(2)}%
          </div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${putsBid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsBid / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${putsMark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsMark / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${putsAsk.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsAsk / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
          <div className={cellClass}>${data.oi.toFixed(2)}K</div>
        </>
      )}

      {view === "greekDetailed" && (
        <>
          <div className={cellClass}>{(data.vega! * 0.9).toFixed(2)}</div>
          <div className={cellClass}>{(data.theta! * 0.95).toFixed(2)}</div>
          <div className={`${cellClass} ${-data.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {(-data.change24h).toFixed(2)}%
          </div>
          <div className={cellClass}>${(data.last! * 0.85).toFixed(1)}</div>
          <div className={cellClass}>{(data.open! * 0.8).toFixed(1)}</div>
          <div className={cellClass}>{(data.high! * 0.9).toFixed(1)}</div>
          <div className={cellClass}>{(data.low! * 0.85).toFixed(1)}</div>
          <div className={cellClass}>{data.gamma?.toFixed(5)}</div>
          <div className={cellClass}>-</div>
          <div className={cellClass}>${(data.oi * 0.15).toFixed(2)}K</div>
          <div className={cellClass}>${(data.volume * 0.8).toFixed(2)}K</div>
          <div className={cellClass}>{putsDelta.toFixed(2)}</div>
          <div className={cellClass}>{data.bidQty.toFixed(3)}</div>
          <div className={cellClass}>
            <div>
              <div className="text-green-400">${putsBid.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsBid / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-white">${putsMark.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsMark / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>
            <div>
              <div className="text-red-400">${putsAsk.toFixed(1)}</div>
              <div className="text-gray-500 text-[8px]">{((putsAsk / putsMark) * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className={cellClass}>{data.askQty.toFixed(3)}</div>
          <div className={cellClass}>${data.oi.toFixed(2)}K</div>
        </>
      )}
    </div>
  )
}

// STRIKE CELL COMPONENT - PERFECTLY ALIGNED
const StrikeCell = ({ 
  strike, 
  isSelected, 
  onSelect 
}: { 
  strike: number
  isSelected: boolean
  onSelect: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const showStars = isSelected || isHovered

  return (
    <div
      className={`text-center font-medium px-1 py-0.5 flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-800/50 border-b border-gray-800/50 ${
        isSelected ? "bg-orange-900/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {showStars && <span className="text-blue-400">★</span>}
      <span className="text-white text-[9px]">{strike}</span>
      {showStars && <span className="text-blue-400">★</span>}
    </div>
  )
}