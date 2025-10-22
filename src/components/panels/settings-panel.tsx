"use client";

import { AnimatePresence, motion } from "framer-motion";

export const SettingsPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
            className="fixed top-0 right-0 h-full w-[90%] sm:w-[420px] z-[100] shadow-2xl flex flex-col bg-white"
            style={{ color: "var(--text-primary)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="text-base font-medium">Settings</h2>
              <button className="text-sm" onClick={onClose}>✕</button>
            </div>
            <div className="p-5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {/* Keep UI minimal to respect existing styling */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Confirmation Messages</span>
                  <input type="checkbox" className="accent-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Alerts</span>
                  <input type="checkbox" className="accent-green-500" />
                </div>
                <button className="w-full border py-2 text-sm" style={{ borderColor: 'var(--border-color)' }}>Manage All Preferences</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}