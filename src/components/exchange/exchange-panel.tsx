"use client"

import { useState } from "react"
import { useTradeStore } from "@/store/trade-store"
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

    const tableData = [
        {
          status: 'Healthy',
          initialMargin: '$0.00',
          initialPercent: '0.00%',
          maintenanceMargin: '$0.00',
          maintenancePercent: '0.00%',
        },
        // {
        //   status: 'Warning',
        //   initialMargin: '$2,400.00',
        //   initialPercent: '8.15%',
        //   maintenanceMargin: '$1,200.00',
        //   maintenancePercent: '4.07%',
        // },
      ]
      

    const { openOrders, orderHistory, cancelOrder } = useTradeStore()

    const renderOpenOrders = () => (
        <div className="p-3">
            {openOrders.length === 0 ? (
                <EmptyPanelState title="Open Orders" />
            ) : (
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            <th className="text-left px-2 py-1">Time</th>
                            <th className="text-left px-2 py-1">Side</th>
                            <th className="text-left px-2 py-1">Type</th>
                            <th className="text-left px-2 py-1">Price</th>
                            <th className="text-left px-2 py-1">Qty</th>
                            <th className="text-left px-2 py-1">Period</th>
                            <th className="text-left px-2 py-1">Status</th>
                            <th className="text-left px-2 py-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {openOrders.map(o => (
                            <tr key={o.id} className="border-b border-gray-200">
                                <td className="px-2 py-2">{new Date(o.time).toLocaleTimeString()}</td>
                                <td className="px-2 py-2" style={{ color: o.side === 'long' ? '#10B981' : '#EF4444' }}>{o.side === 'long' ? 'Buy' : 'Sell'}</td>
                                <td className="px-2 py-2">{o.orderType}</td>
                                <td className="px-2 py-2">{o.price ? o.price.toFixed(2) : '-'}</td>
                                <td className="px-2 py-2">{o.quantity}</td>
                                <td className="px-2 py-2">{o.period} days</td>
                                <td className="px-2 py-2 capitalize">{o.status}</td>
                                <td className="px-2 py-2">
                                    {o.status === 'open' && (
                                        <button className="text-[11px] underline" onClick={() => cancelOrder(o.id)}>Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )

    const renderOrderHistory = () => (
        <div className="p-3">
            {orderHistory.length === 0 ? (
                <EmptyPanelState title="Order History" />
            ) : (
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            <th className="text-left px-2 py-1">Time</th>
                            <th className="text-left px-2 py-1">Side</th>
                            <th className="text-left px-2 py-1">Type</th>
                            <th className="text-left px-2 py-1">Price</th>
                            <th className="text-left px-2 py-1">Qty</th>
                            <th className="text-left px-2 py-1">Period</th>
                            <th className="text-left px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderHistory.map(o => (
                            <tr key={o.id} className="border-b border-gray-200">
                                <td className="px-2 py-2">{new Date(o.time).toLocaleTimeString()}</td>
                                <td className="px-2 py-2" style={{ color: o.side === 'long' ? '#10B981' : '#EF4444' }}>{o.side === 'long' ? 'Buy' : 'Sell'}</td>
                                <td className="px-2 py-2">{o.orderType}</td>
                                <td className="px-2 py-2">{o.filledPrice ? o.filledPrice.toFixed(2) : (o.price ? o.price.toFixed(2) : '-')}</td>
                                <td className="px-2 py-2">{o.quantity}</td>
                                <td className="px-2 py-2">{o.period} days</td>
                                <td className="px-2 py-2 capitalize" style={{ color: o.status === 'filled' ? '#10B981' : '#EF4444' }}>{o.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )

    const renderContent = () => {
        switch (activePanel) {
            case 0: return <EmptyPanelState title="Positions" />
            case 1: return renderOpenOrders()
            case 2: return <EmptyPanelState title="Stop Orders" />
            case 3: return <EmptyPanelState title="Tracker Assets" />
            case 4:
                return (
                    <div className="p-4">
                      <table className="w-full text-xs border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            <th className="text-left font-medium px-2 py-1">Status</th>
                            <th className="text-left font-medium px-2 py-1">Initial Margin</th>
                            <th className="text-left font-medium px-2 py-1">Maintenance Margin</th>
                          </tr>
                        </thead>
                  
                        <tbody>
                          {tableData.map((row, i) => (
                            <tr key={i} className="bg-gray-100/50 rounded">
                              <td className="px-2 py-2 border-b border-gray-300">
                                <span
                                  className="border-b border-dotted pb-[2px]"
                                  style={{
                                    borderColor:
                                      row.status.toLowerCase() === 'healthy'
                                        ? 'var(--text-success)'
                                        : 'var(--text-warning)',
                                    color:
                                      row.status.toLowerCase() === 'healthy'
                                        ? 'var(--text-success)'
                                        : 'var(--text-warning)',
                                  }}
                                >
                                  {row.status}
                                </span>
                              </td>
                  
                              <td
                                className="px-2 py-2 border-b border-gray-300 text-[11px]"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {row.initialMargin}{' '}
                                <span className="text-gray-400">({row.initialPercent})</span>
                              </td>
                  
                              <td
                                className="px-2 py-2 border-b border-gray-300 text-[11px]"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {row.maintenanceMargin}{' '}
                                <span className="text-gray-400">({row.maintenancePercent})</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                  
            case 5: return <EmptyPanelState title="Fills" />
            case 6: return renderOrderHistory()
            default: return null
        }
    }

    const panelTabs: { id: number; title: string, isHealthy?: boolean }[] = [
        { id: 0, title: "Positions" },
        { id: 1, title: "Open Orders" },
        { id: 2, title: "Stop Orders" },
        // { id: 3, title: "Tracker Assets" },
        // { id: 4, title: "Risk & Margin Details", isHealthy: true },
        // { id: 5, title: "Fills" },
        { id: 6, title: "Order History" },
    ]

    const handlePanelToggle = (id: number) => setActivePanel(id)

    return (
        <div className="w-full md:flex hidden flex-col min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] px-3 md:mt-0 mt-[10px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-2 border-gray-300 gap-2 sm:gap-0">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide">
                    {panelTabs.map((p) => (
                        <div
                        key={p.id}
                        onClick={() => handlePanelToggle(p.id)}
                        className={`text-[12px] sm:text-[14px] flex items-center gap-1 sm:gap-2 cursor-pointer relative pb-2 whitespace-nowrap  transition-all duration-200
                          ${
                            activePanel === p.id
                              ? "text-green-500"
                              : ""
                          }`}
                      >
                            <h1 className="truncate">{p.title}</h1>
                            {p.isHealthy && (
                                <span className="border rounded-[40%] px-1 py-[1px] text-[8px] sm:text-[9px]" style={{ borderColor: 'var(--text-success)', backgroundColor: 'var(--text-success)', color: 'var(--text-primary)' }}>
                                    Healthy
                                </span>
                            )}
                            {activePanel === p.id && (
                                <span className="absolute bottom-0 w-[20px] sm:w-[30px] left-0 right-0 mx-auto h-[2px] rounded-full" style={{ backgroundColor: 'var(--button-primary-bg)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Conditional action buttons */}
                {(activePanel === 5 || activePanel === 6) && (
                    <div className="md:flex hidden gap-4 items-center">
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
