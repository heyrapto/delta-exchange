"use client"

import React, { useState } from 'react';
import { BiChevronDown, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { BsStar } from 'react-icons/bs';

export const HeaderAnalytics = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('straddle');

    return (
        <div className="w-full text-white">
            {/* Main Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                {/* Left Section - Contract Info */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <BsStar className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-medium">C-BTC-105600-181025</span>
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            <BiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                {/* Center Section - Price */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-red-500">$1286.0</span>
                    <BiTrendingDown className="w-5 h-5 text-red-500" />
                </div>

                {/* Right Section - Analytics */}
                <div className="flex items-center gap-8 text-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400">24h Change</span>
                        <span className="text-red-500 font-medium">-59.24%</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400">24h Vol.</span>
                        <span className="text-white font-medium">$1.6M</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400">OI</span>
                        <span className="text-white font-medium">$408.3K</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400">Settlement</span>
                        <span className="text-white font-medium">20h:35m:17s</span>
                    </div>
                </div>
                </div>

                {/* Lot Size */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Lot Size</span>
                    <span className="text-white font-medium">0.001 BTC</span>
                    <BiTrendingUp className="w-4 h-4 text-red-400" />
                </div>
            </div>

            {/* Expanded Section */}
            {isExpanded && (
                <div className="px-6 py-4 border-b border-gray-800 w-[700px] h-screen">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-gray-600"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mb-4">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            Watchlist
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            Futures
                        </button>
                        <button 
                            onClick={() => setActiveTab('straddle')}
                            className={`relative transition-colors ${activeTab === 'straddle' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Straddle
                            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 bg-yellow-600 text-xs rounded text-black font-semibold">
                                NEW
                            </span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            Trackers
                        </button>
                    </div>

                    {/* Table Header */}
                    <div className="flex items-center justify-between text-sm text-gray-400 pb-3 border-b border-gray-800">
                        <div className="w-1/3">Name</div>
                        <div className="w-1/4 text-right">Last Price</div>
                        <div className="w-1/4 text-right flex items-center justify-end gap-1">
                            24h Chg.
                            <BiChevronDown className="w-3 h-3" />
                        </div>
                        <div className="w-1/4 text-right flex items-center justify-end gap-1">
                            24h Vol.
                            <BiChevronDown className="w-3 h-3" />
                        </div>
                    </div>

                    {/* No Contracts Found State */}
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 mb-4 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border-2 border-gray-700 rounded-full"></div>
                                </div>
                                <svg className="w-20 h-20 text-gray-600" viewBox="0 0 80 80" fill="none">
                                    <path d="M20 25h40M20 35h40M20 45h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M70 70l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">No contracts found</p>
                    </div>

                    {/* Go to Options Chain Link */}
                    <div className="flex justify-center pt-4">
                        <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm">
                            Go to Options Chain
                            <span className="text-lg">›</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};