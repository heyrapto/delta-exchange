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
    <header className="w-full border-b border-gray-700 text-white sticky top-0 z-50">
      <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-3 lg:gap-6">
        {/* Left section */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {/* Logo */}
          {/* <Image src="/logo.svg" alt="Logo" width={100} height={100} /> */}

          {/* Nav */}
          <ul className="flex flex-wrap items-center gap-4 shrink-0 text-sm">
            {navItems.map((item, index) => (
              <li key={index} className="relative hover:text-orange-500 transition-colors">
                {item.hasNew && (
                    <p className="text-gray-900 absolute top-[-15px] right-0 bg-yellow-500 w-fit px-2 text-center text-[9px]">New</p>
                )}
                <Link
                  href={item.href}
                  className=" whitespace-nowrap"
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
            <BiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 px-4 h-[42px] w-[180px] rounded-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-800 text-sm"
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
                  className="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors"
                />
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
