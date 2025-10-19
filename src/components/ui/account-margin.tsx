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
        className="cursor-pointer px-4 h-[42px] rounded-none flex items-center border transition-colors duration-150"
        style={{ 
          backgroundColor: 'var(--button-secondary-bg)', 
          borderColor: 'var(--button-secondary-border)'
        }}
      >
        <div className="flex items-center justify-between gap-2 w-[110px]">
          <div className="flex gap-3">
            <h1 className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Account Margin</h1>
            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>Main Cross</p>
          </div>
          <BiChevronDown
            className="group-hover:rotate-[180deg] transition-colors"
            style={{ color: 'var(--text-muted)' }}
            size={25}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className="absolute top-[45px] right-0 w-[350px] rounded-md flex flex-col gap-2 px-4 py-3 shadow-lg z-50 opacity-0 pointer-events-none 
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
