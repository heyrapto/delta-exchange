import { navItemProps } from "@/types";
import { BiGitBranch, BiBot, BiData, BiGift, BiShareAlt, BiKey, BiLineChart } from "react-icons/bi";

export const navItems: navItemProps[] = [
    {
        label: "Markets",
        href: "/markets",
    },
    {
        label: "Futures",
        href: "/futures",
    },
    {
        label: "Options",
        href: "/options",
    },
    // {
    //     label: "Straddle",
    //     href: "/",
    //     hasNew: true,
    // },
    // {
    //     label: "Trackers",
    //     href: "/",
    // },
    {
        label: "AlgoHub",
        dropdown: [
            {
                label: "API",
                description: "Simulate real trading without risk",
                href: "/demo-trading",
                icon: <BiLineChart size={20} color="#fff" />,
                iconBg: "#4a90e2"
            },
            {
                label: "Trading Bot",
                description: "Create API key and Start Trading",
                href: "/apis",
                icon: <BiKey size={20} color="#fff" />,
                iconBg: "#4a90e2"
            },
            {
                label: "Trade Data",
                description: "Download historical tick by tick data",
                href: "/trade-data",
                icon: <BiData size={20} color="#fff" />,
                iconBg: "#4a90e2"
            },
        ],
    },
    {
        label: "More",
        dropdown: [
            {
                section: "Trade",
                label: "Strategy Builder",
                description: "Create and analyse basket orders",
                href: "/strategy-builder",
                icon: <BiGitBranch size={20} color="#fff" />,
                iconBg: "#ff6b35"
            },
            {
                label: "Demo Trading",
                description: "Simulate real trading without risk",
                href: "/demo-trading",
                icon: <BiLineChart size={20} color="#fff" />,
                iconBg: "#4a90e2"
            },
            {
                section: "Data",
                label: "Analytics",
                description: "A dashboard to visualize options data",
                href: "/analytics",
                icon: <BiData size={20} color="#fff" />,
                iconBg: "#ff6b35"
            },
            {
                section: "Rewards & Promotions",
                label: "Offers",
                description: "Claim Your Rewards",
                href: "/offers",
                icon: <BiGift size={20} color="#fff" />,
                iconBg: "#ff6b35"
            },
            {
                label: "Referral Program",
                description: "Refer Friends and get rewards",
                href: "/referral",
                icon: <BiShareAlt size={20} color="#fff" />,
                iconBg: "#ff6b35"
            }
        ],
    },
];