"use client"

import { useTradeStore } from "@/store/trade-store"

export const LeverageSelector = () => {
    const {
        leverage,
        setLeverage,
        setAsDefault,
        setSetAsDefault,
    } = useTradeStore()

    const leverageOptions = [1, 5, 10, 15, 20]

    const isValidNumericInput = (value: string): boolean => {
        const numericRegex = /^[0-9]*\.?[0-9]*$/
        return numericRegex.test(value) || value === ''
    }

    const handleLeverageChange = (value: number) => {
        // Clamp and set
        const clamped = Math.max(1, Math.min(20, Math.round(value)))
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
                    max={20}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-[20px] font-semibold">x</span>
            </div>

            <div className="relative">
                <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={leverage}
                    onChange={(e) => handleLeverageChange(parseInt(e.target.value, 10))}
                    className="w-full h-[4px] rounded-lg appearance-none cursor-pointer bg-gray-300"
                    style={{
                        background: `linear-gradient(to right, #ADFF2F 0%, #ADFF2F ${((leverage - 1) / 19) * 100}%, #E5E7EB ${((leverage - 1) / 19) * 100}%, #E5E7EB 100%)`,
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
                Set {leverage}x as default leverage for all BTC options
            </label>
        </div>
    )
}