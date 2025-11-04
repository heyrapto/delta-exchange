"use client"

import { useState } from "react"
import { Button } from "./reusable/button"
import { HiOutlineExternalLink } from "react-icons/hi"

interface MarketTradePanelProps {
  isLoggedIn?: boolean
}

export const MarketTradePanel = ({ isLoggedIn = false }: MarketTradePanelProps) => {
  const [leverage, setLeverage] = useState(20)

  if (!isLoggedIn) {
    return (
      <div className="w-full h-full flex flex-col bg-white border border-gray-300 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-gray-700 mb-6">
            Want to get started? Create an account in just a few seconds.
          </p>
          <Button variant="primary" className="w-full mb-4">
            Sign Up
          </Button>
          <div className="mb-4 text-gray-500 text-sm">OR</div>
          <Button variant="secondary" className="w-full mb-6">
            Log In
          </Button>
          <a
            href="#"
            className="text-sm text-[#ADFF2F] hover:underline flex items-center gap-1"
          >
            Try Delta's Demo Trading
            <HiOutlineExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Placeholder for order form elements when logged in */}
        <div className="space-y-4 opacity-30 pointer-events-none">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Leverage</span>
            <span className="font-medium">{leverage}x</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Market</div>
            <div className="text-xs text-gray-600">Bracket Order</div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Funds req:</span>
              <span>0.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Margin:</span>
              <span>0.00 USD</span>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs text-center">
            Save up to 50% with Scalper Offer
          </div>
          <button className="w-full py-2 bg-gray-300 text-gray-500 rounded text-sm">
            Activate
          </button>
        </div>
      </div>
    )
  }

  // Logged in view would show the actual trade form
  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300 p-4">
      <div className="text-sm font-medium mb-4">Place Order</div>
      {/* Full trade form would go here */}
      <div className="flex-1 text-center text-gray-500 text-sm flex items-center justify-center">
        Trade form (to be implemented)
      </div>
    </div>
  )
}
