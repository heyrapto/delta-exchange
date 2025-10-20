"use client"

import { useState } from "react"
import { BiWallet } from "react-icons/bi"

export const Wallet = ({ balance }: any) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
        className="cursor-pointer px-2 sm:px-4 h-[36px] sm:h-[42px] flex gap-1 items-center rounded-none border justify-center"
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        style={{
            backgroundColor: 'var(--button-secondary-bg)',
            borderColor: hover ? 'var(--button-primary-bg)' : 'var(--button-secondary-border)'
        }}
        >
            <BiWallet size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: 'var(--text-primary)' }} />
            <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-primary)' }}>${balance}</p>
        </div>
    )
}