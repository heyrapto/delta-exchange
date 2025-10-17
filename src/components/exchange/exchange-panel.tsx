"use client"

import { useState } from "react"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0)
    const panelTabs = [
        {
            id: 0,
            title: "Positions"
        },
        {
            id: 1,
            title: "Open Orders"
        },
        {
            id: 2,
            title: "Stop Orders"
        },
        {
            id: 3,
            title: "Tracker Assets"
        },
        {
            id: 4,
            title: "Risk & Margin Details",
            isHealthy: true,
        },
        {
            id: 5,
            title: "Fills"
        },
        {
            id: 6,
            title: "Order History"
        },
    ]

    const handlePanelToggle = (id: number) => {
        setActivePanel(id);
    };

    return (
        <div className="w-full flex flex-col min-h-[500px]">
            <div className="flex gap-6 border-b pb-4 border-gray-700">
                {panelTabs.map((p) => (
                    <div className={`text-white text-[18px] inline-flex items-center gap-2 cursor-pointer relative`} key={p.id} onClick={() => handlePanelToggle(p.id)}>
                        <h1>{p.title}</h1>
                        {p.isHealthy && (
                            <span className="border border-green-600 bg-green-900/50 text-green-300 rounded-[40%] p-1 text-[9px]">Healthy</span>
                        )}

                        {/* Has to be on the border tho i cant seem to figure it out here */}
                        {activePanel  && (
                            <span className="bg-orange-500 w-12 py-[2px] absolute bottom-0 left-0 right-0 mx-auto block"></span>
                        )}
                    </div>
                ))}
            </div>

             {/* Content */}
             <div className="p-4">
             </div>
        </div>
    )
}