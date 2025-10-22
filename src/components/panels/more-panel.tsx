"use client";

import { AnimatePresence, motion } from "framer-motion";

export const MorePanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-[90%] sm:w-[520px] z-[100] shadow-2xl flex flex-col bg-white"
            style={{ color: "var(--text-primary)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="text-base font-medium">More</h2>
              <button className="text-sm" onClick={onClose}>✕</button>
            </div>
            <div className="p-5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <div className="grid grid-cols-2 gap-3">
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Trading Fees</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>API Docs</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Contract Specs</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Trade Data</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Blog</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Settlement Prices</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Platform Status</button>
                <button className="border px-3 py-2 text-left" style={{ borderColor: 'var(--border-color)' }}>Offers</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}