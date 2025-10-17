"use client"

import { useState } from "react"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0)
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
            <div className="p-4 text-gray-300">
                <p>Currently viewing: {panelTabs[activePanel].title}</p>
            </div>
        </div>
    )
}