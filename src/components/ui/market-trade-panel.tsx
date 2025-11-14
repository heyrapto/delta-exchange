"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Hex } from "viem"
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
  const { state, handleGNSTradeTypeChange, handleGNSOrderTypeChange, handleGNSQuantityChange, handleGNSLotSizeChange, handleGNSTpChange, handleGNSSlChange, handleGNSQuantityPercent, handleGNSLeverageChange } = useAppContext()

  const [showContractDetails, setShowContractDetails] = useState(false)
  const [showLotSizeDropdown, setShowLotSizeDropdown] = useState(false)
  const [showMakerOnlyDropdown, setShowMakerOnlyDropdown] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showTpSl, setShowTpSl] = useState(false)
  const [showLeveragePanel, setShowLeveragePanel] = useState(false)
  const lotSizeOptions = ['0.001 BTC', '0.01 BTC', '0.1 BTC', '1 BTC']
  const percentageOptions = [10, 25, 50, 75, 100]

  const getPairName = () => {
    const pair = GNS_CONTRACTS.PAIRS[state.gnsPairIndex as keyof typeof GNS_CONTRACTS.PAIRS]
    return pair ? `${pair.from}/${pair.to}` : 'BTC/USD'
  }

  const handlePlaceOrder = async () => {
    if (!address || !state.gnsQuantity || parseFloat(state.gnsQuantity) <= 0) {
      return
    }

    setIsPlacingOrder(true)
    try {
      const lotSizeValue = parseFloat(state.gnsLotSize.replace(' BTC', '')) || 0.001
      const quantityInBTC = parseFloat(state.gnsQuantity) * lotSizeValue
      const collateralAmount = (quantityInBTC * state.gnsPairPrice) / state.gnsLeverage

      // Convert prices to 1e8 precision for TP/SL
      const tp = state.gnsTp ? BigInt(Math.floor(parseFloat(state.gnsTp) * 1e8)) : BigInt(0)
      const sl = state.gnsSl ? BigInt(Math.floor(parseFloat(state.gnsSl) * 1e8)) : BigInt(0)

      const tradeType = state.gnsOrderType === 'market' ? 0 : state.gnsOrderType === 'limit' ? 1 : 2

      await openTrade({
        pairIndex: state.gnsPairIndex,
        leverage: state.gnsLeverage,
        long: state.gnsTradeType === 'long',
        collateralAmount,
        tp,
        sl,
        tradeType,
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
    { label: "Call | Long", tradeType: "long" as const, activeColor: "bg-[#ADFF2F] text-black" },
    { label: "Put | Short", tradeType: "short" as const, activeColor: "bg-red-500 text-white" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300">
      {/* Contract Details Header */}
      <div className="px-3 py-2 border-b border-gray-300 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setShowContractDetails(!showContractDetails)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"
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
              <div className="text-sm font-semibold mb-3 text-[#ADFF2F]">Contract Details</div>
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
                  <span className="text-[#ADFF2F] cursor-pointer">{contractDetails.underlyingIndex}</span>
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
                  <a href="#" className="text-xs text-[#ADFF2F] hover:underline">
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
          {(['limit', 'market'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                handleGNSOrderTypeChange(type === 'limit' ? 'limit' : 'market')
              }}
              className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors relative ${(type === 'market' && state.gnsOrderType === 'market') ||
                  (type === 'limit' && state.gnsOrderType === 'limit')
                  ? 'border-[#ADFF2F] text-black font-semibold'
                  : 'border-transparent text-gray-600 hover:text-black'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Quantity Input */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Quantity</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-gray-300 rounded px-3 py-2">
              <input
                type="text"
                value={state.gnsQuantity}
                onChange={(e) => handleGNSQuantityChange(e.target.value)}
                placeholder="1 Lot = 0.001 BTC"
                className="bg-transparent w-full text-sm outline-none text-black placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLotSizeDropdown(!showLotSizeDropdown)}
                className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
              >
                {state.gnsLotSize}
                <BiChevronDown className="w-3 h-3 inline ml-1" />
              </button>
              {showLotSizeDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg py-1 z-10 min-w-[100px]">
                  {lotSizeOptions.map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        handleGNSLotSizeChange(size)
                        setShowLotSizeDropdown(false)
                      }}
                      className="px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Percentage Buttons */}
          <div className="flex gap-1 mt-2">
            {percentageOptions.map((percent) => (
              <button
                key={percent}
                onClick={() => handleGNSQuantityPercent(percent)}
                className="flex-1 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Bracket Order (TP/SL) */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Bracket Order</label>
          {!showTpSl ? (
            <button
              onClick={() => setShowTpSl(true)}
              className="w-full py-2 px-3 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
            >
              + Add TP/SL
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={state.gnsTp}
                  onChange={(e) => handleGNSTpChange(e.target.value)}
                  placeholder="Take Profit"
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs outline-none"
                />
                <button
                  onClick={() => setShowTpSl(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={state.gnsSl}
                onChange={(e) => handleGNSSlChange(e.target.value)}
                placeholder="Stop Loss"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none"
              />
            </div>
          )}
        </div>

        {/* Funds Required & Available Margin */}
        <div className="space-y-2 border-t border-gray-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Funds req.</span>
            <div className="flex items-center gap-1">
              {state.isFetchingGNSPrices ? (
                <Loader />
              ) : (
                <span className="text-xs text-black">~{state.gnsFundsRequired.toFixed(2)} USD</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Available Margin</span>
            <span className="text-xs text-black">{state.gnsAvailableMargin.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Reduce Only Checkbox */}
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={reduceOnly}
            onChange={(e) => setReduceOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          Reduce Only
        </label>

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
          requiredAmount={state.gnsFundsRequired}
          onclick={handlePlaceOrder}
          onBalanceChange={(balance) => {
            // Update available margin in context if needed
          }}
        />

        {/* Fees Display */}
        <div className="text-center">
          <span className="text-xs text-gray-500">% Fees</span>
        </div>
      </div>
    </div>
  )
}
