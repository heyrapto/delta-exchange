"use client"

import { useTradeStore } from "@/store/trade-store"
import { useState, useEffect } from "react"

export const LeverageSelector = () => {
    const { leverage, setLeverage, setSetAsDefault } = useTradeStore()
    const [localLeverage, setLocalLeverage] = useState<number>(leverage)
  
    useEffect(() => {
      setLocalLeverage(leverage)
    }, [leverage])
  
    const handleChange = (val: number) => {
      setLocalLeverage(val)
      setLeverage(val) // updates store once
    }
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value)
      if (isNaN(value)) return
      const clamped = Math.max(1, Math.min(20, value))
      setLocalLeverage(clamped)
      setLeverage(clamped)
    }
  
    return (
      <div className="bg-transparent rounded p-3 space-y-3 relative">
        {/* Input */}
        <div className="relative border border-[#ADFF2F] rounded px-3 py-2 text-right">
          <input
            type="number"
            value={localLeverage}
            onChange={handleInputChange}
            className="bg-transparent w-full text-right text-[20px] font-semibold outline-none text-black pr-5"
            min={1}
            max={20}
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
            value={localLeverage}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full h-[4px] rounded-lg appearance-none cursor-pointer bg-gray-300"
            style={{
              background: `linear-gradient(to right, #ADFF2F 0%, #ADFF2F ${((localLeverage - 1) / 19) * 100}%, #E5E7EB ${((localLeverage - 1) / 19) * 100}%, #E5E7EB 100%)`,
            }}
          />
  
          {/* Tick Labels */}
          <div className="flex justify-between mt-1 text-[11px] text-gray-500 font-medium">
            {[1, 5, 10, 15, 20].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChange(opt)}
                className={`transition ${
                  localLeverage === opt
                    ? "text-black font-semibold"
                    : "hover:text-gray-700"
                }`}
                type="button"
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
            onChange={(e) => setSetAsDefault(e.target.checked)}
            className="w-3 h-3 rounded border-gray-600 bg-transparent"
          />
          Set {localLeverage}x as default leverage for all BTC options
        </label>
      </div>
    )
  }
  