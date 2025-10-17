"use client"

import { useState, useEffect, useRef } from "react"
import { BiChevronDown } from "react-icons/bi"

// ============= TYPES =============
type ViewMode = "table" | "chart"
type TableView = "standard" | "greek" | "greekDetailed"
type OptionType = "calls" | "puts"

interface OptionData {
    strike: number
    delta: number
    bidQty: number
    bid: number
    mark: number
    ask: number
    askQty: number
    oi: number
    volume: number
    change24h: number
    // Greek view specific
    vega?: number
    gamma?: number
    theta?: number
    low?: number
    high?: number
    open?: number
    last?: number
}

// ============= TRADINGVIEW CHART COMPONENT =============
const TradingViewChart = ({ symbol }: { symbol: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        const existingScript = document.getElementById('tradingview-widget-script')
        if (existingScript) existingScript.remove()

        const script = document.createElement('script')
        script.id = 'tradingview-widget-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = () => initWidget()
        document.head.appendChild(script)

        function initWidget() {
            if (containerRef.current && (window as any).TradingView) {
                containerRef.current.innerHTML = ''
                const widgetContainer = document.createElement('div')
                widgetContainer.id = 'tradingview_widget'
                widgetContainer.style.height = '100%'
                widgetContainer.style.width = '100%'
                containerRef.current.appendChild(widgetContainer)

                new (window as any).TradingView.widget({
                    autosize: true,
                    symbol: symbol,
                    interval: '60',
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    container_id: 'tradingview_widget',
                    height: '100%',
                    width: '100%',
                })

                setTimeout(() => setIsLoading(false), 1000)
            }
        }

        return () => {
            if (existingScript) existingScript.remove()
        }
    }, [symbol])

    return (
        <div className="relative h-full w-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1d25]/80 z-10">
                    <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            )}
            <div className="h-full w-full" ref={containerRef}></div>
        </div>
    )
}

// ============= TABLE ROW COMPONENT =============
const OptionsTableRow = ({ 
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
const TableHeader = ({ type, view }: { type: OptionType; view: TableView }) => {
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

// ============= MAIN EXCHANGE COMPONENT =============
export const MainExchange = () => {
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
                // Using Delta Exchange API endpoint (you'll need to replace with actual API)
                // For now, generating realistic mock data based on your images
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
        <div className="w-full bg-[#1a1d25] text-white h-[600px] flex flex-col overflow-hidden">
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

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowResources(!showResources)}
                        className="flex items-center gap-1 px-3 py-1 rounded text-[11px] bg-gray-800 text-gray-300 hover:bg-gray-700"
                    >
                        📚 Resources
                        <BiChevronDown className={`w-3 h-3 transition-transform ${showResources ? 'rotate-180' : ''}`} />
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 rounded text-[11px] text-orange-400 border border-orange-500/30">
                        Strategy Builder
                        <div className="w-8 h-4 bg-gray-700 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 3h2v2H3V3zm0 4h2v2H3V7zm0 4h2v2H3v-2zm4-8h2v2H7V3zm0 4h2v2H7V7zm0 4h2v2H7v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2z"/>
                        </svg>
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
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 overflow-x-auto scrollbar-hide">
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

            {/* Bottom Controls (if table view) */}
            {viewMode === "table" && (
                <div className="px-3 py-1.5 border-t border-gray-700 bg-gray-900/50">
                    <div className="flex items-center gap-2 text-[10px]">
                        <button
                            onClick={() => setTableView("standard")}
                            className={`px-2 py-0.5 rounded ${tableView === "standard" ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setTableView("greek")}
                            className={`px-2 py-0.5 rounded ${tableView === "greek" ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
                        >
                            Greek
                        </button>
                        <button
                            onClick={() => setTableView("greekDetailed")}
                            className={`px-2 py-0.5 rounded ${tableView === "greekDetailed" ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
                        >
                            Greek Detailed
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}