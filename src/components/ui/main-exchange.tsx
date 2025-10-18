"use client"

import { useState, useEffect, useRef } from "react"
import { BiChevronDown } from "react-icons/bi"
import { SiStackblitz } from "react-icons/si"
import { TradingViewChart } from "./chart/trading-view"
import { OptionData, TableView, ViewMode } from "@/types"
import { TableHeader, OptionsTableRow } from "./table"

interface MainExchangeProps {
    strategyView: boolean
    setStrategyView: (value: boolean) => void
}

export const MainExchange = ({strategyView, setStrategyView }: MainExchangeProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>("table")
    const [tableView, setTableView] = useState<TableView>("standard")
    const [selectedContract, setSelectedContract] = useState("BTC")
    const [selectedDate, setSelectedDate] = useState("28 Nov 25")
    const [selectedStrike, setSelectedStrike] = useState(102000)
    const [btcPrice, setBtcPrice] = useState(106849.3)
    const [timeToExpiry, setTimeToExpiry] = useState("41d:12h:50m")
    const [showResources, setShowResources] = useState(false)
    const [optionsData, setOptionsData] = useState<OptionData[]>([])
    const [loading, setLoading] = useState(true)

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

    // Fetch real options data
    useEffect(() => {
        const fetchOptionsData = async () => {
            setLoading(true)
            try {
                const mockData: OptionData[] = Array.from({ length: 20 }, (_, i) => {
                    const strike = 96000 + (i * 1000)
                    const isITM = strike < btcPrice
                    
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
        
        // Real-time price updates
        const priceInterval = setInterval(() => {
            setBtcPrice(prev => prev + (Math.random() - 0.5) * 100)
        }, 5000)

        return () => clearInterval(priceInterval)
    }, [selectedContract, selectedDate])

    return (
        <div className="w-full bg-[#1a1d25] text-white h-[700px] flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-900/50">
                <div className="flex items-center gap-2">
                    {/* Table/Chart Toggle */}
                    {viewTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setViewMode(tab.value)}
                            className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                                viewMode === tab.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Contract Toggle */}
                    {contractTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedContract(tab.value)}
                            className={`px-3 py-1 rounded text-[11px] font-medium transition-colors border ${
                                selectedContract === tab.value
                                    ? "border-orange-500 text-white"
                                    : "border-gray-700 text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={() => setShowResources(!showResources)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-[11px] bg-transparent cursor-pointer text-gray-300 border ${showResources ? "border-orange-500 text-orange-500": "border-gray-700"} hover:bg-gray-700 relative`}
                    >
                        <SiStackblitz /> Resources
                        <BiChevronDown className={`w-3 h-3 transition-transform ${showResources ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => setStrategyView(!strategyView)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-[11px] ${
                            strategyView ? "text-orange-400 border border-orange-500" : "text-gray-400 border border-gray-700"
                        }`}
                    >
                        Strategy Builder
                        <div className={`w-8 h-4 rounded-full relative ${strategyView ? "bg-green-700" : "bg-gray-700"}`}>
                            <div
                                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                    strategyView ? "right-4" : "right-0.5"
                                }`}
                            ></div>
                        </div>
                    </button>
                   
                </div>
            </div>

            {/* Resources Dropdown */}
            {showResources && (
                <div className="absolute top-12 right-3 bg-[#23262f] rounded-lg shadow-lg p-2 z-50 min-w-[150px] border border-gray-700">
                    <button className="w-full text-left px-3 py-2 text-[11px] hover:bg-gray-700 rounded text-orange-400">
                        📊 Settlement Prices
                    </button>
                </div>
            )}

            {/* Date Selection */}
            <div className="flex justify-between items-center gap-2 px-3 py-2 border-b border-gray-700 overflow-x-auto scrollbar-hide">
                <div className="">
                {dates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-3 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
                            selectedDate === date
                                ? "bg-gray-800 text-white border border-orange-500"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {date}
                    </button>
                ))}
                </div>

<button className="p-1 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 3h2v2H3V3zm0 4h2v2H3V7zm0 4h2v2H3v-2zm4-8h2v2H7V3zm0 4h2v2H7V7zm0 4h2v2H7v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2z"/>
                        </svg>
                    </button>
            </div>

            {/* Price Info Bar */}
            <div className="px-3 py-2 border-b border-gray-700 bg-gray-900/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[10px]">{selectedContract === "calls" ? "Calls" : "Calls"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <span className="text-gray-400 text-[10px] mr-1">BTC</span>
                            <span className="text-green-400 text-[11px] font-bold">${btcPrice.toFixed(1)}</span>
                        </div>
                        <div className="text-gray-400 text-[10px]">
                            Time to Expiry <span className="text-white">{timeToExpiry}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[10px]">Puts</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === "table" ? (
                    <div className="h-full overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div>
                                <TableHeader type="calls" view={tableView} />
                                {optionsData.map((data, idx) => (
                                    <OptionsTableRow
                                        key={idx}
                                        data={data}
                                        type="calls"
                                        isSelected={data.strike === selectedStrike}
                                        view={tableView}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <TradingViewChart symbol={`BINANCE:${selectedContract}USDT`} />
                )}
            </div>
        </div>
    )
}