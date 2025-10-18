"use client"

import { useState } from "react"
import { BiDownload, BiRefresh } from "react-icons/bi"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0)

    const EmptyPanelState = ({ title }: { title: string }) => (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-500 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <p className="text-gray-400">No {title}</p>
        </div>
    )

    const renderContent = () => {
        switch (activePanel) {
            case 0: return <EmptyPanelState title="Positions" />
            case 1: return <EmptyPanelState title="Open Orders" />
            case 2: return <EmptyPanelState title="Stop Orders" />
            case 3: return <EmptyPanelState title="Tracker Assets" />
            case 4:
                return (
                    <div className="p-6 flex justify-between">
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Status</p>
                            <span className="border-b border-green-600 text-green-400 border-dotted pb-3 text-xs">Healthy</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Initial Margin</p>
                            <p className="text-white text-xs">$0.00 <span className="text-gray-500 text-xs">(0.00%)</span></p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Maintenance Margin</p>
                            <p className="text-white text-xs">$0.00 <span className="text-gray-500 text-xs">(0.00%)</span></p>
                        </div>
                    </div>
                )
            case 5: return <EmptyPanelState title="Fills" />
            case 6: return <EmptyPanelState title="Order History" />
            default: return null
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

    const handlePanelToggle = (id: number) => setActivePanel(id)

    return (
        <div className="w-full flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center border-b py-2 border-gray-700">
                {/* Tabs */}
                <div className="flex gap-6">
                    {panelTabs.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => handlePanelToggle(p.id)}
                            className="text-white text-[14px] flex items-center gap-2 cursor-pointer relative pb-2"
                        >
                            <h1>{p.title}</h1>
                            {p.isHealthy && (
                                <span className="border border-green-600 bg-green-900/50 text-green-300 rounded-[40%] px-1 py-[1px] text-[9px]">
                                    Healthy
                                </span>
                            )}
                            {activePanel === p.id && (
                                <span className="absolute bottom-[-8px] w-[30px] left-0 right-0 mx-auto h-[2px] bg-orange-500 rounded-full" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Conditional action buttons */}
                {(activePanel === 5 || activePanel === 6) && (
                    <div className="flex gap-4 items-center">
                        <button className="flex gap-1 items-center text-gray-300 hover:text-white">
                            <BiRefresh />
                            <span className="text-xs">Refresh</span>
                        </button>
                        <button className="flex gap-1 items-center text-orange-500 hover:text-orange-400">
                            <BiDownload />
                            <span className="text-xs">Download</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    )
}
