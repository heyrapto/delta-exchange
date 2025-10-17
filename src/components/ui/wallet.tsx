"use client"

import { useState } from "react"
import { BiWallet } from "react-icons/bi"

export const Wallet = ({ balance }: any) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
        className={`bg-gray-800 cursor-pointer h-[45px]  px-4 py-2 flex gap-2 items-center rounded-none border justify-center ${hover ? "border-orange-500" : "border-gray-700"}`}
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        >
            <BiWallet />
            <p>${balance}</p>
        </div>
    )
}