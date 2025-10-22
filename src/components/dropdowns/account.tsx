"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdOutlineVerifiedUser,
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import {
  FiSettings,
  FiKey,
  FiShare2,
  FiShield,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";
import { AiOutlineBank } from "react-icons/ai";
import { LuClipboardList } from "react-icons/lu";
import { TbChartPie } from "react-icons/tb";

export const AccountDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: MdOutlineVerifiedUser, label: "Identity Verification" },
    { icon: MdOutlineSubdirectoryArrowRight, label: "Sub Accounts" },
    { icon: FiSettings, label: "Preferences" },
    { icon: TbChartPie, label: "PNL Analytics" },
    { icon: AiOutlineBank, label: "Bank Details" },
    { icon: FiShare2, label: "Refer & Earn" },
    { icon: FiShield, label: "Security" },
    { icon: FiKey, label: "API Keys" },
    { icon: LuClipboardList, label: "Transaction Logs" },
    { icon: FiTrash2, label: "Clear Cache" },
    { icon: FiLogOut, label: "Logout", danger: true },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Profile Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-center rounded-full p-1 transition hover:opacity-80 cursor-pointer"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="sr-only">Open account menu</span>
        {/* Replace with your profile icon */}
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-3.309 0-6 2.691-6 6v2h12v-2c0-3.309-2.691-6-6-6z" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-64 rounded-lg border shadow-lg z-50 animate-slideIn bg-white"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">ka****@****.com</span>
              <button
                className="text-xs px-2 py-1 rounded-md"
                style={{
                  backgroundColor: "var(--warning-color)",
                  color: "#fff",
                }}
              >
                Get Verified
              </button>
            </div>
            <p className="text-xs opacity-70">User ID: 82576549</p>
            <p className="text-xs opacity-70">Account: Main</p>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col py-2 text-sm">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    item.danger
                      ? "hover:bg-red-500/20 hover:text-red-400"
                      : "hover:bg-[var(--hover-bg)]"
                  }`}
                  style={{
                    color: item.danger
                      ? "var(--danger-color)"
                      : "var(--text-primary)",
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
