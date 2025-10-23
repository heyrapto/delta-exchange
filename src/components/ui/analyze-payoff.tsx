"use client"

import { useState } from "react"
import { useStrategyStore } from "@/store/strategy-store"
import { useTradeStore } from "@/store/trade-store"
import { PnLChart } from "./chart/pnl-chart"

interface AnalyzePayoffProps {
  onBack: () => void
}

type TabType = 'chart' | 'table' | 'greeks'

export const AnalyzePayoff = ({ onBack }: AnalyzePayoffProps) => {
  const { selectedOrders } = useStrategyStore()
  const { selectedContract, currentPrice } = useTradeStore()
  const [activeTab, setActiveTab] = useState<TabType>('chart')
  const [targetPrice, setTargetPrice] = useState(selectedContract === 'BTC' ? 108068 : 3120)
  const [targetDate, setTargetDate] = useState("23 Oct 2025, 01:00pm IST")
  const [daysToExpiry, setDaysToExpiry] = useState(0)

  const calculateMaxProfit = () => {
    // Calculate based on selected orders
    const totalCost = selectedOrders.reduce((sum, order) => {
      const cost = order.price * order.quantity
      return order.side === 'buy' ? sum + cost : sum - cost
    }, 0)
    
    if (totalCost <= 0) return "Unlimited"
    return `${totalCost.toFixed(2)} USD`
  }

  const calculateMaxLoss = () => {
    // Calculate maximum loss based on selected orders
    const totalCost = selectedOrders.reduce((sum, order) => {
      const cost = order.price * order.quantity
      return order.side === 'buy' ? sum + cost : sum - cost
    }, 0)
    
    return `-${Math.abs(totalCost).toFixed(2)} USD`
  }

  const calculateBreakeven = () => {
    // Calculate breakeven price based on target price
    return `${targetPrice.toFixed(2)}`
  }

  // Reset functions
  const resetTargetPrice = () => {
    setTargetPrice(selectedContract === 'BTC' ? 108068 : 3120)
  }

  const resetTargetDate = () => {
    setTargetDate("23 Oct 2025, 01:00pm IST")
    setDaysToExpiry(0)
  }

  // Calculate slider position for target price
  const getPriceSliderPosition = () => {
    const basePrice = selectedContract === 'BTC' ? 108068 : 3120
    const minPrice = basePrice * 0.9
    const maxPrice = basePrice * 1.1
    return ((targetPrice - minPrice) / (maxPrice - minPrice)) * 100
  }

  // Calculate slider position for target date
  const getDateSliderPosition = () => {
    const maxDays = 30
    return ((30 - daysToExpiry) / maxDays) * 100
  }

  // Handle price slider change
  const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const basePrice = selectedContract === 'BTC' ? 108068 : 3120
    const minPrice = basePrice * 0.9
    const maxPrice = basePrice * 1.1
    const percentage = parseFloat(e.target.value) / 100
    const newPrice = minPrice + (maxPrice - minPrice) * percentage
    setTargetPrice(Math.round(newPrice))
  }

  // Handle date slider change
  const handleDateSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxDays = 30
    const percentage = parseFloat(e.target.value) / 100
    const newDays = Math.round(maxDays - (maxDays * percentage))
    setDaysToExpiry(newDays)
    
    // Update target date
    const targetDateObj = new Date("2025-10-23")
    targetDateObj.setDate(targetDateObj.getDate() + newDays)
    const formattedDate = targetDateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ", 01:00pm IST"
    setTargetDate(formattedDate)
  }

  const calculateRewardRisk = () => {
    const maxProfit = calculateMaxProfit()
    const maxLoss = calculateMaxLoss()
    
    if (maxProfit === "Unlimited") return "NA"
    
    const profit = parseFloat(maxProfit.replace(' USD', ''))
    const loss = parseFloat(maxLoss.replace('-', '').replace(' USD', ''))
    
    if (loss === 0) return "NA"
    return (profit / loss).toFixed(2)
  }

  // Generate PnL data for chart
  const generatePnLData = () => {
    const basePrice = selectedContract === 'BTC' ? 108068 : 3120
    const prices = []
    const pnlValues = []
    
    for (let i = -10; i <= 10; i++) {
      const price = basePrice + (i * basePrice * 0.01) // ±10% range
      const pnl = selectedOrders.reduce((sum, order) => {
        const intrinsicValue = order.type === 'call' 
          ? Math.max(0, price - order.strike)
          : Math.max(0, order.strike - price)
        
        const profit = order.side === 'buy' 
          ? intrinsicValue - order.price
          : order.price - intrinsicValue
        
        return sum + (profit * order.quantity)
      }, 0)
      
      prices.push(price)
      pnlValues.push(pnl)
    }
    
    return { prices, pnlValues }
  }

  // Generate Greeks data
  const generateGreeksData = () => {
    return selectedOrders.map(order => ({
      contract: `${order.side === 'buy' ? 'B' : 'S'} ${order.type === 'call' ? 'C' : 'P'}-${selectedContract}-${order.strike}-231025`,
      delta: order.type === 'call' ? 0.5 : -0.5,
      gamma: 0.00003,
      theta: order.side === 'buy' ? -0.29 : 0.29,
      vega: 0
    }))
  }

  return (
    <div className="h-full w-full flex flex-col border border-gray-300" style={{ color: 'var(--text-secondary)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:text-blue-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Basket Analyze
        </button>
      </div>

      {/* Key Metrics */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-green-400">Max Profit</span>
            <span className="text-green-400 font-medium">{calculateMaxProfit()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">Max Loss</span>
            <span className="text-red-400 font-medium">{calculateMaxLoss()}</span>
          </div>
          <div className="flex justify-between">
            <span>Reward / Risk</span>
            <span>{calculateRewardRisk()}</span>
          </div>
          <div className="flex justify-between">
            <span>Breakeven</span>
            <span className="font-medium">{calculateBreakeven()}</span>
          </div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <button 
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'chart' 
              ? 'border-green-500 text-green-500' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          PnL Chart
        </button>
        <button 
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'table' 
              ? 'border-green-500 text-green-500' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          PnL Table
        </button>
        <button 
          onClick={() => setActiveTab('greeks')}
          className={`px-4 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'greeks' 
              ? 'border-green-500 text-green-500' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Greeks Table
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        {activeTab === 'chart' && (
          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center relative" style={{ backgroundColor: 'var(--trading-bg)' }}>
            {/* Chart Visualization */}
            <div className="w-full h-full p-4">
              {/* Chart Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-green-500">On Expiry Date</span>
                  <span className="ml-4 text-green-500">On Target Date</span>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Current Price: {selectedContract === 'BTC' ? 108068 : 3120}
                </div>
              </div>
              
              {/* Chart Area */}
              <PnLChart
  prices={generatePnLData().prices}
  pnlValues={generatePnLData().pnlValues}
  breakeven={parseFloat(calculateBreakeven())}
  currentPrice={selectedContract === 'BTC' ? 108068 : 3120}
/>

            </div>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="h-full overflow-y-auto">
            <div className="space-y-2">
              {selectedOrders.map((order, index) => (
                <div key={order.id} className="flex items-center gap-4 p-3 border rounded" style={{ borderColor: 'var(--trading-border)' }}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-green-500" />
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs ${
                      order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {order.side === 'buy' ? 'B' : 'S'}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {order.type === 'call' ? 'C' : 'P'}-{selectedContract}-{order.strike}-231025
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        0.01 {selectedContract}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Est. Price</div>
                      <div>{order.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Entry Price</div>
                      <div>{order.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Target PnL</div>
                      <div className={order.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                        {(order.side === 'buy' ? order.price * 0.1 : -order.price * 0.1).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-4 p-3 border rounded" style={{ borderColor: 'var(--trading-border)' }}>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Projected PNL</div>
                  <div className="font-medium">0 USD</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current UPNL</div>
                  <div className="font-medium">0 USD</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selectedContract} Target Price</div>
                  <div className="font-medium">{targetPrice}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'greeks' && (
          <div className="h-full overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--trading-border)' }}>
                    <th className="text-left py-2 px-3" style={{ color: 'var(--text-secondary)' }}>Contract</th>
                    <th className="text-right py-2 px-3" style={{ color: 'var(--text-secondary)' }}>Delta</th>
                    <th className="text-right py-2 px-3" style={{ color: 'var(--text-secondary)' }}>Gamma</th>
                    <th className="text-right py-2 px-3" style={{ color: 'var(--text-secondary)' }}>Theta</th>
                    <th className="text-right py-2 px-3" style={{ color: 'var(--text-secondary)' }}>Vega</th>
                  </tr>
                </thead>
                <tbody>
                  {generateGreeksData().map((row, index) => (
                    <tr key={index} className="border-b" style={{ borderColor: 'var(--trading-border)' }}>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-white font-bold text-xs ${
                            row.contract.startsWith('B') ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {row.contract.startsWith('B') ? 'B' : 'S'}
                          </div>
                          <span className="text-xs">{row.contract.substring(2)}</span>
                        </div>
                      </td>
                      <td className="text-right py-2 px-3">{row.delta}</td>
                      <td className="text-right py-2 px-3">{row.gamma}</td>
                      <td className="text-right py-2 px-3">{row.theta}</td>
                      <td className="text-right py-2 px-3">{row.vega}</td>
                    </tr>
                  ))}
                  <tr className="font-medium bg-gray-50" style={{ backgroundColor: 'var(--trading-bg)' }}>
                    <td className="py-2 px-3">Total</td>
                    <td className="text-right py-2 px-3">0</td>
                    <td className="text-right py-2 px-3">-0.00001</td>
                    <td className="text-right py-2 px-3">-0.01</td>
                    <td className="text-right py-2 px-3">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--trading-border)' }}>
        <div className="grid grid-cols-2 gap-4">
          {/* Target Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{selectedContract} Target Price</label>
              <button 
                onClick={resetTargetPrice}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="flex-1 px-3 py-2 border rounded text-sm"
                style={{ borderColor: 'var(--trading-border)' }}
              />
              <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getPriceSliderPosition()}
                  onChange={handlePriceSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-200"
                  style={{ width: `${getPriceSliderPosition()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Target Date</label>
              <button 
                onClick={resetTargetDate}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetDate}
                readOnly
                className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
                style={{ borderColor: 'var(--trading-border)' }}
              />
              <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getDateSliderPosition()}
                  onChange={handleDateSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-200"
                  style={{ width: `${getDateSliderPosition()}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {daysToExpiry} days to Expiry
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
