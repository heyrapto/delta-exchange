"use client"

import { useState } from "react"
import { BiWallet } from "react-icons/bi"

export const Wallet = ({ balance }: any) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
        className="cursor-pointer px-4 h-[42px] flex gap-1 items-center rounded-none border justify-center"
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        style={{
            backgroundColor: 'var(--button-secondary-bg)',
            borderColor: hover ? 'var(--button-primary-bg)' : 'var(--button-secondary-border)'
        }}
        >
            <BiWallet size={18} style={{ color: 'var(--text-primary)' }} />
            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>${balance}</p>
        </div>
    )
}