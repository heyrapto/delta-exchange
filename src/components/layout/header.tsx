import Image from "next/image";
import Link from "next/link";
import { BiNotification, BiSearch } from "react-icons/bi";
import { Button } from "../ui/button";
import { AccountMargin } from "../ui/account-margin";
import { Wallet } from "../ui/wallet";
import { GiPositionMarker } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FcSettings } from "react-icons/fc";
import { BsBox } from "react-icons/bs";
import { navItems } from "@/consants";
import { HeaderAnalytics } from "../ui/header-analytics";

export const Header = () => {
  return (
    <header className="flex flex-col">
    <div className="flex items-center justify-between border-b p-2 border-gray-700">
      <div className="flex items-center gap-3">
        {/* <Image src="/logo.svg" alt="Logo" width={100} height={100} /> */}

        <ul className="flex items-center gap-3">
            {navItems.map((item, index) => (
                <li key={index}>
                    <Link href={item.href}>{item.label}</Link>
                </li>
            ))}
        </ul>

        <div className="relative">
            <BiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 rounded-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary">Add Bank</Button>
        <AccountMargin />
        <Wallet balance="100" />

        <div className="flex gap-2">
            {[<GiPositionMarker className="cursor-pointer text-gray-400" size={20} />, <CgProfile className="cursor-pointer text-gray-400" size={20} />, <BiNotification className="cursor-pointer text-gray-400" size={20} />, <FcSettings className="cursor-pointer text-gray-400" size={20} />, <BsBox className="cursor-pointer text-gray-400" size={20} />].map((j, i) => (
                <div key={i}>
                   {j}
                </div>
            ))}
        </div>
      </div>
      </div>

      {/* <HeaderAnalytics /> */}
    </header>
  );
};