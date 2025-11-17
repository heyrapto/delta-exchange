"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useAppContext } from "@/context/app-context"
import { LeverageSelector } from "./leverage-selector"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"
import { openTrade } from "@/blockchain/gns/gnsCalls"
import GNS_CONTRACTS from "@/blockchain/gns/gnsContracts"
import Loader from "./reusable/loader"
import CustomConnectButton from "@/components/custom/connect-button"

interface FuturesTradePanelProps {
  isLoggedIn?: boolean
}

export const FuturesTradePanel = ({ isLoggedIn = false }: FuturesTradePanelProps) => {
  const { address } = useAccount()
  const { state, handleGNSTradeTypeChange, handleGNSOrderTypeChange, handleGNSTpChange, handleGNSSlChange, handleGNSLeverageChange, handleGNSCollateralAmountChange, handleGNSCollateralIndexChange, handleGNSPriceChange } = useAppContext()

  const [showContractDetails, setShowContractDetails] = useState(false)
  const [showCollateralDropdown, setShowCollateralDropdown] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showTpSl, setShowTpSl] = useState(false)
  const [showLeveragePanel, setShowLeveragePanel] = useState(false)
  const collateralOptions = [
    { label: 'USDC', index: 1, symbol: '$' }
  ]
  
  // Calculate position size from collateral, leverage, and price
  const calculatePositionSize = () => {
    const collateral = parseFloat(state.gnsCollateralAmount) || 0
    const leverage = state.gnsLeverage || 1
    const price = state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice)
    
    if (collateral > 0 && leverage > 0 && price > 0) {
      return (collateral * leverage) / price
    }
    return 0
  }
  
  const positionSize = calculatePositionSize()

  const getPairName = () => {
    const pair = GNS_CONTRACTS.PAIRS[state.gnsPairIndex as keyof typeof GNS_CONTRACTS.PAIRS]
    return pair ? `${pair.from}/${pair.to}` : 'BTC/USD'
  }

  const handlePlaceOrder = async () => {
    if (!address || !state.gnsCollateralAmount || parseFloat(state.gnsCollateralAmount) <= 0) {
      return
    }

    // For limit/stop orders, price is required
    if ((state.gnsOrderType === 'limit' || state.gnsOrderType === 'stop') && (!state.gnsPrice || parseFloat(state.gnsPrice) <= 0)) {
      return
    }

    setIsPlacingOrder(true)
    try {
      const collateralAmount = parseFloat(state.gnsCollateralAmount)

      // Convert prices to 1e8 precision for TP/SL and openPrice
      const tp = state.gnsTp ? BigInt(Math.floor(parseFloat(state.gnsTp) * 1e8)) : BigInt(0)
      const sl = state.gnsSl ? BigInt(Math.floor(parseFloat(state.gnsSl) * 1e8)) : BigInt(0)
      const openPrice = (state.gnsOrderType === 'limit' || state.gnsOrderType === 'stop') && state.gnsPrice
        ? BigInt(Math.floor(parseFloat(state.gnsPrice) * 1e8))
        : BigInt(0)

      // Trade type: 0 = MARKET, 1 = LIMIT, 2 = STOP
      const tradeType = state.gnsOrderType === 'market' ? 0 : state.gnsOrderType === 'limit' ? 1 : 2

      await openTrade({
        pairIndex: state.gnsPairIndex,
        leverage: state.gnsLeverage,
        long: state.gnsTradeType === 'long',
        collateralAmount,
        openPrice,
        tp,
        sl,
        tradeType,
        collateralIndex: state.gnsCollateralIndex,
        index: 0,
      })
    } catch (error) {
      console.error("Error placing order:", error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const contractDetails = {
    name: "Bitcoin Perpetual",
    type: "Linear",
    lotSize: state.gnsLotSize,
    settlementCurrency: "USDC",
    initialMargin: "0.5%",
    maxLeverage: `${state.gnsLeverage}x`,
    maintenanceMargin: "0.25%",
    underlyingIndex: ".DEXBTUSD",
    positionLimit: "229.167 BTC",
    status: "Operational"
  }

  const tradeButtons = [
    { label: "Long", tradeType: "long" as const, activeColor: "bg-[#ADFF2F] text-black" },
    { label: "Short", tradeType: "short" as const, activeColor: "bg-red-500 text-white" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300">
      {/* Contract Details Header */}
      <div className="px-3 py-2 border-b border-gray-300 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setShowContractDetails(!showContractDetails)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-black cursor-pointer"
          >
            Contract Details
            {showContractDetails ? (
              <BiChevronUp className="w-4 h-4" />
            ) : (
              <BiChevronDown className="w-4 h-4" />
            )}
          </button>

          {showContractDetails && (
            <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded shadow-lg p-4 z-20 min-w-[280px]">
              <div className="text-sm font-semibold mb-3 text-green-500">Contract Details</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bitcoin Perpetual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-black">{contractDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="text-black">{contractDetails.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Settlement Currency:</span>
                  <span className="text-black">{contractDetails.settlementCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Margin:</span>
                  <span className="text-black">{contractDetails.initialMargin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Leverage:</span>
                  <span className="text-black">{contractDetails.maxLeverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Margin:</span>
                  <span className="text-black">{contractDetails.maintenanceMargin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Underlying Index:</span>
                  <span className="text-green-500 cursor-pointer">{contractDetails.underlyingIndex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position Limit:</span>
                  <span className="text-black">{contractDetails.positionLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-500">{contractDetails.status}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <a href="#" className="text-xs text-green-500 hover:underline">
                    See full contract specifications →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Trade Panel */}
      <div className="flex-1 flex flex-col p-3 space-y-3 overflow-y-auto">
        {/* Trade Direction Buttons */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {tradeButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                handleGNSTradeTypeChange(btn.tradeType)
              }}
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
                            ${state.gnsTradeType === btn.tradeType ? `${btn.activeColor}` : 'bg-transparent border border-gray-300 text-gray-900'}
                        `}
              style={{
                transform: 'skewX(-20deg)',
              }}
            >
              {/* Button Text Skewed Back */}
              <span className="relative z-10" style={{ transform: 'skewX(20deg)' }}>
                {btn.label}
              </span>
            </button>
          ))}
        </div>

        {/* Leverage Selector */}
        <div className="mb-3 bg-gray-100/50 p-3">
          <div
            onClick={() => setShowLeveragePanel(!showLeveragePanel)}
            className="flex items-center justify-between py-2 cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <span className="text-gray-900 text-[11px]">Leverage</span>
              <span className="text-green-500 text-[11px] font-medium">{state.gnsLeverage}x</span>
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
            <LeverageSelector maxLeverage={200} isGNS={true} />
          )}
        </div>

        {/* Order Type Tabs */}
        <div className="flex border-b border-gray-300">
          {(['market', 'limit', 'stop'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                handleGNSOrderTypeChange(type)
              }}
              className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors relative cursor-pointer ${(type === 'market' && state.gnsOrderType === 'market') ||
                (type === 'limit' && state.gnsOrderType === 'limit') ||
                (type === 'stop' && state.gnsOrderType === 'stop')
                ? 'border-[#ADFF2F] text-black font-semibold'
                : 'border-transparent text-gray-600 hover:text-black'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Collateral Input */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Collateral</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-300 rounded px-3 py-2">
              <input
                type="text"
                value={state.gnsCollateralAmount}
                onChange={(e) => handleGNSCollateralAmountChange(e.target.value)}
                placeholder="0"
                className="bg-transparent w-full text-sm outline-none text-black placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowCollateralDropdown(!showCollateralDropdown)}
                className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
              >
                <span>{collateralOptions.find(c => c.index === state.gnsCollateralIndex)?.symbol || '$'}</span>
                <span>{collateralOptions.find(c => c.index === state.gnsCollateralIndex)?.label || 'USDC'}</span>
                <BiChevronDown className="w-3 h-3" />
              </button>
              {showCollateralDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg py-1 z-10 min-w-[100px]">
                  {collateralOptions.map((option) => (
                    <div
                      key={option.index}
                      onClick={() => {
                        handleGNSCollateralIndexChange(option.index)
                        setShowCollateralDropdown(false)
                      }}
                      className="px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                    >
                      <span>{option.symbol}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <span>{state.gnsAvailableMargin.toFixed(2)} USDC available</span>
            <button className="ml-2 text-green-500 hover:underline">Bridge / Swap</button>
          </div>
        </div>

        {/* Position Size (calculated) */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Position size</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50">
              <input
                type="text"
                value={positionSize > 0 ? positionSize.toFixed(8) : ''}
                readOnly
                placeholder="0"
                className="bg-transparent w-full text-sm outline-none text-black placeholder-gray-400"
              />
            </div>
            <div className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-gray-50">
              {GNS_CONTRACTS.PAIRS[state.gnsPairIndex as keyof typeof GNS_CONTRACTS.PAIRS]?.from || 'ETH'}
            </div>
          </div>
        </div>

        {/* Price Input (only for limit/stop orders) */}
        {(state.gnsOrderType === 'limit' || state.gnsOrderType === 'stop') && (
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Price</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-gray-300 rounded px-3 py-2">
                <input
                  type="text"
                  value={state.gnsPrice}
                  onChange={(e) => handleGNSPriceChange(e.target.value)}
                  placeholder="0"
                  className="bg-transparent w-full text-sm outline-none text-black placeholder-gray-400"
                />
              </div>
              <div className="text-xs text-gray-500">
                Mark: {state.gnsPairPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}

        {/* Bracket Order (TP/SL) - Expandable */}
        <div className="bg-gray-100/50 p-3">
          <div
            onClick={() => setShowTpSl(!showTpSl)}
            className="flex items-center justify-between py-2 cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <span className="text-gray-900 text-[11px]">Stop Loss</span>
              <span className={`text-[11px] ${state.gnsSl ? 'text-red-500' : 'text-gray-500'}`}>
                ({state.gnsSl || 'None'})
              </span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-900 text-[11px]">Take Profit</span>
              <span className={`text-[11px] ${state.gnsTp ? 'text-green-500' : 'text-gray-500'}`}>
                ({state.gnsTp || 'None'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {showTpSl ? (
                <BiChevronUp className="w-3 h-3 text-gray-400" />
              ) : (
                <BiChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>

          {showTpSl && (
            <div className="space-y-3 pt-2">
              {/* Stop Loss Section */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs text-gray-600 mb-1 block">Stop Loss (a value should be here just like in ss)</label>
                  <span className={`text-[11px] ${state.gnsSl ? 'text-red-500' : 'text-gray-500'}`}>
                    {/*the usdc value should be here just like in ss*/}
                  </span>
                </div>
                <div className="flex gap-1 mb-2">
                  {['NONE', '-10%', '-25%', '-50%', '-75%', 'PRICE'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        if (option === 'NONE') {
                          handleGNSSlChange('')
                        } else if (option === 'PRICE') {
                          // For price input, user can type manually
                        } else {
                          const percent = parseFloat(option.replace('%', ''))
                          const currentPrice = state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice)
                          // For stop loss, negative percent means price goes down
                          const slPrice = currentPrice * (1 + percent / 100)
                          handleGNSSlChange(slPrice.toFixed(2))
                        }
                      }}
                      className={`flex-1 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer ${
                        option === 'NONE' && !state.gnsSl
                          ? 'bg-[#ADFF2F] text-black font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {/* <input
                  type="text"
                  value={state.gnsSl}
                  onChange={(e) => handleGNSSlChange(e.target.value)}
                  placeholder="Stop Loss Price"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none"
                />
                {state.gnsSl && (
                  <div className="text-xs text-red-500 mt-1">
                    {((parseFloat(state.gnsSl) - (state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice))) / (state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice)) * 100).toFixed(2)}% / {state.gnsCollateralAmount ? `-${state.gnsCollateralAmount} USDC` : '--'}
                  </div>
                )} */}
              </div>

              {/* Take Profit Section */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs text-gray-600 mb-1 block">Take Profit (a value should be here just like in ss)</label>
                  <span className={`text-[11px] ${state.gnsTp ? 'text-green-500' : 'text-gray-500'}`}>
                  {/*the usdc value should be here just like in ss*/}
                  </span>  
                </div>
                <div className="flex gap-1 mb-2">
                  {['NONE', '25%', '50%', '100%', '300%', 'PRICE'].map((option) => (
            <button
                      key={option}
                      onClick={() => {
                        if (option === 'NONE') {
                          handleGNSTpChange('')
                        } else if (option === 'PRICE') {
                          // For price input, user can type manually
                        } else {
                          const percent = parseFloat(option.replace('%', ''))
                          const currentPrice = state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice)
                          const tpPrice = currentPrice * (1 + percent / 100)
                          handleGNSTpChange(tpPrice.toFixed(2))
                        }
                      }}
                      className={`flex-1 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer ${
                        option === 'NONE' && !state.gnsTp
                          ? 'bg-[#ADFF2F] text-black font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {option}
            </button>
                  ))}
                </div>
                {/* <input
                  type="text"
                  value={state.gnsTp}
                  onChange={(e) => handleGNSTpChange(e.target.value)}
                  placeholder="Take Profit Price"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none"
                />
                {state.gnsTp && (
                  <div className="text-xs text-green-500 mt-1">
                    {((parseFloat(state.gnsTp) - (state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice))) / (state.gnsOrderType === 'market' ? state.gnsPairPrice : (parseFloat(state.gnsPrice) || state.gnsPairPrice)) * 100).toFixed(2)}%
                  </div>
                )} */}
              </div>
            </div>
          )}
        </div>

        {/* Trade Summary */}
        <div className="space-y-2 border-t border-gray-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{getPairName()}</span>
            {parseFloat(state.gnsCollateralAmount) > state.gnsAvailableMargin && (
              <span className="text-xs text-red-500">NOT ENOUGH USDC</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Est. Execution Price</span>
            <span className="text-xs text-black">
              {state.gnsOrderType === 'market' 
                ? state.gnsPairPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : state.gnsPrice || state.gnsPairPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Spread</span>
            <span className="text-xs text-black">&lt;0.001%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Max Slippage</span>
            <span className="text-xs text-black">1%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Notional Value</span>
            <span className="text-xs text-black">{state.gnsCollateralAmount || '0'} USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Fees</span>
            <span className="text-xs text-black">~{((parseFloat(state.gnsCollateralAmount) || 0) * 0.0015).toFixed(2)} USDC (Min Fee)</span>
          </div>
        </div>

        {/* Scalper Offer Banner */}
        <div className="bg-linear-to-r from-green-300/20 to-transparent rounded p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🔥</span>
            <span className="text-green-600 text-xs font-medium">Save upto 50% on fees with Scalper Offer</span>
          </div>
          <button className="text-green-600 text-sm font-medium">Activate →</button>
        </div>

        {/* Place Order Button */}
        <CustomConnectButton
          isGNS={true}
          requiredAmount={parseFloat(state.gnsCollateralAmount) || 0}
          onclick={handlePlaceOrder}
          onBalanceChange={(balance) => {
            // Update available margin in context if needed
          }}
        />
      </div>
    </div>
  )
}