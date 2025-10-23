"use client"

import { useState } from "react"
import { useStrategyStore } from "@/store/strategy-store"
import { useTradeStore } from "@/store/trade-store"
import { BiTrash } from "react-icons/bi"
import { AnalyzePayoff } from "./analyze-payoff"

export const StrategyBuilder = () => {
  const { selectedOrders, removeOrderFromStrategy, clearStrategy } = useStrategyStore()
  const { placeOrder } = useTradeStore()
  const [showAnalyzePayoff, setShowAnalyzePayoff] = useState(false)

  const getOrderColor = (side: 'buy' | 'sell') => {
    return side === 'buy' ? 'text-green-400' : 'text-red-400'
  }

  const getOrderBgColor = (side: 'buy' | 'sell') => {
    return side === 'buy' ? 'bg-green-500' : 'bg-red-500'
  }

  const getOrderText = (side: 'buy' | 'sell') => {
    return side === 'buy' ? 'B' : 'S'
  }

  const calculateTotalMargin = () => {
    return selectedOrders.reduce((total, order) => {
      return total + (order.price * order.quantity)
    }, 0)
  }

  const handlePlaceOrder = () => {
    // Convert strategy orders to trade orders
    selectedOrders.forEach(order => {
      placeOrder({
        side: order.side === 'buy' ? 'long' : 'short',
        orderType: 'market',
        price: order.price,
        quantity: order.quantity
      })
    })
    
    // Clear strategy after placing orders
    clearStrategy()
    
    // Show success message (you could add a toast here)
    console.log('Orders placed successfully!')
  }

  if (showAnalyzePayoff) {
    return <AnalyzePayoff onBack={() => setShowAnalyzePayoff(false)} />
  }

  if (selectedOrders.length === 0) {
    return (
      <div className="h-[700px] w-full flex flex-col items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-center">
            <p className="font-medium text-lg mb-1" style={{ color: 'var(--text-primary)' }}>+ Add Contracts from Options Chain</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Selected contracts will show up here
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[700px] w-full flex flex-col" style={{ color: 'var(--text-secondary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--trading-border)' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Orders Basket</h3>
        <div className="flex items-center gap-2">
          <button className="text-sm px-3 py-1 border rounded" style={{ borderColor: 'var(--trading-border)' }}>
            Add Futures
          </button>
          <span className="text-sm">ETH Contracts</span>
        </div>
        <button 
          onClick={clearStrategy}
          className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          style={{ borderColor: 'var(--trading-border)' }}
        >
          Clear All
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {selectedOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 p-3 border rounded" style={{ borderColor: 'var(--trading-border)' }}>
              {/* Buy/Sell Indicator */}
              <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${getOrderBgColor(order.side)}`}>
                {getOrderText(order.side)}
              </div>

              {/* Contract Info */}
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  {order.contract}
                </div>
                {order.leverage && (
                  <div className="text-xs bg-gray-200 px-1 py-0.5 rounded inline-block" style={{ color: 'var(--text-secondary)' }}>
                    {order.leverage}x
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 rounded bg-green-500 text-white text-xs flex items-center justify-center">
                  M
                </button>
                <span className="text-sm">Market Price</span>
              </div>

              {/* Quantity with Dropdown */}
              <div className="flex items-center gap-1">
                <div className="relative">
                  <select 
                    className="text-sm bg-transparent border rounded px-2 py-1"
                    style={{ borderColor: 'var(--trading-border)' }}
                    value="lot"
                    onChange={(e) => {
                      // Handle lot type change
                      console.log('Lot type changed to:', e.target.value)
                    }}
                  >
                    <option value="lot">1 Lot</option>
                    <option value="usd">USD</option>
                    <option value="eth">ETH</option>
                  </select>
                </div>
                <button 
                  onClick={() => removeOrderFromStrategy(order.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <BiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4" style={{ borderColor: 'var(--trading-border)' }}>
        {/* Margin Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Order Margin</span>
            <button className="text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 01-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium">${calculateTotalMargin().toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Available Margin</span>
            <span className="text-sm font-medium">$0</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAnalyzePayoff(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 border rounded hover:bg-gray-50" 
            style={{ borderColor: 'var(--trading-border)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>Analyse Payoff</span>
          </button>
          <button 
            className="flex-1 bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
