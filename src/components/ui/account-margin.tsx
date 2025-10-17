"use client";

import { BiChevronDown } from "react-icons/bi";

export const AccountMargin = () => {
  const dropdownItems = [
    { title: "Account in use", desc: "Main", header: true },
    { title: "Margin mode", desc: "Cross" },
    { title: "Available margin", desc: "0 USD" },
  ];

  return (
    <div className="relative group inline-block text-white">
      {/* Trigger Box */}
      <div
        className="bg-gray-800 cursor-pointer px-4 h-[42px] rounded-none flex items-center border border-gray-700 group-hover:border-orange-500 transition-colors duration-150"
      >
        <div className="flex items-center justify-between gap-2 w-[110px]">
          <div className="flex gap-3">
            <h1 className="text-xs font-bold text-gray-400">Account Margin</h1>
            <p className="text-xs text-gray-200">Main Cross</p>
          </div>
          <BiChevronDown
            className="text-gray-500 group-hover:text-orange-500 group-hover:rotate-[180deg] transition-colors"
            size={25}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className="absolute top-[45px] right-0 w-[350px] bg-gray-800 border border-gray-700 rounded-md flex flex-col gap-2 px-4 py-3 shadow-lg z-50 opacity-0 pointer-events-none 
        group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
      >
        {dropdownItems.map((d, i) => (
          <div
            key={i}
            className={`flex justify-between text-sm py-1 ${
              d.header ? "border-b border-gray-700 pb-2 mb-2" : ""
            }`}
          >
            <h1 className="text-gray-400">{d.title}</h1>
            <p className="text-gray-200">{d.desc}</p>
          </div>
        ))}

        {/* Right-aligned button */}
        <div className="flex justify-end mt-4">
          <button className="inline-flex items-center justify-center border border-orange-500 text-orange-500 text-xs px-3 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors">
            Change margin mode
          </button>
        </div>
      </div>
    </div>
  );
};
