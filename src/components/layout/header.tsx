"use client";

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
  return (
    <header className="w-full border-b sticky top-0 z-50 border-gray-300" style={{backgroundColor: 'var(--header-bg)', color: 'var(--text-primary)' }}>
      <div className="md:flex hidden flex-nowrap items-center justify-between px-4 py-2 gap-3 lg:gap-6">
        {/* Left section */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {/* Logo */}
          <Image
          src="/logo.svg"
          width={100}
          height={30}
          alt="Logo"
          />

          {/* Nav */}
          <ul className="xl:flex hidden flex-wrap items-center gap-4 shrink-0 text-sm">
            {navItems.map((item, index) => (
              <li key={index} className="relative transition-colors" style={{ color: 'var(--nav-link-color)' }}>
                {item.hasNew && (
                    <p className="absolute top-[-15px] right-0 w-fit px-2 text-center text-[9px] text-white" style={{ backgroundColor: 'var(--warning-color)' }}>New</p>
                )}
                <Link
                  href={item.href}
                  className="whitespace-nowrap hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--nav-link-color)' }}
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                    <BiChevronDown className="inline" />
                )}
              </li>
            ))}
          </ul>

          {/* Search */}
          <div className="relative flex-shrink">
            <BiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 px-4 h-[42px] w-[180px] rounded-none border focus:outline-none focus:ring-2 text-sm"
              style={{ 
                borderColor: 'var(--form-input-border)', 
                backgroundColor: 'var(--form-input-bg)', 
                color: 'var(--form-input-text)'
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 justify-end">
          <Button
            variant="primary"
          >
            Add Bank
          </Button>

          <AccountMargin />
          <Wallet balance="100" />

          <div className="flex gap-4 flex-wrap justify-end">
            {[GiPositionMarker, CgProfile, BiNotification, FcSettings, BsBox].map(
              (Icon, i) => (
                <Icon
                  key={i}
                  size={20}
                  className="cursor-pointer transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
