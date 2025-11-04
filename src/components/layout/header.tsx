"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { Button } from "../ui/reusable/button";
import { AccountMargin } from "../ui/account-margin";
import { Wallet } from "../ui/reusable/wallet";
import { FcSettings } from "react-icons/fc";
import { BsBox } from "react-icons/bs";
import { GrNotification } from "react-icons/gr";
import { navItems } from "@/consants";
import { AccountDropdown } from "../dropdowns/account";
import { NotificationPanel } from "../panels/notification-panel";
import { SettingsPanel } from "../panels/settings-panel";
import { MorePanel } from "../panels/more-panel";
import { useToast } from "../ui/reusable/toast";

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { showToast, ToastContainer } = useToast();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="w-full border-b sticky top-0 z-50 border-gray-300"
      style={{
        backgroundColor: "var(--header-bg)",
        color: "var(--text-primary)",
      }}
    >
      <div className="md:flex hidden flex-nowrap items-center justify-between px-4 py-2 gap-3 lg:gap-6">
        {/* Left section */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <Image src="/logo.svg" width={100} height={30} alt="Logo" />

          <ul
            ref={dropdownRef}
            className="xl:flex hidden flex-wrap items-center gap-4 shrink-0 text-sm relative"
          >
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative transition-colors cursor-pointer"
                style={{ color: "var(--nav-link-color)" }}
                onClick={() =>
                  item.dropdown
                    ? setActiveDropdown(
                      activeDropdown === index ? null : index
                    )
                    : null
                }
              >
                {item.hasNew && (
                  <p
                    className="absolute top-[-15px] right-0 w-fit px-2 text-center text-[9px] text-white"
                    style={{ backgroundColor: "var(--warning-color)" }}
                  >
                    New
                  </p>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap hover:opacity-70 transition-opacity flex items-center gap-1"
                  >
                    {item.label}
                    {item.dropdown && <BiChevronDown className="inline" />}
                  </Link>
                ) : (
                  <span className="whitespace-nowrap flex items-center gap-1 text-gray-600">
                    {item.label}
                    {item.dropdown && <BiChevronDown className="inline" />}
                  </span>
                )}


                {item.dropdown && activeDropdown === index && (
                  <div
                    className="absolute top-full left-0 mt-2 shadow-2xl rounded-md min-w-[320px] z-50 overflow-hidden py-4 bg-white border border-gray-300 text-black"
                  >
                    {item.dropdown.map((sub, subIndex) => (
                      <div key={subIndex}>
                        {sub.section && (
                          <div
                            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
                          >
                            {sub.section}
                          </div>
                        )}
                        <Link href={sub.href}>
                          <div className="px-4 py-3 hover:bg-opacity-10 hover:bg-white transition-colors flex items-start gap-3 cursor-pointer">
                            {sub.icon && (
                              <div
                                className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 mt-1"
                                style={{ backgroundColor: sub.iconBg || "var(--icon-bg, #2a2a2a)" }}
                              >
                                {sub.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-black">
                                {sub.label}
                              </div>
                              {sub.description && (
                                <div
                                  className="text-xs mt-0.5"
                                  style={{ color: "var(--dropdown-desc, #999)" }}
                                >
                                  {sub.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="relative flex-shrink">
            <BiSearch
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 px-4 h-[42px] w-[180px] rounded-none border focus:outline-none focus:ring-2 text-sm"
              style={{
                borderColor: "var(--form-input-border)",
                backgroundColor: "var(--form-input-bg)",
                color: "var(--form-input-text)",
              }}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 justify-end">
          <Button variant="primary" onClick={() => showToast("Coming soon", "info")}>Add Bank</Button>

          <AccountMargin />
          <Wallet balance="0.00" />
          <div className="flex gap-4 items-center">
            <AccountDropdown />
            <GrNotification
              size={20}
              className="cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setNotifOpen(true)}
            />
            <FcSettings className="cursor-pointer" size={20} style={{ color: "var(--text-muted)" }} onClick={() => setSettingsOpen(true)} />
            <BsBox className="cursor-pointer" size={20} style={{ color: "var(--text-muted)" }} onClick={() => setMoreOpen(true)} />
          </div>
        </div>
      </div>

      {/* Panels */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <MorePanel isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
      <ToastContainer />
    </header>
  );
};