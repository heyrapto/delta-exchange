"use client"

import { useState } from "react"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"
import { useTradeStore } from "@/store/trade-store"
import { ConfirmationModal, NotificationModal } from "./modals"
import { marketDataService } from "@/services/market-data"
import { useEffect } from "react"
import { LeverageSelector } from "./leverage-selector"

export const TradeCard = () => {
    const {
        tradeType,
        leverage,
        orderType,
        stopPriceType,
        stopLimitType,
        quantity,
        stopPrice,
        limitPrice,
        quantityPercent,
        reduceOnly,
        maker,
        setAsDefault,
        showLeveragePanel,
        showStopPriceDropdown,
        showStopLimitDropdown,
        currentPrice,
        markPrice,
        indexPrice,
        lastPrice,
        markIV,
        volume24h,
        openInterest,
        fundsRequired,
        availableMargin,
        maxPosition,
        setTradeType,
        setLeverage,
        setOrderType,
        setStopPriceType,
        setStopLimitType,
        setQuantity,
        setStopPrice,
        setLimitPrice,
        setQuantityPercent,
        setReduceOnly,
        setMaker,
        setSetAsDefault,
        setShowLeveragePanel,
        setShowStopPriceDropdown,
        setShowStopLimitDropdown
    } = useTradeStore()

    // Modal states
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [showLeverageModal, setShowLeverageModal] = useState(false)
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'info' | 'warning'
    })

    const leverageOptions = [1, 2, 5, 10, 20]

    // Live calculations
    const getCurrentPrice = () => {
        switch (stopPriceType) {
            case 'mark': return markPrice
            case 'last': return lastPrice
            case 'index': return indexPrice
            default: return currentPrice
        }
    }

    const getPriceDisplay = () => {
        const price = getCurrentPrice()
        return `$${price.toFixed(1)}`
    }

    const getDeltaValue = () => {
        const delta = tradeType === 'long' ? -0.44 : 0.44
        return delta.toFixed(2)
    }

    const getMarkIVDisplay = () => {
        const iv = tradeType === 'long' ? markIV : markIV - 0.1
        return `${iv.toFixed(1)}%`
    }

    const getVolumeDisplay = () => {
        return `$${(volume24h / 1000).toFixed(2)}K`
    }

    const getOIDisplay = () => {
        return `$${(openInterest / 1000).toFixed(2)}K`
    }

    const getFundsRequiredDisplay = () => {
        return `~${fundsRequired.toFixed(2)} USD`
    }

    const getAvailableMarginDisplay = () => {
        return `${availableMargin.toFixed(2)} USD`
    }

    const getMaxPositionDisplay = () => {
        return `${(maxPosition / leverage).toLocaleString()} USD`
    }

    const headerStats = [
        { 
            label: "Delta", 
            value: getDeltaValue(), 
            icon: <BiChevronDown className="w-4 h-4" style={{ color: 'var(--warning-color)' }} /> 
        },
        { 
            label: "Lot Size", 
            value: "0.001 BTC", 
            icon: <BiChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />, 
            center: true 
        },
    ]

    const midStats = [
        { label: "Mark IV", value: getMarkIVDisplay() },
        { label: "24h Vol.", value: getVolumeDisplay() },
        { label: "OI", value: getOIDisplay() },
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

    // Helper function for numeric validation
    const isValidNumericInput = (value: string): boolean => {
        const numericRegex = /^[0-9]*\.?[0-9]*$/
        return numericRegex.test(value) || value === ''
    }

    // Handler functions
    const handleLeverageChange = (value: number) => {
        setLeverage(value)
        // calculateFundsRequired() is already called in setLeverage
    }

    const handleQuantityPercentChange = (percent: number) => {
        setQuantityPercent(percent)
    }

    const handleQuantityChange = (value: string) => {
        if (isValidNumericInput(value)) {
            setQuantity(value)
            // calculateFundsRequired() is already called in setQuantity
        }
    }

    const handleTradeSubmit = () => {
        if (!quantity || parseFloat(quantity) <= 0) {
            setNotificationData({
                title: 'Invalid Quantity',
                message: 'Please enter a valid quantity',
                type: 'error'
            })
            setShowNotification(true)
            return
        }

        if (fundsRequired > availableMargin) {
            setNotificationData({
                title: 'Insufficient Margin',
                message: `Required: ${getFundsRequiredDisplay()}, Available: ${getAvailableMarginDisplay()}`,
                type: 'warning'
            })
            setShowNotification(true)
            return
        }

        // Execute order through demo service and push to open orders
        marketDataService.executeOrder(tradeType, parseFloat(quantity), leverage)
        useTradeStore.getState().placeOrder({
            side: tradeType,
            orderType,
            price: limitPrice ? Number(limitPrice) : undefined,
            quantity: Number(quantity)
        })
        
        setNotificationData({
            title: 'Order Placed',
            message: `${tradeType === 'long' ? 'Long' : 'Short'} order for ${quantity} lots at ${leverage}x leverage`,
            type: 'success'
        })
        setShowNotification(true)
    }


    // Initialize demo data and start live updates
    useEffect(() => {
        marketDataService.resetDemoData()
        marketDataService.startLiveUpdates()
        
        return () => {
            marketDataService.stopLiveUpdates()
        }
    }, [])

    return (
        <div className="w-full h-full overflow-y-auto border border-gray-300" style={{ backgroundColor: 'var(--trade-card-bg)', color: 'var(--trade-card-text)' }}>
            {/* HEADER STATS */}
            <div className="flex justify-end gap-1 sm:gap-2 px-2 sm:px-3 py-2 border-b border-gray-300">
                {headerStats.map((s, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-1 ${s.center ? "justify-center" : ""}`}
                    >
                        <span className="text-[9px] sm:text-[10px]" style={{ color: 'var(--trade-card-label-text)' }}>{s.label}</span>
                        <span className="text-[9px] sm:text-[10px]" style={{ color: 'var(--trade-card-text)' }}>{s.value}</span>
                        {s.icon}
                    </div>
                ))}
            </div>

            {/* MID STATS */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-2 border-b border-gray-300">
                {midStats.map((s) => (
                    <div key={s.label} className="text-center">
                        <div className="text-[9px] sm:text-[10px] mb-0.5" style={{ color: 'var(--trade-card-label-text)' }}>{s.label}</div>
                        <div className="text-[9px] sm:text-[10px]" style={{ color: 'var(--trade-card-text)' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* MAIN BODY */}
            <div className="px-2 sm:px-3 py-2">
                {/* TRADE TYPE BUTTONS */}
                <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
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
                            {/* <span
                                className="absolute top-0 h-full w-[15px] right-[-7px] rounded"
                                style={{
                                    backgroundColor: tradeType === btn.type ? 'bg-orange-500' : 'bg-gray-500',
                                    transform: 'skewX(20deg)',
                                }}
                            /> */}
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
    <LeverageSelector />
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
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                            )}
                        </button>
                    ))}
                    {showStopLimitDropdown && (
                        <div className="absolute top-7 left-0 bg-gray-100/50 rounded shadow-lg py-1 z-10 min-w-[140px]">
                            {stopLimitOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        setStopLimitType(opt.value as typeof stopLimitType)
                                        setShowStopLimitDropdown(false)
                                    }}
                                    className={`px-3 py-1.5 text-[10px] hover:bg-gray-100/50 cursor-pointer ${stopLimitType === opt.value ? "text-green-500" : ""
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
                                                className={`px-3 py-1.5 text-[10px] hover:bg-gray-100/50 cursor-pointer capitalize ${stopPriceType === opt ? "text-green-500" : ""
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
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (isValidNumericInput(value)) {
                                            setStopPrice(value)
                                        }
                                    }}
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
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (isValidNumericInput(value)) {
                                        setLimitPrice(value)
                                    }
                                }}
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
                            onChange={(e) => handleQuantityChange(e.target.value)}
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
                                className={`hover:text-gray-300 ${quantityPercent === percent ? 'text-green-500 font-medium' : ''}`}
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
                        <span className="text-black">{getFundsRequiredDisplay()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Available Margin</span>
                        <span className="text-black">{getAvailableMarginDisplay()}</span>
                    </div>
                </div>

                {/* TRADE BUTTON */}
                <button 
                    onClick={handleTradeSubmit}
                    className="w-full bg-[#ADFF2F] hover:bg-green-600 text-black cursor-pointer py-2.5 rounded font-medium mb-3 transition-colors text-[11px]"
                >
                    {tradeType === 'long' ? 'Buy' : 'Sell'} {quantity || '0'} Lots
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

            {/* Modals */}
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={() => {}}
                title="Confirm Trade"
                message="Are you sure you want to place this trade?"
                type="warning"
            />

            <NotificationModal
                isOpen={showNotification}
                onClose={() => setShowNotification(false)}
                title={notificationData.title}
                message={notificationData.message}
                type={notificationData.type}
            />

        </div>
    )
}