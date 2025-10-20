"use client";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import { GiTrade } from "react-icons/gi";
import { MdShowChart } from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { LuChartCandlestick } from "react-icons/lu";

export const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("chart"); // default active tab

  const navItems = [
    { id: "home", label: "Home", icon: <HiHome /> },
    { id: "markets", label: "Markets", icon: <LuChartCandlestick /> },
    { id: "trade", label: "Trade", icon: <GiTrade /> },
    { id: "chart", label: "Chart/ Book", icon: <MdShowChart /> },
    { id: "portfolio", label: "Portfolio", icon: <IoBriefcaseOutline /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100/50 md:hidden">
      {/* Orange Banner - Only visible on Chart/Book */}
      {activeTab === "chart" && (
        <div className="bg-[#79c607] w-full mx-auto text-white text-xs py-2 flex items-center justify-center relative">
          <span className="font-medium">Get Verified To Trade</span>
          <AiOutlineInfoCircle className="absolute right-3 w-4 h-4 opacity-80" />
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="flex justify-around items-center text-gray-600 text-[11px] py-2 bg-white">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "text-[#79c607]"
                  : "text-gray-500"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <span className={`${isActive ? "font-medium" : "font-normal"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
