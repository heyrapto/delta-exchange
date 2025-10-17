"use client"

import { useState } from "react"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0);

    const renderContent = () => {
        switch (activePanel) {
            case 0: // Positions
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-500 mb-2">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Positions</p>
                    </div>
                )
            case 1: // Open Orders
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-600 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Open Order</p>
                    </div>
                )
            case 2: // Stop Orders
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-600 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Stop Orders</p>
                    </div>
                )
            case 3: // Tracker Assets
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-600 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Tracker Assets</p>
                    </div>
                )
            case 4: // Risk & Margin Details
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-1">Status</p>
                            <span className="border border-green-600 bg-green-900/30 text-green-400 rounded px-2 py-1 text-sm">
                                Healthy
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Initial Margin</p>
                                <p className="text-white text-lg">$0.00 <span className="text-gray-500 text-sm">(0.00%)</span></p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Maintenance Margin</p>
                                <p className="text-white text-lg">$0.00 <span className="text-gray-500 text-sm">(0.00%)</span></p>
                            </div>
                        </div>
                    </div>
                )
            case 5: // Fills
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-600 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Fills</p>
                    </div>
                )
            case 6: // Order History
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-gray-600 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <p className="text-gray-400">No Order History</p>
                    </div>
                )
            default:
                return null
        }
    }

    const panelTabs = [
        { id: 0, title: "Positions" },
        { id: 1, title: "Open Orders" },
        { id: 2, title: "Stop Orders" },
        { id: 3, title: "Tracker Assets" },
        { id: 4, title: "Risk & Margin Details", isHealthy: true },
        { id: 5, title: "Fills" },
        { id: 6, title: "Order History" },
    ]

    const handlePanelToggle = (id: number) => {
        setActivePanel(id)
    }

    return (
        <div className="w-full flex flex-col min-h-[500px]">
            <div className="flex gap-6 border-b pb-2 border-gray-700 relative">
                {panelTabs.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => handlePanelToggle(p.id)}
                        className="text-white text-[18px] inline-flex items-center gap-2 cursor-pointer relative pb-2"
                    >
                        <h1>{p.title}</h1>
                        {p.isHealthy && (
                            <span className="border border-green-600 bg-green-900/50 text-green-300 rounded-[40%] px-1 py-[1px] text-[9px]">
                                Healthy
                            </span>
                        )}

                        {/* underline only for active */}
                        {activePanel === p.id && (
                            <span className="absolute bottom-[-10px] left-0 right-0 mx-auto h-[2px] bg-orange-500 rounded-full" />
                        )}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    )
}