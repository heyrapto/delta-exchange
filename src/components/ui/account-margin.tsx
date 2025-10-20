"use client";

import { BiChevronDown } from "react-icons/bi";

export const AccountMargin = () => {
  const dropdownItems = [
    { title: "Account in use", desc: "Main", header: true },
    { title: "Margin mode", desc: "Cross" },
    { title: "Available margin", desc: "0 USD" },
  ];

  return (
    <div className="relative group inline-block" style={{ color: 'var(--text-primary)' }}>
      {/* Trigger Box */}
      <div
        className="cursor-pointer px-2 sm:px-4 h-[36px] sm:h-[42px] rounded-none flex items-center border transition-colors duration-150"
        style={{ 
          backgroundColor: 'var(--button-secondary-bg)', 
          borderColor: 'var(--button-secondary-border)'
        }}
      >
        <div className="flex items-center justify-between gap-1 sm:gap-2 w-[90px] sm:w-[110px]">
          <div className="flex gap-1 sm:gap-3 min-w-0">
            <h1 className="text-[10px] sm:text-xs font-bold truncate" style={{ color: 'var(--text-secondary)' }}>Account Margin</h1>
            <p className="text-[10px] sm:text-xs truncate" style={{ color: 'var(--text-primary)' }}>Main Cross</p>
          </div>
          <BiChevronDown
            className="group-hover:rotate-[180deg] transition-colors w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className="absolute top-[40px] sm:top-[45px] right-0 w-[280px] sm:w-[350px] rounded-md flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 shadow-lg z-50 opacity-0 pointer-events-none 
        group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        {dropdownItems.map((d, i) => (
          <div
            key={i}
            className={`flex justify-between text-sm py-1 ${
              d.header ? "border-b pb-2 mb-2" : ""
            }`}
            style={{ borderColor: d.header ? 'var(--table-border)' : 'transparent' }}
          >
            <h1 style={{ color: 'var(--text-secondary)' }}>{d.title}</h1>
            <p style={{ color: 'var(--text-primary)' }}>{d.desc}</p>
          </div>
        ))}

        {/* Right-aligned button */}
        <div className="flex justify-end mt-4">
          <button className="inline-flex items-center justify-center border text-xs px-3 py-2 rounded-md transition-colors" style={{ borderColor: 'var(--button-primary-bg)', color: 'var(--button-primary-bg)' }}>
            Change margin mode
          </button>
        </div>
      </div>
    </div>
  );
};
