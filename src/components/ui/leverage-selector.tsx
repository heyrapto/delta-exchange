"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"

interface LeverageSelectorProps {
    maxLeverage?: number
    isGNS?: boolean
}

export const LeverageSelector = ({ maxLeverage = 200, isGNS = false }: LeverageSelectorProps) => {
    const { state, handleGNSLeverageChange } = useAppContext()
    const [setAsDefault, setSetAsDefault] = useState(false)
    
    const leverage = isGNS ? state.gnsLeverage : 1
    const setLeverage = isGNS ? handleGNSLeverageChange : () => {}

    // Generate leverage options based on max leverage
    const getLeverageOptions = () => {
        if (maxLeverage <= 20) {
            return [1, 5, 10, 15, 20]
        } else if (maxLeverage <= 50) {
            return [1, 10, 25, 50]
        } else if (maxLeverage <= 100) {
            return [1, 25, 50, 100]
        } else {
            return [1, 50, 100, 150, 200]
        }
    }

    const leverageOptions = getLeverageOptions()

    const isValidNumericInput = (value: string): boolean => {
        const numericRegex = /^[0-9]*\.?[0-9]*$/
        return numericRegex.test(value) || value === ''
    }

    const handleLeverageChange = (value: number) => {
        // Clamp and set
        const clamped = Math.max(1, Math.min(maxLeverage, Math.round(value)))
        setLeverage(clamped)
    }

    return (
        <div className="bg-transparent rounded p-3 space-y-3 relative">
            <div className="relative border border-[#ADFF2F] rounded px-3 py-2 text-right">
                <input
                    type="number"
                    value={leverage}
                    onChange={(e) => {
                        const value = e.target.value
                        if (isValidNumericInput(value)) {
                            const next = Number(value)
                            if (!Number.isNaN(next)) {
                                handleLeverageChange(next)
                            }
                        }
                    }}
                    className="bg-transparent w-full text-right text-[20px] font-semibold outline-none text-black pr-5"
                    min={1}
                    max={maxLeverage}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-[20px] font-semibold">x</span>
            </div>

            <div className="relative">
                <input
                    type="range"
                    min={1}
                    max={maxLeverage}
                    step={1}
                    value={leverage}
                    onChange={(e) => handleLeverageChange(parseInt(e.target.value, 10))}
                    className="w-full h-[4px] rounded-lg appearance-none cursor-pointer bg-gray-300"
                    style={{
                        background: `linear-gradient(to right, #ADFF2F 0%, #ADFF2F ${((leverage - 1) / (maxLeverage - 1)) * 100}%, #E5E7EB ${((leverage - 1) / (maxLeverage - 1)) * 100}%, #E5E7EB 100%)`,
                    }}
                />

                <div className="flex justify-between mt-1 text-[11px] text-gray-500 font-medium">
                    {leverageOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleLeverageChange(opt)}
                            className={`transition ${leverage === opt ? 'text-black font-semibold' : 'hover:text-gray-700'}`}
                        >
                            {opt}x
                        </button>
                    ))}
                </div>
            </div>

            <label className="flex items-center gap-2 text-[10px] text-gray-400 cursor-pointer">
                <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="w-3 h-3 rounded border-gray-600 bg-transparent"
                />
                Set {leverage}x as default leverage{isGNS ? ' for all futures' : ' for all BTC options'}
            </label>
        </div>
    )
}