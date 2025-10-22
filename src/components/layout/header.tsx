"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiChevronDown, BiNotification, BiSearch } from "react-icons/bi";
import { Button } from "../ui/button";
import { AccountMargin } from "../ui/account-margin";
import { Wallet } from "../ui/wallet";
import { GiPositionMarker } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FcSettings } from "react-icons/fc";
import { BsBox } from "react-icons/bs";
import { navItems } from "@/consants";

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

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
          {/* Logo */}
          <Image src="/logo.svg" width={100} height={30} alt="Logo" />

          {/* Nav */}
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
                <Link
                  href={item.href}
                  className="whitespace-nowrap hover:opacity-70 transition-opacity flex items-center gap-1"
                >
                  {item.label}
                  {item.dropdown && <BiChevronDown className="inline" />}
                </Link>

                {/* Dropdown */}
                {item.dropdown && activeDropdown === index && (
                  <ul
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md min-w-[150px] z-50 overflow-hidden"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.dropdown.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className="px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        <Link href={sub.href}>{sub.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Search */}
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
          <Button variant="primary">Add Bank</Button>

          <AccountMargin />
          <Wallet balance="100" />

          <div className="flex gap-4 flex-wrap justify-end">
            {[GiPositionMarker, CgProfile, BiNotification, FcSettings, BsBox].map(
              (Icon, i) => (
                <Icon
                  key={i}
                  size={20}
                  className="cursor-pointer transition-colors"
                  style={{ color: "var(--text-muted)" }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};