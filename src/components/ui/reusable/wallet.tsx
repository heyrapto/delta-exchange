"use client"

import { useState } from "react"
import { BiChevronDown, BiChevronUp, BiWallet } from "react-icons/bi"
import { motion, AnimatePresence } from "framer-motion"

export const Wallet = ({ balance }: any) => {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <div className="relative">
      {/* Wallet Button */}
      <div
        className="cursor-pointer px-3 sm:px-4 h-[38px] sm:h-[42px] flex gap-1 items-center rounded-md border justify-center transition-all"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: hover ? "#f8fff8" : "#ffffff",
          borderColor: hover ? "#4caf50" : "#d1e7d1",
        }}
      >
        <BiWallet size={18} style={{ color: "#1a1a1a" }} />
        <p className="text-[11px] sm:text-sm font-medium text-[#1a1a1a]">${balance}</p>
        {open ? (
          <BiChevronUp size={18} style={{ color: "#4caf50" }} />
        ) : (
          <BiChevronDown size={18} style={{ color: "#4caf50" }} />
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 rounded-xl border shadow-lg overflow-hidden z-50 bg-white"
            style={{ borderColor: "#d8f0d8" }}
          >
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-3 text-[#1a1a1a]">
                Account Value
              </h4>
              <p className="text-2xl font-bold text-[#4caf50] mb-1">₹{balance}</p>
              <p className="text-xs text-gray-500 mb-3">${balance}</p>

              <div className="flex gap-2 mb-4">
                <button
                  className="flex-1 py-1.5 rounded-lg text-white font-medium"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  + Add Funds
                </button>
                <button
                  className="flex-1 py-1.5 rounded-lg border font-medium"
                  style={{
                    color: "#4caf50",
                    borderColor: "#4caf50",
                    backgroundColor: "#ffffff",
                  }}
                >
                  Withdraw
                </button>
              </div>

              <div className="divide-y divide-[#e9f5e9] text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-[#1a1a1a] font-medium">
                    Trading Wallet
                  </span>
                  <span className="text-[#4caf50] font-medium">₹{balance}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Available Margin</span>
                  <span className="text-[#4caf50]">₹{balance}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Trackers Wallet</span>
                  <span className="text-[#4caf50]">₹{balance}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Delta Cash</span>
                  <span className="text-[#4caf50]">₹{balance}</span>
                </div>
              </div>

              <div className="border-t border-[#e9f5e9] mt-3 pt-2 flex justify-between text-xs text-gray-500">
                <span>Conversion Rate</span>
                <span>1 USD = ₹85</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
