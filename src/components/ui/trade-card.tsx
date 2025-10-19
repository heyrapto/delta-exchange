"use client"

import { useState } from "react"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"

export const TradeCard = () => {
    const [tradeType, setTradeType] = useState<"long" | "short">("short")
    const [leverage, setLeverage] = useState(20)
    const [showLeveragePanel, setShowLeveragePanel] = useState(false)
    const [orderType, setOrderType] = useState<"limit" | "market" | "stopLimit">("limit")
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

    const headerStats = [
        { label: "Delta", value: "-0.44", icon: <BiChevronDown className="w-4 h-4" style={{ color: 'var(--warning-color)' }} /> },
        { label: "Lot Size", value: "0.001 BTC", icon: <BiChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />, center: true },
    ]

    const midStats = [
        { label: "Mark IV", value: tradeType === "long" ? "42.5%" : "42.4%" },
        { label: "24h Vol.", value: "$422.27K" },
        { label: "OI", value: "$196.56K" },
    ]

    const tradeButtons = [
        { label: "Buy | Long", type: "long", activeColor: "bg-[#ADFF2F] text-black" },
        { label: "Sell | Short", type: "short", activeColor: "bg-red-500 text-white" },
    ] as const

    const orderTabs = [
        { key: "limit" as const, label: "Limit", hasDropdown: false },
        { key: "market" as const, label: "Market", hasDropdown: false },
        { key: "stopLimit" as const, label: "Stop Limit", hasDropdown: true },
    ]

    const stopPriceOptions = ["mark", "last", "index"] as const
    const stopLimitOptions = [
        { value: "stopLimit", label: "Stop Limit" },
        { value: "takeProfitLimit", label: "Take Profit Limit" }
    ]

    const quantityPercents = [10, 25, 50, 75, 100]

    const checkboxes = [
        { label: "Reduce Only", checked: reduceOnly, setter: setReduceOnly, condition: true },
        { label: "Maker", checked: maker, setter: setMaker, condition: orderType === "limit" },
    ]

    const footerLinks = [
        { label: "GTC", hasDropdown: true, condition: orderType === "limit" },
        { label: "% Fees", isDotted: true, condition: true }
    ]

    const handleLeverageChange = (value: number) => setLeverage(value)
    const handleQuantityPercentChange = (percent: number) => setQuantityPercent(percent)

    return (
        <div className="w-full h-[700px] overflow-y-auto" style={{ backgroundColor: 'var(--trade-card-bg)', color: 'var(--trade-card-text)' }}>
            {/* HEADER STATS */}
            <div className="flex justify-end gap-2 px-3 py-2 border-b border-gray-300">
                {headerStats.map((s, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-1 ${s.center ? "justify-center" : ""}`}
                    >
                        <span className="text-[10px]" style={{ color: 'var(--trade-card-label-text)' }}>{s.label}</span>
                        <span className="text-[10px]" style={{ color: 'var(--trade-card-text)' }}>{s.value}</span>
                        {s.icon}
                    </div>
                ))}
            </div>

            {/* MID STATS */}
            <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-gray-300">
                {midStats.map((s) => (
                    <div key={s.label} className="text-center">
                        <div className="text-[10px] mb-0.5" style={{ color: 'var(--trade-card-label-text)' }}>{s.label}</div>
                        <div className="text-[10px]" style={{ color: 'var(--trade-card-text)' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* MAIN BODY */}
            <div className="px-3 py-2">
                {/* TRADE TYPE BUTTONS */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {tradeButtons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => setTradeType(btn.type)}
                            className={`
                            relative
                            flex items-center justify-center
                            h-7
                            rounded
                            text-[11px] font-medium
                            transition-colors
                            mr-2
                            overflow-hidden
                            cursor-pointer
                            ${tradeType === btn.type ? `${btn.activeColor}` : 'bg-transparent border border-gray-300 text-gray-900'}
                        `}
                            style={{
                                transform: 'skewX(-20deg)',
                            }}
                        >
                            {/* Button Text Skewed Back */}
                            <span className="relative z-10" style={{ transform: 'skewX(20deg)' }}>
                                {btn.label}
                            </span>

                            {/* After / angled end */}
                            <span
                                className="absolute top-0 h-full w-[15px] right-[-7px] rounded"
                                style={{
                                    backgroundColor: tradeType === btn.type ? 'bg-orange-500' : 'bg-gray-500',
                                    transform: 'skewX(20deg)',
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* LEVERAGE PANEL */}
                <div className="mb-3 bg-gray-100/50 p-3">
                    <div
                        onClick={() => setShowLeveragePanel(!showLeveragePanel)}
                        className="flex items-center justify-between py-2 cursor-pointer"
                    >
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-900 text-[11px]">Leverage</span>
                            <span className="text-green-500 text-[11px] font-medium">{leverage}x</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {showLeveragePanel ? (
                                <BiChevronUp className="w-3 h-3 text-gray-400" />
                            ) : (
                                <BiChevronDown className="w-3 h-3 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {showLeveragePanel && (
                        <div className="bg-transparent rounded p-3 space-y-3 relative">
                            {/* Editable Leverage Input */}
                            <div className="relative border border-[#ADFF2F] rounded px-3 py-2 text-right">
                                <input
                                    type="number"
                                    value={leverage}
                                    onChange={(e) => {
                                        const val = Number(e.target.value)
                                        if (val >= 1 && val <= 20) setLeverage(val)
                                    }}
                                    className="bg-transparent w-full text-right text-[20px] font-semibold outline-none text-black pr-5"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-[20px] font-semibold">
                                    x
                                </span>
                            </div>

                            {/* Slider */}
                            <div className="relative">
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={leverage}
                                    onChange={(e) => handleLeverageChange(Number(e.target.value))}
                                    className="w-full h-[4px] rounded-lg appearance-none cursor-pointer bg-gray-300"
                                    style={{
                                        background: `linear-gradient(to right, #ADFF2F 0%, #ADFF2F ${((leverage - 1) / 19) * 100
                                            }%, #E5E7EB ${((leverage - 1) / 19) * 100}%, #E5E7EB 100%)`,
                                    }}
                                />

                                {/* Tick Labels */}
                                <div className="flex justify-between mt-1 text-[11px] text-gray-500 font-medium">
                                    {leverageOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleLeverageChange(opt)}
                                            className={`transition ${leverage === opt ? 'text-black font-semibold' : 'hover:text-gray-700'
                                                }`}
                                        >
                                            {opt}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-2 text-[10px] text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={setAsDefault}
                                    onChange={(e) => setSetAsDefault(e.target.checked)}
                                    className="w-3 h-3 rounded border-gray-600 bg-transparent"
                                />
                                Set {leverage}x as default leverage for all BTC options
                            </label>

                            {/* Max Position */}
                            <div className="flex justify-between text-[10px]">
                                <span className="text-gray-400 border-b border-dotted border-gray-600">
                                    Max position at {leverage}x
                                </span>
                                <span className="text-black font-medium">{maxPosition.toLocaleString()} USD</span>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full bg-[#ADFF2F] text-black py-2 rounded font-medium transition-colors text-[11px] hover:bg-lime-400">
                                Set to {leverage}x
                            </button>
                        </div>
                    )}
                </div>

                {/* ORDER TABS */}
                <div className="flex gap-3 mb-3 border-b border-gray-300 relative">
                    {orderTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setOrderType(tab.key)}
                            className={`pb-1.5 text-[11px] relative ${orderType === tab.key ? "text-black" : "text-gray-400"
                                } flex items-center gap-1 cursor-pointer`}
                        >
                            {tab.label}
                            {tab.hasDropdown && (
                                <BiChevronDown
                                    className="w-3 h-3"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowStopLimitDropdown(!showStopLimitDropdown)
                                    }}
                                />
                            )}
                            {orderType === tab.key && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                            )}
                        </button>
                    ))}
                    {showStopLimitDropdown && (
                        <div className="absolute top-7 left-0 bg-[#23262f] rounded shadow-lg py-1 z-10 min-w-[140px]">
                            {stopLimitOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        setStopLimitType(opt.value as typeof stopLimitType)
                                        setShowStopLimitDropdown(false)
                                    }}
                                    className={`px-3 py-1.5 text-[10px] hover:bg-gray-700 cursor-pointer ${stopLimitType === opt.value ? "text-orange-500" : ""
                                        }`}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* STOP PRICE DROPDOWN */}
                {orderType === "stopLimit" && (
                    <div className="mb-3">
                        <label className="text-gray-400 text-[10px] mb-1 block">Stop Price</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowStopPriceDropdown(!showStopPriceDropdown)}
                                    className="w-full bg-gray-100/50 rounded px-3 py-2 flex items-center justify-between"
                                >
                                    <span className="text-green-500 text-[11px] capitalize">{stopPriceType}</span>
                                    <BiChevronDown className="w-3 h-3 text-gray-400" />
                                </button>
                                {showStopPriceDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-gray-100/50 rounded mt-1 shadow-lg py-1 z-10">
                                        {stopPriceOptions.map((opt) => (
                                            <div
                                                key={opt}
                                                onClick={() => {
                                                    setStopPriceType(opt)
                                                    setShowStopPriceDropdown(false)
                                                }}
                                                className={`px-3 py-1.5 text-[10px] hover:bg-gray-700 cursor-pointer capitalize ${stopPriceType === opt ? "text-green-500" : ""
                                                    }`}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 bg-gray-100/50 rounded px-3 py-2 flex items-center justify-between">
                                <input
                                    type="text"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(e.target.value)}
                                    className="bg-transparent text-[11px] outline-none text-black flex-1"
                                    placeholder="0.00"
                                />
                                <span className="text-gray-400 ml-1 text-[10px]">USD</span>
                                <BiChevronUp className="w-3 h-3 text-gray-400 ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* LIMIT PRICE */}
                {(orderType === "limit" || orderType === "stopLimit") && (
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-400 text-[10px]">Limit Price</label>
                            {orderType === "limit" && (
                                <span className="text-gray-400 text-[9px]">
                                    {tradeType === "short" ? "Min Sell 2516.6" : "Max Buy 11509.7"}
                                </span>
                            )}
                        </div>
                        <div className="bg-gray-100/50 rounded px-3 py-2 flex items-center justify-between">
                            <input
                                type="text"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                placeholder={tradeType === "long" ? "Best Offer" : "Best Bid"}
                                className="bg-transparent outline-none text-green-500 text-[11px] flex-1 placeholder-gray-500/60"
                            />
                            <span className="text-gray-400 ml-1 text-[10px]">USD</span>
                            <BiChevronUp className="w-3 h-3 text-gray-400 ml-1" />
                        </div>
                    </div>
                )}

                {/* QUANTITY */}
                <div className="mb-3">
                    <label className="text-gray-400 text-[10px] mb-1 block">Quantity</label>
                    <div className="bg-gray-100/50 rounded px-3 py-2 flex items-center justify-between mb-1.5">
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="1 Lot = 0.001 BTC"
                            className="bg-transparent text-[11px] outline-none text-black flex-1 placeholder-gray-500"
                        />
                        <span className="text-gray-400 ml-1 text-[10px]">Lot</span>
                        <BiChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                    </div>

                    <div className="flex gap-3 text-[10px] text-gray-500 mb-2">
                        {quantityPercents.map((percent) => (
                            <button
                                key={percent}
                                onClick={() => handleQuantityPercentChange(percent)}
                                className="hover:text-gray-300"
                            >
                                {percent}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* BRACKET ORDER & ADD TP/SL */}
                {orderType === "limit" && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300">
                        <span className="text-gray-400 text-[10px] border-b border-dotted border-gray-300">
                            Bracket Order
                        </span>
                        <button className="text-green-500 text-[10px] flex items-center gap-0.5">
                            <span className="text-sm">+</span> Add TP/SL
                        </button>
                    </div>
                )}

                {/* FUNDS REQUIRED & AVAILABLE MARGIN */}
                <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 flex items-center gap-1 border-b border-dotted border-gray-300">
                            Funds req.
                            <div className="w-2.5 h-2.5 border border-green-500 rounded-full flex items-center justify-center">
                                <span className="text-green-500 text-[8px]">!</span>
                            </div>
                        </span>
                        <span className="text-white">~0.00 USD</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Available Margin</span>
                        <span className="text-white">0 USD</span>
                    </div>
                </div>

                {/* GET VERIFIED BUTTON */}
                <button className="w-full bg-[#ADFF2F] hover:bg-green-600 text-black cursor-pointer py-2.5 rounded font-medium mb-3 transition-colors text-[11px]">
                    Get Verified To Trade
                </button>

                {/* CHECKBOXES */}
                <div className="mb-3 flex gap-3 items-center">
                    {checkboxes
                        .filter((c) => c.condition)
                        .map((c) => (
                            <label key={c.label} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={c.checked}
                                    onChange={(e) => c.setter(e.target.checked)}
                                    className="w-3 h-3 rounded border-gray-600 bg-transparent"
                                />
                                <span className="border-b border-dotted border-gray-600">{c.label}</span>
                            </label>
                        ))}
                </div>

                {/* FOOTER LINKS */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 pb-3 border-b border-gray-700">
                    {footerLinks
                        .filter((link) => link.condition)
                        .map((link, idx, arr) => (
                            <div key={link.label} className="flex items-center gap-1">
                                {link.hasDropdown ? (
                                    <button className="flex items-center gap-0.5">
                                        <span className="text-xs">ⓘ</span> {link.label}
                                        <BiChevronDown className="w-2.5 h-2.5" />
                                    </button>
                                ) : (
                                    <button
                                        className={link.isDotted ? "border-b border-dotted border-gray-600" : ""}
                                    >
                                        {link.label}
                                    </button>
                                )}
                                {idx < arr.length - 1 && orderType === "limit" && <span>|</span>}
                            </div>
                        ))}

                </div>

                {/* PROMO BANNER */}
                <div className="mt-3 bg-gradient-to-r from-green-900/20 to-transparent rounded p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg">🔥</span>
                        <span className="text-green-400 text-[10px] font-medium">Flat 50% off</span>
                        <span className="text-gray-400 text-[10px]">on Option Fee</span>
                    </div>
                    <span className="text-green-500 text-base">→</span>
                </div>
            </div>
        </div>
    )
}