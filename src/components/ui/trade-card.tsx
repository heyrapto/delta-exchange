"use client"

import { useState } from "react"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"

export const TradeCard = () => {
    const [tradeType, setTradeType] = useState<"long" | "short">("short")
    const [leverage, setLeverage] = useState(20)
    const [showLeveragePanel, setShowLeveragePanel] = useState(false)
    const [orderType, setOrderType] = useState<"limit" | "market" | "stopLimit">("stopLimit")
    const [stopPriceType, setStopPriceType] = useState<"mark" | "last" | "index">("mark")
    const [showStopPriceDropdown, setShowStopPriceDropdown] = useState(false)
    const [setAsDefault, setSetAsDefault] = useState(false)
    const [quantity, setQuantity] = useState("")
    const [stopPrice, setStopPrice] = useState("")
    const [limitPrice, setLimitPrice] = useState("")
    const [quantityPercent, setQuantityPercent] = useState(0)
    const [showStopLimitDropdown, setShowStopLimitDropdown] = useState(false)
    const [stopLimitType, setStopLimitType] = useState<"stopLimit" | "takeProfitLimit">("stopLimit")
    const [reduceOnly, setReduceOnly] = useState(false)
    const [maker, setMaker] = useState(false)

    const leverageOptions = [1, 2, 5, 10, 20]
    const maxPosition = 199999.9

    const handleLeverageChange = (value: number) => {
        setLeverage(value)
    }

    const handleQuantityPercentChange = (percent: number) => {
        setQuantityPercent(percent)
    }

    return (
        <div className="w-full bg-[#1a1d25] text-white">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Delta</span>
                    <span className="text-white text-xs">-0.44</span>
                    <BiChevronDown className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex items-center gap-2 justify-center">
                    <span className="text-gray-400 text-xs">Lot Size</span>
                    <span className="text-white text-xs">0.001 BTC</span>
                    <BiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Mark IV, 24h Vol, OI */}
            <div className="grid grid-cols-3 gap-4 p-2 border-b border-gray-700">
                <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">Mark IV</div>
                    <div className="text-white text-xs">{tradeType === "long" ? "42.5%" : "42.4%"}</div>
                </div>
                <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">24h Vol.</div>
                    <div className="text-white text-xs">$422.27K</div>
                </div>
                <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">OI</div>
                    <div className="text-white text-xs">$196.56K</div>
                </div>
            </div>

            {/* Buy/Sell Toggle */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                        onClick={() => setTradeType("long")}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                            tradeType === "long"
                                ? "bg-green-600 text-white"
                                : "bg-gray-800 text-gray-400"
                        }`}
                    >
                        Buy | Long
                    </button>
                    <button
                        onClick={() => setTradeType("short")}
                        className={`py-2 text-xs rounded-lg font-medium transition-colors ${
                            tradeType === "short"
                                ? "bg-red-500 text-white"
                                : "bg-gray-800 text-gray-400"
                        }`}
                    >
                        Sell | Short
                    </button>
                </div>

                {/* Leverage */}
                <div className="mb-4">
                    <div
                        onClick={() => setShowLeveragePanel(!showLeveragePanel)}
                        className="flex items-center justify-between py-3 cursor-pointer"
                    >
                        <span className="text-gray-400 text-xs">Leverage</span>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500 font-medium">{leverage}x</span>
                            {showLeveragePanel ? (
                                <BiChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <BiChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {showLeveragePanel && (
                        <div className="bg-[#23262f] rounded-lg p-4 space-y-4">
                            <div className="border border-orange-500 rounded px-4 py-3 text-right">
                                <span className="text-white text-xs">{leverage}x</span>
                            </div>

                            {/* Slider */}
                            <div className="relative">
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={leverage}
                                    onChange={(e) => handleLeverageChange(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${((leverage - 1) / 19) * 100}%, #374151 ${((leverage - 1) / 19) * 100}%, #374151 100%)`
                                    }}
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    {leverageOptions.map((opt) => (
                                        <span key={opt}>{opt}x</span>
                                    ))}
                                </div>
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={setAsDefault}
                                    onChange={(e) => setSetAsDefault(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-transparent"
                                />
                                Set 20x as default leverage for all BTC options
                            </label>

                            {/* Max Position */}
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 border-b border-dotted border-gray-600">
                                    Max position at {leverage}x
                                </span>
                                <span className="text-white">{maxPosition.toLocaleString()} USD</span>
                            </div>

                            {/* Set Button */}
                            <button className="w-full bg-orange-900 hover:bg-orange-800 text-white py-3 rounded-lg font-medium transition-colors text-xs">
                                Set to {leverage}x
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Type Tabs */}
                <div className="flex gap-4 mb-4 border-b border-gray-700">
                    <button
                        onClick={() => setOrderType("limit")}
                        className={`pb-2 text-xs relative ${
                            orderType === "limit" ? "text-white" : "text-gray-400"
                        }`}
                    >
                        Limit
                        {orderType === "limit" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setOrderType("market")}
                        className={`pb-2 text-xs relative ${
                            orderType === "market" ? "text-white" : "text-gray-400"
                        }`}
                    >
                        Market
                        {orderType === "market" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setOrderType("stopLimit")}
                        className={`pb-2 text-xs relative flex items-center gap-1 ${
                            orderType === "stopLimit" ? "text-white" : "text-gray-400"
                        }`}
                    >
                        Stop Limit
                        <BiChevronDown
                            className="w-3 h-3"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowStopLimitDropdown(!showStopLimitDropdown)
                            }}
                        />
                        {orderType === "stopLimit" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                        )}
                        {showStopLimitDropdown && (
                            <div className="absolute top-8 left-0 bg-[#23262f] rounded-lg shadow-lg py-2 z-10 min-w-[150px]">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setStopLimitType("stopLimit")
                                        setShowStopLimitDropdown(false)
                                    }}
                                    className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer text-orange-500"
                                >
                                    Stop Limit
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setStopLimitType("takeProfitLimit")
                                        setShowStopLimitDropdown(false)
                                    }}
                                    className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer"
                                >
                                    Take Profit Limit
                                </div>
                            </div>
                        )}
                    </button>
                </div>

                {/* Stop Price (for Stop Limit) */}
                {orderType === "stopLimit" && (
                    <div className="mb-4">
                        <label className="text-gray-400 text-xs mb-2 block">Stop Price</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowStopPriceDropdown(!showStopPriceDropdown)}
                                    className="w-full bg-[#23262f] rounded-lg px-4 py-3 flex items-center justify-between"
                                >
                                    <span className="text-orange-500 text-xs capitalize">{stopPriceType}</span>
                                    <BiChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {showStopPriceDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-[#23262f] rounded-lg mt-1 shadow-lg py-2 z-10">
                                        <div
                                            onClick={() => {
                                                setStopPriceType("mark")
                                                setShowStopPriceDropdown(false)
                                            }}
                                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-orange-500"
                                        >
                                            Mark
                                        </div>
                                        <div
                                            onClick={() => {
                                                setStopPriceType("last")
                                                setShowStopPriceDropdown(false)
                                            }}
                                            className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer"
                                        >
                                            Last
                                        </div>
                                        <div
                                            onClick={() => {
                                                setStopPriceType("index")
                                                setShowStopPriceDropdown(false)
                                            }}
                                            className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer"
                                        >
                                            Index
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 bg-[#23262f] rounded-lg px-4 py-2 flex items-center justify-between">
                                <input
                                    type="text"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(e.target.value)}
                                    className="bg-transparent text-xs outline-none text-white flex-1"
                                    placeholder="0.00"
                                />
                                <span className="text-gray-400 ml-2 text-xs">USD</span>
                                <BiChevronUp className="w-4 h-4 text-gray-400 ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Limit Price */}
                {(orderType === "limit" || orderType === "stopLimit") && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 text-sm">Limit Price</label>
                            {orderType === "limit" && (
                                <span className="text-gray-400 text-xs">Min Sell 2516.6</span>
                            )}
                        </div>
                        <div className="bg-[#23262f] rounded-lg px-4 py-2 flex items-center justify-between">
                            <input
                                type="text"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                placeholder={tradeType === "long" ? "Best Offer" : "Best Bid"}
                                className="bg-transparent outline-none text-orange-500 flex-1"
                            />
                            <span className="text-gray-400 ml-2 text-xs">USD</span>
                            <BiChevronUp className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-2 block">Quantity</label>
                    <div className="bg-[#23262f] rounded-lg px-4 py-3 flex items-center justify-between mb-2">
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="1 Lot = 0.001 BTC"
                            className="bg-transparent outline-none text-white flex-1 placeholder-gray-500"
                        />
                        <span className="text-gray-400 ml-2">Lot</span>
                        <BiChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                    </div>

                    {/* Percentage Buttons */}
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                        {[10, 25, 50, 75, 100].map((percent) => (
                            <button
                                key={percent}
                                onClick={() => handleQuantityPercentChange(percent)}
                                className="hover:text-gray-300 text-xs"
                            >
                                {percent}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bracket Order & Add TP/SL */}
                {orderType === "limit" && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                        <span className="text-gray-400 text-xs border-b border-dotted border-gray-600">
                            Bracket Order
                        </span>
                        <button className="text-orange-500 text-xs flex items-center gap-1">
                            <span className="text-lg">+</span> Add TP/SL
                        </button>
                    </div>
                )}

                {/* Funds Required & Available Margin */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1 border-b border-dotted border-gray-600">
                            Funds req.
                            <div className="w-3 h-3 border border-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-orange-500 text-xs">!</span>
                            </div>
                        </span>
                        <span className="text-white">~0.00 USD</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Available Margin</span>
                        <span className="text-white">0 USD</span>
                    </div>
                </div>

                {/* Get Verified Button */}
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mb-4 transition-colors">
                    Get Verified To Trade
                </button>

                {/* Checkboxes */}
                <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={reduceOnly}
                            onChange={(e) => setReduceOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-transparent"
                        />
                        <span className="border-b border-dotted border-gray-600 text-xs">Reduce Only</span>
                    </label>
                    {orderType === "limit" && (
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={maker}
                                onChange={(e) => setMaker(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-transparent"
                            />
                            Maker
                        </label>
                    )}
                </div>

                {/* Footer Links */}
                <div className="flex items-center gap-4 text-sm text-gray-400 pb-4 border-b border-gray-700">
                    {orderType === "limit" && (
                        <>
                            <button className="flex items-center gap-1 text-xs">
                                <span className="text-lg">ⓘ</span> GTC
                                <BiChevronDown className="w-3 h-3" />
                            </button>
                            <span>|</span>
                        </>
                    )}
                    <button className="border-b border-dotted border-gray-600 text-xs">% Fees</button>
                </div>

                {/* Promo Banner */}
                <div className="mt-4 bg-gradient-to-r from-green-900/20 to-transparent rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-green-400 font-medium text-xs">Flat 50% off</span>
                        <span className="text-gray-400 text-xs">on Option Fee</span>
                    </div>
                    <span className="text-orange-500 text-xs">→</span>
                </div>
            </div>
        </div>
    )
}