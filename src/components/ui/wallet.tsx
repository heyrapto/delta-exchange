"use client"

import { useState } from "react"
import { BiWallet } from "react-icons/bi"

export const Wallet = ({ balance }: any) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
        className={`bg-gray-800 cursor-pointer px-4 h-[42px] flex gap-1 items-center rounded-none border justify-center ${hover ? "border-orange-500" : "border-gray-700"}`}
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        >
            <BiWallet size={18} />
            <p className="text-xs">${balance}</p>
        </div>
    )
}