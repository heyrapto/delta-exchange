"use client"

import React, { useState } from 'react';
import { BiChevronDown, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { BsStar } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi';

export const HeaderAnalytics = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLotSizeModal, setShowLotSizeModal] = useState(false);
    const [activeTab, setActiveTab] = useState('straddle');

    return (
        <div className="w-full relative z-10" style={{ color: 'var(--text-primary)' }}>
            {/* Main Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: 'var(--table-border)' }}>
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

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-red-500">$1286.0</span>
                    <BiTrendingDown className="w-5 h-5 text-red-500" />
                </div>

                {/* Analytics */}
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
                <button 
                    onClick={() => setShowLotSizeModal(!showLotSizeModal)}
                    className="flex items-center gap-2 text-sm hover:bg-gray-800 px-3 py-2 rounded transition-colors relative"
                >
                    <span className="text-gray-400">Lot Size</span>
                    <span className="text-white font-medium">0.001 BTC</span>
                    <BiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLotSizeModal ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Lot Size Modal */}
            {showLotSizeModal && (
                <div className="absolute right-6 top-20 w-[520px] bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 animate-slideInFromLeft">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                            <h3 className="text-lg font-medium">BTC Call</h3>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Exercise Style</span>
                                <span className="text-white">Cash-settled European option</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Expires at (Local Time)</span>
                                <span className="text-white">2025-10-18 13:00:00</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Effective Settlement Currency</span>
                                <span className="text-white">INR</span>
                            </div>

                            <div className="flex justify-between items-start py-2">
                                <span className="text-gray-400">Initial Margin(Short)</span>
                                <div className="text-right">
                                    <div className="text-white">0.5 % × Index Price</div>
                                    <div className="text-white">+ Option Mark Price</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Max Leverage</span>
                                <span className="text-white">200x</span>
                            </div>

                            <div className="flex justify-between items-start py-2">
                                <span className="text-gray-400">Maintenance Margin (Short)</span>
                                <div className="text-right">
                                    <div className="text-white">0.25 % × Index Price</div>
                                    <div className="text-white">+ Option Mark Price</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Underlying Index</span>
                                <span className="text-green-500">.DEXBTUSD</span>
                            </div>

                            <div className="flex justify-between items-start py-2">
                                <span className="text-gray-400">Position Limit</span>
                                <div className="text-right">
                                    <div className="text-white">255.633 BTC</div>
                                    <div className="text-white">255,633 contracts</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Status</span>
                                <span className="text-white">Operational</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-800">
                            <button className="flex items-center justify-center gap-2 w-full text-green-500 hover:text-green-400 transition-colors text-sm">
                                See full contract specifications
                                <HiOutlineExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expanded Section - Slides in from Left */}
            <div className={`absolute left-0 top-full w-[700px] h-screen bg-gray-900 border-r border-gray-800 border-b transform transition-transform duration-300 ease-in-out z-40 ${isExpanded ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="px-6 py-4 max-h-[calc(100vh-150px)] overflow-y-auto">
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
                        <button className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors text-sm">
                            Go to Options Chain
                            <span className="text-lg">›</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for Lot Size Modal */}
            {showLotSizeModal && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLotSizeModal(false)}
                />
            )}

            <style jsx>{`
                @keyframes slideInFromLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slideInFromLeft {
                    animation: slideInFromLeft 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};