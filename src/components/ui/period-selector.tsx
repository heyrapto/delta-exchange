"use client"

import { useTradeStore } from "@/store/trade-store"
import { Slider } from "./reusable/slider"

const formatExpirationDate = (days: number): string => {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + days)
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = expirationDate.getDate()
  const month = months[expirationDate.getMonth()]
  const year = expirationDate.getFullYear()
  const hours = expirationDate.getHours()
  const minutes = expirationDate.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  
  return `${day} ${month} ${year}, ${displayHours}:${displayMinutes}${ampm} IST`
}

export const PeriodSelector = () => {
    const {
        period,
        setPeriod,
    } = useTradeStore()

    const handlePeriodChange = (value: string) => {
        setPeriod(value)
    }

    return (
        <div className="relative bg-transparent border border-white/0 px-6 py-[14px] rounded-lg flex flex-col gap-3 justify-between">
            <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
            <p className="text-black font-normal text-sm">
                Period: <span className="text-black font-semibold text-sm">{period} days</span>
            </p>

            <Slider
                value={[+period]}
                onValueChange={(value) => handlePeriodChange(value[0].toString())}
                max={90}
                min={7}
                step={1}
                className="cursor-grab"
            />

            <p className="text-xs leading-[18px] font-normal text-gray-700">
                Expiration Date: <span className="font-semibold text-xs leading-[18px]">{formatExpirationDate(parseInt(period))}</span>
            </p>
        </div>
    )
}