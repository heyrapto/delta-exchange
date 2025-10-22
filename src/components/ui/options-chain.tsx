"use client"

import { useState, useRef, useEffect } from "react"
import { OptionData, TableView } from "@/types"
import { useStrategyStore } from "@/store/strategy-store"

interface OptionsChainProps {
  optionsData: OptionData[]
  selectedStrike: number
  onStrikeSelect: (strike: number) => void
  view: TableView
  loading: boolean
  isStrategyBuilderActive: boolean
}

const ROW_HEIGHT_CLASS = "h-[26px] sm:h-[28px] flex items-center justify-center border-b border-gray-400/50";

export const OptionsChain = ({ 
  optionsData, 
  selectedStrike, 
  onStrikeSelect, 
  view, 
  loading,
  isStrategyBuilderActive
}: OptionsChainProps) => {
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const callsScrollRef = useRef<HTMLDivElement>(null)
  const putsScrollRef = useRef<HTMLDivElement>(null)
  const callsHeaderRef = useRef<HTMLDivElement>(null)
  const putsHeaderRef = useRef<HTMLDivElement>(null)
  
  // Strategy store
  const { addOrderToStrategy, selectedOrders } = useStrategyStore()
  
  // Check if an order is already selected
  const isOrderSelected = (type: 'call' | 'put', side: 'buy' | 'sell', strike: number) => {
    return selectedOrders.some(order => 
      order.type === type && order.side === side && order.strike === strike
    )
  }
  
  // Handle Buy/Sell button clicks
  const handleOrderClick = (type: 'call' | 'put', side: 'buy' | 'sell', strike: number, price: number) => {
    if (isStrategyBuilderActive) {
      addOrderToStrategy({
        type,
        side,
        strike,
        price,
        quantity: 1,
        contract: `${type === 'call' ? 'C' : 'P'}-ETH-${strike}-231025`,
        leverage: 100
      })
    }
  }

  // Handle main container scroll - sync everything
  const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const scrollLeft = e.currentTarget.scrollLeft
    
    // Sync vertical scroll for both sides
    if (callsScrollRef.current) {
      callsScrollRef.current.scrollTop = scrollTop
    }
    if (putsScrollRef.current) {
      putsScrollRef.current.scrollTop = scrollTop
    }
    
    // Sync horizontal scroll for headers
    if (callsHeaderRef.current) {
      callsHeaderRef.current.scrollLeft = scrollLeft
    }
    if (putsHeaderRef.current) {
      putsHeaderRef.current.scrollLeft = scrollLeft
    }
  }

  // Handle calls scroll - sync with puts
  const handleCallsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const scrollLeft = e.currentTarget.scrollLeft
    
    // Sync with main container
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = scrollTop
      mainScrollRef.current.scrollLeft = scrollLeft
    }
    
    // Sync with puts
    if (putsScrollRef.current) {
      putsScrollRef.current.scrollTop = scrollTop
      putsScrollRef.current.scrollLeft = scrollLeft
    }
    
    // Sync headers
    if (callsHeaderRef.current) {
      callsHeaderRef.current.scrollLeft = scrollLeft
    }
    if (putsHeaderRef.current) {
      putsHeaderRef.current.scrollLeft = scrollLeft
    }
  }

  // Handle puts scroll - sync with calls
  const handlePutsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const scrollLeft = e.currentTarget.scrollLeft
    
    // Sync with main container
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = scrollTop
      mainScrollRef.current.scrollLeft = scrollLeft
    }
    
    // Sync with calls
    if (callsScrollRef.current) {
      callsScrollRef.current.scrollTop = scrollTop
      callsScrollRef.current.scrollLeft = scrollLeft
    }
    
    // Sync headers
    if (callsHeaderRef.current) {
      callsHeaderRef.current.scrollLeft = scrollLeft
    }
    if (putsHeaderRef.current) {
      putsHeaderRef.current.scrollLeft = scrollLeft
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* HEADER ROW */}
      <div className="flex border-b" style={{ borderColor: 'var(--options-chain-border)', backgroundColor: 'var(--options-chain-header-bg)' }}>
        {/* Calls Header */}
        <div 
          ref={callsHeaderRef}
          className="flex-1 overflow-x-auto scrollbar-hide min-w-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <CallsHeader view={view} />
        </div>
        
        {/* Strike Header */}
        <div className="w-16 sm:w-20 flex-shrink-0 border-l border-r" style={{ backgroundColor: 'var(--options-chain-strike-bg)', borderColor: 'var(--options-chain-border)' }}>
          <div className="text-[7px] sm:text-[8px] px-1 py-1 font-medium text-center" style={{ color: 'var(--options-chain-text-secondary)' }}>
            <div>Strike 🔽</div>
          </div>
        </div>
        
        {/* Puts Header */}
        <div 
          ref={putsHeaderRef}
          className="flex-1 overflow-x-auto scrollbar-hide min-w-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <PutsHeader view={view} />
        </div>
      </div>

      {/* MAIN CONTENT AREA - SINGLE UNIFIED TABLE */}
      <div 
        ref={mainScrollRef}
        className="flex-1 overflow-auto scrollbar-hide"
        onScroll={handleMainScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex">
          {/* CALLS SECTION */}
          <div 
            ref={callsScrollRef}
            className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
            onScroll={handleCallsScroll}
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
                  isStrategyBuilderActive={isStrategyBuilderActive}
                  onOrderClick={handleOrderClick}
                  isOrderSelected={isOrderSelected}
                />
              ))}
            </div>
          </div>

          {/* FIXED STRIKE COLUMN */}
          <div className="w-16 sm:w-20 flex-shrink-0 border-l border-r" style={{ backgroundColor: 'var(--options-chain-strike-bg)', borderColor: 'var(--options-chain-border)' }}>
            {optionsData.map((data, idx) => (
              <StrikeCell
                key={idx}
                strike={data.strike}
                isSelected={data.strike === selectedStrike}
                onSelect={() => onStrikeSelect(data.strike)}
              />
            ))}
          </div>

          {/* PUTS SECTION */}
          <div 
            ref={putsScrollRef}
            className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
            onScroll={handlePutsScroll}
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
                  isStrategyBuilderActive={isStrategyBuilderActive}
                  onOrderClick={handleOrderClick}
                  isOrderSelected={isOrderSelected}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// CALLS HEADER COMPONENT
const CallsHeader = ({ view }: { view: TableView }) => {
  const headerClass = "text-[7px] sm:text-[8px] px-1 py-1 font-medium text-right whitespace-nowrap min-w-[60px] sm:min-w-[80px]"
  
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
  const headerClass = "text-gray-400 text-[7px] sm:text-[8px] px-1 py-1 font-medium text-left whitespace-nowrap min-w-[60px] sm:min-w-[80px]"
  
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
  onSelect,
  isStrategyBuilderActive,
  onOrderClick,
  isOrderSelected
}: { 
  data: OptionData
  isSelected: boolean
  view: TableView
  onSelect: () => void
  isStrategyBuilderActive: boolean
  onOrderClick: (type: 'call' | 'put', side: 'buy' | 'sell', strike: number, price: number) => void
  isOrderSelected: (type: 'call' | 'put', side: 'buy' | 'sell', strike: number) => boolean
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const rowClass = `${ROW_HEIGHT_CLASS} cursor-pointer relative ${
    isSelected ? "bg-green-900/20 border-green-500/30" : "hover:bg-[#ADFF2F]/10"
  } ${
    isOrderSelected('call', 'buy', data.strike) || isOrderSelected('call', 'sell', data.strike) 
      ? "bg-blue-900/20 border-blue-500/30" 
      : ""
  }`;
  
  const cellClass =
    "px-1 text-right min-w-[60px] sm:min-w-[80px] flex items-center justify-end text-[8px] sm:text-[9px]";
  
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
              <div className="text-black">${data.mark.toFixed(1)}</div>
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
              <div className="text-black">${data.mark.toFixed(1)}</div>
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
              <div className="text-black">${data.mark.toFixed(1)}</div>
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

      {/* Buy/Sell Buttons for Strategy Builder */}
      {isStrategyBuilderActive && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/80 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick('call', 'buy', data.strike, data.mark)
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isOrderSelected('call', 'buy', data.strike) 
                ? 'bg-green-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick('call', 'sell', data.strike, data.mark)
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isOrderSelected('call', 'sell', data.strike) 
                ? 'bg-red-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Sell
          </button>
        </div>
      )}
    </div>
  )
}

// PUTS ROW COMPONENT
const PutsRow = ({ 
  data, 
  isSelected, 
  view, 
  onSelect,
  isStrategyBuilderActive,
  onOrderClick,
  isOrderSelected
}: { 
  data: OptionData
  isSelected: boolean
  view: TableView
  onSelect: () => void
  isStrategyBuilderActive: boolean
  onOrderClick: (type: 'call' | 'put', side: 'buy' | 'sell', strike: number, price: number) => void
  isOrderSelected: (type: 'call' | 'put', side: 'buy' | 'sell', strike: number) => boolean
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const rowClass = `${ROW_HEIGHT_CLASS} cursor-pointer relative ${
    isSelected ? "bg-green-900/20 border-green-500/30" : "hover:bg-[#ADFF2F]/10"
  } ${
    isOrderSelected('put', 'buy', data.strike) || isOrderSelected('put', 'sell', data.strike) 
      ? "bg-blue-900/20 border-blue-500/30" 
      : ""
  }`;
  
  const cellClass =
    "text-gray-800 px-1 text-left min-w-[60px] sm:min-w-[80px] flex items-center text-[8px] sm:text-[9px]";
  
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
              <div className="text-black">${putsMark.toFixed(1)}</div>
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
              <div className="text-black">${putsMark.toFixed(1)}</div>
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
              <div className="text-black">${putsMark.toFixed(1)}</div>
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

      {/* Buy/Sell Buttons for Strategy Builder */}
      {isStrategyBuilderActive && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/80 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick('put', 'buy', data.strike, data.mark)
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isOrderSelected('put', 'buy', data.strike) 
                ? 'bg-green-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick('put', 'sell', data.strike, data.mark)
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isOrderSelected('put', 'sell', data.strike) 
                ? 'bg-red-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Sell
          </button>
        </div>
      )}
    </div>
  )
}

// STRIKE CELL COMPONENT - PERFECTLY ALIGNED WITH ROW BORDERS
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
  className={`${ROW_HEIGHT_CLASS} text-center font-medium px-1 gap-1 cursor-pointer justify-center`}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onClick={onSelect}
  style={{
    borderColor: "var(--options-chain-border)",
    backgroundColor: isSelected
      ? "var(--options-chain-selected-bg)"
      : isHovered
      ? "var(--options-chain-row-hover)"
      : "transparent",
  }}
>
  {showStars && (
    <span style={{ color: "var(--button-primary-bg)", fontSize: "10px" }}>★</span>
  )}
  <span
    className="text-[8px] sm:text-[9px]"
    style={{ color: "var(--text-primary)" }}
  >
    {strike}
  </span>
  {showStars && (
    <span style={{ color: "var(--button-primary-bg)", fontSize: "10px" }}>★</span>
  )}
</div>

  )
}