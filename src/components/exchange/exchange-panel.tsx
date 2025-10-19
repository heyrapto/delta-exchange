"use client"

import { useState } from "react"
import { BiDownload, BiRefresh } from "react-icons/bi"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0)

    const EmptyPanelState = ({ title }: { title: string }) => (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-2" style={{ color: 'var(--text-muted)' }}>
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>No {title}</p>
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
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Status</p>
                            <span className="border-b border-dotted pb-3 text-xs" style={{ borderColor: 'var(--text-success)', color: 'var(--text-success)' }}>Healthy</span>
                        </div>
                        <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Initial Margin</p>
                            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>$0.00 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(0.00%)</span></p>
                        </div>
                        <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Maintenance Margin</p>
                            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>$0.00 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(0.00%)</span></p>
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
            <div className="flex justify-between items-center border-b py-2 border-gray-300">
                {/* Tabs */}
                <div className="flex gap-6">
                    {panelTabs.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => handlePanelToggle(p.id)}
                            className="text-[14px] flex items-center gap-2 cursor-pointer relative pb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <h1>{p.title}</h1>
                            {p.isHealthy && (
                                <span className="border rounded-[40%] px-1 py-[1px] text-[9px]" style={{ borderColor: 'var(--text-success)', backgroundColor: 'var(--text-success)', color: 'var(--text-primary)' }}>
                                    Healthy
                                </span>
                            )}
                            {activePanel === p.id && (
                                <span className="absolute bottom-[-8px] w-[30px] left-0 right-0 mx-auto h-[2px] rounded-full" style={{ backgroundColor: 'var(--button-primary-bg)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Conditional action buttons */}
                {(activePanel === 5 || activePanel === 6) && (
                    <div className="flex gap-4 items-center">
                        <button className="flex gap-1 items-center" style={{ color: 'var(--text-secondary)' }}>
                            <BiRefresh />
                            <span className="text-xs">Refresh</span>
                        </button>
                        <button className="flex gap-1 items-center" style={{ color: 'var(--button-primary-bg)' }}>
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
