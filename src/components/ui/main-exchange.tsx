"use client"

import { useState, useEffect, useRef } from "react"
import { BiChevronDown } from "react-icons/bi"
import { SiStackblitz } from "react-icons/si"
import { TradingViewChart } from "./chart/trading-view"
import { OptionData, TableView, ViewMode } from "@/types"
import { OptionsChain } from "./options-chain"
import { useTradeStore } from "@/store/trade-store"
import { useStrategyStore } from "@/store/strategy-store"
import { GridDropdown } from "../dropdowns/grid"

interface MainExchangeProps {
    strategyView: boolean
    setStrategyView: (value: boolean) => void
}

export const MainExchange = ({ strategyView, setStrategyView }: MainExchangeProps) => {
    const { updateMarketData, setSelectedContract, currentPrice } = useTradeStore()
    const { isStrategyBuilderActive, setStrategyBuilderActive } = useStrategyStore()
    const [viewMode, setViewMode] = useState<ViewMode>("chart")
    const [tableView, setTableView] = useState<TableView>("standard")
    const [selectedContract, setLocalSelectedContract] = useState("BTC")
    const [selectedDate, setSelectedDate] = useState("28 Nov 25")
    const [selectedStrike, setSelectedStrike] = useState(102000)
    const [timeToExpiry, setTimeToExpiry] = useState("41d:12h:50m")
    const [showResources, setShowResources] = useState(false)
    const [showGridDropdown, setShowGridDropdown] = useState(false)
    const [optionsData, setOptionsData] = useState<OptionData[]>([])
    const [loading, setLoading] = useState(true)
    const gridDropdownRef = useRef<HTMLDivElement>(null)
    const gridButtonRef = useRef<HTMLButtonElement>(null);

    const dates = [
        "18 Oct 25", "19 Oct 25", "20 Oct 25", "24 Oct 25",
        "31 Oct 25", "07 Nov 25", "28 Nov 25"
    ]

    const viewTabs = [
        { value: "table" as ViewMode, label: "Table" },
        { value: "chart" as ViewMode, label: "Chart" },
    ]

    const contractTabs = [
        { value: "BTC", label: "BTC" },
        { value: "ETH", label: "ETH" },
    ]

    // Initialize prices and fetch options data
    useEffect(() => {
        // Set initial BTC price to ensure it's correct from the start
        if (selectedContract === 'BTC') {
            updateMarketData({
                currentPrice: 108068.0,
                markPrice: 108068.0,
                lastPrice: 108068.0,
                indexPrice: 108000.0
            })
        } else if (selectedContract === 'ETH') {
            updateMarketData({
                currentPrice: 3120.0,
                markPrice: 3120.0,
                lastPrice: 3120.0,
                indexPrice: 3100.0
            })
        }

        const fetchOptionsData = async () => {
            setLoading(true)
            try {
                const mockData: OptionData[] = Array.from({ length: 20 }, (_, i) => {
                    const strike = 96000 + (i * 1000)
                    const isITM = strike < currentPrice

                    return {
                        strike,
                        delta: 0.76 - (i * 0.02),
                        bidQty: 2.3 + Math.random(),
                        bid: 13690 - (i * 500),
                        mark: 13785 - (i * 500),
                        ask: 13874 - (i * 500),
                        askQty: 1.5 + Math.random(),
                        oi: 18.59 - (i * 0.5),
                        volume: 106.88,
                        change24h: -17.36 + (i * 2),
                        vega: 112.94 + (i * 2),
                        gamma: 0.00001 + (i * 0.000001),
                        theta: -70.94 + (i * 2),
                        low: 11900 - (i * 500),
                        high: 14400 - (i * 500),
                        open: 14400 - (i * 500),
                        last: 11900 - (i * 500),
                    }
                })
                setOptionsData(mockData)
            } catch (error) {
                console.error("Error fetching options data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOptionsData()
    }, [selectedContract, selectedDate, updateMarketData])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (gridDropdownRef.current && !gridDropdownRef.current.contains(e.target as Node)) {
                setShowGridDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--trading-bg)', color: 'var(--text-primary)' }}>
            {/* Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-3 py-2 border gap-2 sm:gap-0  md:bg-[var(--trading-bg)] bg-gray-100/50" style={{ borderColor: 'var(--trading-border)' }}>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    {/* Table/Chart Toggle */}
                    {viewTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setViewMode(tab.value)}
                            className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${viewMode === tab.value
                                    ? "bg-green-500 text-white"
                                    : "bg-transparent text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Contract Toggle */}
                    {contractTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setLocalSelectedContract(tab.value)
                                setSelectedContract(tab.value as 'BTC' | 'ETH')
                                // Snap price for ETH/BTC demo
                                const snap = tab.value === 'BTC' ? 108068.0 : 3120.0
                                updateMarketData({ currentPrice: snap, lastPrice: snap, markPrice: snap })
                            }}
                            className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors border cursor-pointer ${selectedContract === tab.value ? "bg-green-500 text-white" : "bg-transparent text-gray-900"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="md:flex hidden items-center gap-1 sm:gap-2 relative w-full sm:w-auto justify-between sm:justify-end">
                    <button
                        onClick={() => setShowResources(!showResources)}
                        className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] bg-transparent cursor-pointer text-gray-800 border ${showResources ? "border-green-500 text-green-500" : "border-gray-300"} relative`}
                    >
                        <SiStackblitz className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Resources</span>
                        <BiChevronDown className={`w-3 h-3 transition-transform ${showResources ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => {
                            setStrategyView(!strategyView)
                            setStrategyBuilderActive(!strategyView)
                        }}
                        className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] ${strategyView ? "text-green-500 border border-green-500" : "text-gray-800 border border-gray-300"
                            }`}
                    >
                        <span className="hidden sm:inline">Strategy Builder</span>
                        <span className="sm:hidden">Strategy</span>
                        <div className={`w-6 h-3 sm:w-8 sm:h-4 rounded-full relative ${strategyView ? "bg-green-700" : "bg-gray-700"}`}>
                            <div
                                className={`absolute top-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full transition-all ${strategyView ? "right-3 sm:right-4" : "right-0.5"
                                    }`}
                            ></div>
                        </div>
                    </button>

                    {/* Resources Dropdown */}
                    {showResources && (
                        <div className="absolute top-10 left-3 bg-gray-100/50 rounded-lg shadow-lg z-50 min-w-[150px] border border-gray-300">
                            <button className="w-full text-left px-3 py-2 text-xs rounded text-green-400">
                                📊 Settlement Prices
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Date Selection */}
            <div className="md:flex hidden justify-between items-center gap-2 px-2 sm:px-3 py-2 border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--trading-border)' }}>
                <div className="flex gap-1 sm:gap-2">
                    {dates.map((date) => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className="px-2 sm:px-3 py-1 rounded text-[9px] sm:text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                            style={{
                                backgroundColor: selectedDate === date ? 'var(--button-primary-bg)' : 'transparent',
                                color: selectedDate === date ? 'var(--button-primary-text)' : 'var(--text-secondary)',
                                border: selectedDate === date ? '1px solid var(--button-primary-bg)' : '1px solid transparent'
                            }}
                        >
                            {date}
                        </button>
                    ))}
                </div>

                <div className="relative">
  <button 
    ref={gridButtonRef}
    onClick={() => setShowGridDropdown(!showGridDropdown)}
    className="p-1 text-gray-400 hover:text-black flex-shrink-0 cursor-pointer"
  >
    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 3h2v2H3V3zm0 4h2v2H3V7zm0 4h2v2H3v-2zm4-8h2v2H7V3zm0 4h2v2H7V7zm0 4h2v2H7v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2z"/>
    </svg>
  </button>

                    <GridDropdown
                        isOpen={showGridDropdown}
                        onClose={() => setShowGridDropdown(false)}
                        buttonRef={gridButtonRef as any}
                    />
                </div>
            </div>

            {/* Price Info Bar */}
            <div className="px-2 sm:px-3 py-2 border-b" style={{ borderColor: 'var(--trading-border)' }}>
                <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-[16px]" style={{ color: 'var(--text-secondary)' }}>{selectedContract === "calls" ? "Calls" : "Calls"}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="text-center">
                            <span className="text-[9px] sm:text-[10px] mr-1" style={{ color: 'var(--text-secondary)' }}>{selectedContract}</span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-red-500">${currentPrice.toFixed(1)}</span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>
                            <span className="hidden sm:inline">Time to Expiry </span>
                            <span className="sm:hidden">Expiry </span>
                            <span style={{ color: 'var(--text-primary)' }}>{timeToExpiry}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-[16px]" style={{ color: 'var(--text-secondary)' }}>Puts</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === "table" ? (
                        <OptionsChain
                            optionsData={optionsData}
                            selectedStrike={selectedStrike}
                            onStrikeSelect={setSelectedStrike}
                            view={tableView}
                            loading={loading}
                            isStrategyBuilderActive={isStrategyBuilderActive}
                            selectedContract={selectedContract as 'BTC' | 'ETH'}
                        />
                ) : (
                    <TradingViewChart symbol={`BINANCE:${selectedContract}USDT`} />
                )}
            </div>
        </div>
    )
}