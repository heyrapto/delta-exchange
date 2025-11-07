"use client"

import { useState } from "react"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"
import { useTradeStore } from "@/store/trade-store"
import { ConfirmationModal, NotificationModal } from "./modals"
import { marketDataService } from "@/services/market-data"
import { useEffect } from "react"
import { PeriodSelector } from "./period-selector"
import { useAppContext } from "@/context/app-context"
import Loader from "./reusable/loader"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { TradeSummary } from "./trade-summary"
import { OptionType } from "@/types"

export const TradeCard = () => {
    const {
        tradeType,
        period,
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
        showPeriodPanel,
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
        setPeriod,
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
        setShowPeriodPanel,
        setShowStopPriceDropdown,
        setShowStopLimitDropdown
    } = useTradeStore()
    const {
        state,
        handleAmountChange,
        handleProfitZoneSelect,
        handleStrategyChange,
    } = useAppContext();

    const {
        premiumAndProfitZone,
        isFetchingPremiums,
        asset,
        selectedProfitZone,
    } = state;

    // Modal states
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [showDeltaDropdown, setShowDeltaDropdown] = useState(false)
    const [showLotSizeHeaderDropdown, setShowLotSizeHeaderDropdown] = useState(false)
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'info' | 'warning'
    });

    const lotSizeOptions = ['0.001 BTC', '0.01 BTC', '0.1 BTC', '1 BTC']
    const deltaOptions = ['-0.44', '-0.38', '-0.32', '-0.26', '-0.20']

    // Live calculations
    const getCurrentPrice = () => {
        switch (stopPriceType) {
            case 'mark': return markPrice
            case 'last': return lastPrice
            case 'index': return indexPrice
            default: return currentPrice
        }
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

    const headerStats = [
        { 
            label: "Delta", 
            value: getDeltaValue(), 
            icon: <BiChevronDown className="w-4 h-4 cursor-pointer" style={{ color: 'var(--warning-color)' }} onClick={() => setShowDeltaDropdown(!showDeltaDropdown)} />,
            hasDropdown: true
        },
        { 
            label: "Lot Size", 
            value: "0.001 BTC", 
            icon: <BiChevronDown className="w-4 h-4 cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => setShowLotSizeHeaderDropdown(!showLotSizeHeaderDropdown)} />, 
            center: true,
            hasDropdown: true
        },
    ]

    const midStats = [
        { label: "Mark IV", value: getMarkIVDisplay() },
        { label: "24h Vol.", value: getVolumeDisplay() },
        { label: "OI", value: getOIDisplay() },
    ]

    const tradeButtons = [
        { label: "Call | Long", type: "calls", activeColor: "bg-[#ADFF2F] text-black" },
        { label: "Put | Short", type: "puts", activeColor: "bg-red-500 text-white" },
    ] as const

    // Helper function for numeric validation
    const isValidNumericInput = (value: string): boolean => {
        const numericRegex = /^[0-9]*\.?[0-9]*$/
        return numericRegex.test(value) || value === ''
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
                        className={`flex items-center gap-1 relative ${s.center ? "justify-center" : ""}`}
                    >
                        <span className="text-[9px] sm:text-[10px]" style={{ color: 'var(--trade-card-label-text)' }}>{s.label}</span>
                        <span className="text-[9px] sm:text-[10px]" style={{ color: 'var(--trade-card-text)' }}>{s.value}</span>
                        {s.icon}
                        
                        {/* Delta Dropdown */}
                        {s.hasDropdown && s.label === "Delta" && showDeltaDropdown && (
                            <div className="absolute top-6 right-0 bg-white rounded shadow-lg py-1 z-10 min-w-[80px]">
                                {deltaOptions.map((delta) => (
                                    <div
                                        key={delta}
                                        onClick={() => setShowDeltaDropdown(false)}
                                        className="px-3 py-1.5 text-[10px] hover:bg-gray-100/50 cursor-pointer"
                                    >
                                        {delta}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Lot Size Header Dropdown */}
                        {s.hasDropdown && s.label === "Lot Size" && showLotSizeHeaderDropdown && (
                            <div className="absolute top-6 right-0 bg-white rounded shadow-lg py-1 z-10 min-w-[100px]">
                                {lotSizeOptions.map((size) => (
                                    <div
                                        key={size}
                                        onClick={() => setShowLotSizeHeaderDropdown(false)}
                                        className="px-3 py-1.5 text-[10px] hover:bg-gray-100/50 cursor-pointer"
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        )}
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
                            onClick={() => handleStrategyChange(btn.type.toUpperCase() as OptionType)}
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
                            ${state.strategy as OptionType === btn.type as OptionType ? `${btn.activeColor}` : 'bg-transparent border border-gray-300 text-gray-900'}
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

                {/* PERIOD PANEL */}
                <div className="mb-3 bg-gray-100/50 p-3">
                    <div
                        onClick={() => setShowPeriodPanel(!showPeriodPanel)}
                        className="flex items-center justify-between py-2 cursor-pointer"
                    >
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-900 text-[11px]">Period</span>
                            <span className="text-green-500 text-[11px] font-medium">{state.period} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {showPeriodPanel ? (
                                <BiChevronUp className="w-3 h-3 text-gray-400" />
                            ) : (
                                <BiChevronDown className="w-3 h-3 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {showPeriodPanel && (
                        <PeriodSelector />
                    )}
                </div>

                {/* Amount */}
                <div className="mb-3">
                    <label className="text-gray-400 text-[10px] mb-1 block">Amount</label>
                    <div className="bg-gray-100/50 rounded px-3 py-2 flex items-center justify-between mb-1.5">
                        <input
                            type="text"
                            value={state.amount}
                            onChange={(value) => handleAmountChange(value.target.value)}
                            placeholder="1 Straps"
                            className="bg-transparent text-[11px] outline-none text-black flex-1 placeholder-gray-500"
                        />
                    </div>

                    <div className="flex gap-1 text-[10px] text-gray-500 mb-2">
                        <span>Limit ${ }</span>
                        <p className="text-underline cursor-pointer border-b border-dotted">( check limits )</p>
                    </div>
                </div>

                <div className="relative bg-transparent border border-white/0 rounded-lg space-y-2 mb-3">
                    <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
                    <p className="text-sm font-normal text-gray-700">Profit Zone</p>
                    <div className="space-y-2">
                        <div className="bg-transparent w-full h-[50px] rounded-lg overflow-hidden p-px">
                            <Select
                                value={selectedProfitZone.toString()}
                                onValueChange={handleProfitZoneSelect}
                            >
                                <SelectTrigger className="w-full bg-gray-100 h-full border-none outline-none rounded-lg">
                                    <SelectValue className="text-[#191414] text-sm">
                                        {isFetchingPremiums ? (
                                            <Loader />
                                        ) : (
                                            (premiumAndProfitZone.length > 0 && selectedProfitZone) ||
                                            premiumAndProfitZone[0]?.profitZone
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="border border-[#666666]">
                                    {!isFetchingPremiums &&
                                        premiumAndProfitZone &&
                                        premiumAndProfitZone.map((el) => (
                                            <SelectItem
                                                key={el.profitZone}
                                                value={el.profitZone.toString()}
                                            >
                                                {el?.profitZone}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            </div>
                        {/* <p></p> */}
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                <TradeSummary />
                </div>

                <div className="mt-3 bg-gradient-to-r from-green-300/20 to-transparent rounded p-2.5 flex items-center justify-between">
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
                onConfirm={() => { }}
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