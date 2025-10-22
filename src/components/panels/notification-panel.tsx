"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

export const NotificationPanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[90%] sm:w-[420px] z-[100] shadow-2xl flex flex-col bg-white"
            style={{
              color: "var(--text-primary)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <h2 className="text-base font-medium">Notifications</h2>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <span>Show Unread</span>
                  <input type="checkbox" className="accent-blue-500" />
                </label>

                <IoMdClose
                  size={22}
                  className="cursor-pointer hover:opacity-70"
                  onClick={onClose}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
              <div className="opacity-60 text-sm">
                <div className="text-5xl mb-3">📄</div>
                <p>You have caught up.</p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="border-t py-3 text-center text-sm cursor-pointer hover:opacity-80"
              style={{ borderColor: "var(--border-color)" }}
            >
              View All →
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
