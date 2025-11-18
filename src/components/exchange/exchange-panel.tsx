"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTradeStore } from "@/store/trade-store"
import { BiDownload, BiRefresh } from "react-icons/bi"
import { useAccount } from "wagmi"
import CustomConnectButton from "../custom/connect-button"
import {
    closeHegicPosition,
    getUserHegicPositions,
    HegicPositionType,
} from "@/blockchain/hegic/hegicPositions"
import {
    getUserGNSPositions,
    getUserTradingHistory,
    GNSPositionType,
} from "@/blockchain/gns/gnsPositions"
import { cancelOpenOrder, closeTrade } from "@/blockchain/gns/gnsCalls"

export const ExchangePanel = () => {
    const [activePanel, setActivePanel] = useState(0)
    const { address } = useAccount()
    const [isFetchingPositions, setIsFetchingPositions] = useState(false)
    const [positionsError, setPositionsError] = useState<Error | null>(null)
    const [positions, setPositions] = useState<HegicPositionType[]>([])
    const [selectedPosition, setSelectedPosition] = useState<HegicPositionType | null>(null)
    
    // GNS state - separate from Hegic
    const [gnsPositions, setGnsPositions] = useState<GNSPositionType[]>([])
    const [isFetchingGNSPositions, setIsFetchingGNSPositions] = useState(false)
    const [gnsTradeHistory, setGnsTradeHistory] = useState<any[]>([])
    const [isFetchingGnsHistory, setIsFetchingGnsHistory] = useState(false)

    const formatTimestamp = (value: any) => {
        if (!value) return "-"
        let date: Date
        if (typeof value === "number") {
            date = new Date(value.toString().length === 10 ? value * 1000 : value)
        } else if (typeof value === "string" && /^\d+$/.test(value)) {
            const numeric = Number(value)
            date = new Date(value.length === 10 ? numeric * 1000 : numeric)
        } else {
            date = new Date(value)
        }
        if (isNaN(date.getTime())) return "-"
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }

    const formatNumberValue = (value: any, options: { prefix?: string; suffix?: string } = {}) => {
        if (value === undefined || value === null || value === "") return "-"
        const num = typeof value === "string" ? Number(value) : value
        if (isNaN(num)) return "-"
        const formatted = num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        return `${options.prefix ?? ""}${formatted}${options.suffix ?? ""}`
    }

    const normalizePrice = (value: any) => {
        if (value === undefined || value === null || value === "") return "-"
        const num = typeof value === "string" ? Number(value) : value
        if (isNaN(num)) return "-"
        const adjusted = num > 1e6 ? num / 1e8 : num
        return `$${adjusted.toFixed(2)}`
    }

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

    const fetchPositions = useCallback(async () => {
        if (!address) {
            setPositions([])
            return
        }
        try {
            setIsFetchingPositions(true)
            setPositionsError(null)
            const res = await getUserHegicPositions(address as string)
            console.log("Position debug", res);
            setPositions(res)
        } catch (e: any) {
            setPositionsError(e)
        } finally {
            setIsFetchingPositions(false)
        }
    }, [])

    // Fetch GNS positions separately
    const fetchGNSPositions = useCallback(async () => {
        if (!address) {
            setGnsPositions([])
            return
        }
        try {
            setIsFetchingGNSPositions(true)
            const trades = await getUserGNSPositions(address)
            setGnsPositions(trades)
        } catch (error) {
            console.error("Error fetching GNS positions:", error)
        } finally {
            setIsFetchingGNSPositions(false)
        }
    }, [address])

    const fetchGNSTradeHistory = useCallback(async () => {
        if (!address) {
            setGnsTradeHistory([])
            return
        }
        try {
            setIsFetchingGnsHistory(true)
            const history = await getUserTradingHistory(address)
            setGnsTradeHistory(history || [])
        } catch (error) {
            console.error("Error fetching GNS trade history:", error)
        } finally {
            setIsFetchingGnsHistory(false)
        }
    }, [address])

    const normalizedGnsHistory = useMemo(() => {
        if (!gnsTradeHistory?.length) return []
        return gnsTradeHistory.map((entry, idx) => {
            const trade = entry?.trade ?? entry
            const pair =
                entry?.pairName ??
                trade?.pairName ??
                trade?.pair ??
                (trade?.from && trade?.to ? `${trade.from}/${trade.to}` : "-")
            const direction =
                entry?.direction ??
                trade?.direction ??
                (typeof trade?.long === "boolean" ? (trade.long ? "Long" : "Short") : "-")
            const typeValue =
                entry?.type ??
                entry?.orderType ??
                entry?.tradeType ??
                trade?.tradeType ??
                trade?.type ??
                "-"
            const collateral = entry?.collateral ?? entry?.collateralAmount ?? trade?.collateralAmount
            const pnl =
                entry?.pnl ??
                entry?.pnlUsd ??
                entry?.pnlInUsd ??
                entry?.pnlPercentage ??
                trade?.pnl
            const timestamp =
                entry?.timestamp ??
                entry?.time ??
                entry?.updatedAt ??
                entry?.createdAt ??
                entry?.closeTimestamp ??
                entry?.openTimestamp
            const entryPrice = entry?.openPrice ?? trade?.openPrice
            const exitPrice = entry?.closePrice ?? entry?.price ?? trade?.closePrice
            const leverage = entry?.leverage ?? (trade?.leverage ? Number(trade.leverage) / 1000 : undefined)
            const status =
                entry?.status ??
                entry?.result ??
                (trade?.isOpen === false ? "Closed" : trade?.isOpen === true ? "Open" : "-")

            return {
                id: entry?.id ?? `${trade?.index ?? idx}-${timestamp ?? idx}`,
                time: formatTimestamp(timestamp),
                pair: pair || "-",
                side: direction || "-",
                type: typeof typeValue === "number" ? ["Market", "Limit", "Stop"][typeValue] ?? typeValue : typeValue,
                price: normalizePrice(exitPrice ?? entryPrice),
                collateral: collateral ? `${formatNumberValue(collateral, { suffix: " USDC" })}` : "-",
                leverage: leverage ? `${leverage}x` : "-",
                pnlValue: pnl ? Number(pnl) : undefined,
                pnl: pnl !== undefined ? formatNumberValue(pnl, { prefix: "$" }) : "-",
                status: status || "-",
            }
        })
    }, [gnsTradeHistory])

    // Load positions when user connects or tab is active
    useEffect(() => {
        if (activePanel === 0) {
            fetchPositions()
            fetchGNSPositions() // Also fetch GNS for Positions tab
        }
        if (activePanel === 1) {
            fetchGNSPositions() // Fetch GNS for Open Orders tab
        }
        if (activePanel === 6) {
            fetchGNSTradeHistory()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, activePanel, fetchPositions, fetchGNSPositions, fetchGNSTradeHistory])

    // Separate GNS into orders (pending) and positions (filled)
    const gnsOpenOrders = gnsPositions.filter((p: GNSPositionType) => p.tradeType === "LIMIT" || p.tradeType === "STOP")
    const gnsOpenPositions = gnsPositions.filter((p: GNSPositionType) => p.tradeType === "MARKET" && p.isOpen)

    const renderOpenOrders = () => {
        const hasAnyOrders = openOrders.length > 0 || gnsOpenOrders.length > 0
        
        return (
            <div className="p-3">
                {!hasAnyOrders && !isFetchingGNSPositions ? (
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
                            {/* Existing Hegic orders */}
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
                            {/* GNS Open Orders (Limit/Stop) */}
                            {gnsOpenOrders.map((order: GNSPositionType) => (
                                <tr key={`gns-order-${order.index}`} className="border-b border-gray-200">
                                    <td className="px-2 py-2">-</td>
                                    <td className="px-2 py-2" style={{ color: order.long ? '#10B981' : '#EF4444' }}>
                                        {order.long ? 'Long' : 'Short'}
                                    </td>
                                    <td className="px-2 py-2">{order.tradeType}</td>
                                    <td className="px-2 py-2">${order.openPrice}</td>
                                    <td className="px-2 py-2">{order.collateralAmount}</td>
                                    <td className="px-2 py-2">-</td>
                                    <td className="px-2 py-2 capitalize">Pending</td>
                                    <td className="px-2 py-2">
                                        <button 
                                            className="text-[11px] underline text-red-500 hover:text-red-700"
                                            onClick={async () => {
                                                if (!address) return
                                                try {
                                                    await cancelOpenOrder(order.index)
                                                    fetchGNSPositions()
                                                } catch (error) {
                                                    console.error("Error canceling order:", error)
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )
    }

    const renderPositions = () => (
        <div className="p-3">
            {!address && (
                <div className="max-w-xs">
                    <CustomConnectButton />
                </div>
            )}

            {positionsError && (
                <div className="text-sm font-medium" style={{ color: 'var(--text-danger)' }}>
                    {positionsError.message}
                </div>
            )}

            {isFetchingPositions && !positions && (
                <div className="flex items-center justify-center h-20">
                    <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />
                </div>
            )}

            {address && !isFetchingPositions && !isFetchingGNSPositions && positions.length === 0 && gnsOpenPositions.length === 0 && (
                <EmptyPanelState title="Positions" />
            )}

            {(positions.length > 0 || gnsOpenPositions.length > 0) && (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                <th className="text-left px-2 py-1">Qty / Strategy</th>
                                <th className="text-left px-2 py-1">Mark</th>
                                <th className="text-left px-2 py-1">Profit Zone</th>
                                <th className="text-left px-2 py-1">Net P&L</th>
                                <th className="text-left px-2 py-1">Expires In</th>
                                <th className="text-left px-2 py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Existing Hegic positions - unchanged */}
                            {positions.map((p) => (
                                <tr
                                    key={`${p.positionId}-${p.strategy}`}
                                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedPosition(p)}
                                >
                                    <td className="px-2 py-2">
                                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {p.amount}
                                        </span>
                                        <span className="text-gray-500 ml-1">{p.strategyInfo?.name}</span>
                                    </td>
                                    <td className="px-2 py-2">${p.markPrice}</td>
                                    <td className="px-2 py-2">${p.strikePrice}</td>
                                    <td className="px-2 py-2" style={{ 
                                        color: parseFloat(p.profit) >= 0 ? '#10B981' : '#EF4444' 
                                    }}>
                                        {parseFloat(p.profit) >= 0 ? '+' : ''}${p.profit}
                                    </td>
                                    <td className="px-2 py-2">{p.expirationTimestamp}</td>
                                    <td className="px-2 py-2">
                                        <button
                                            className={`text-[11px] underline ${p.payoff ? '' : 'opacity-50 cursor-not-allowed'}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (!p.payoff || !address) return
                                                closeHegicPosition(p.positionId, address as string).then(fetchPositions)
                                            }}
                                        >
                                            Close
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* GNS Positions - added below Hegic positions */}
                            {gnsOpenPositions.map((p: GNSPositionType) => {
                                const pnl = parseFloat(p.pnl || "0")
                                return (
                                    <tr
                                        key={`gns-pos-${p.index}`}
                                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-2 py-2">
                                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {p.collateralAmount}
                                            </span>
                                            <span className="text-gray-500 ml-1">{p.pairName}</span>
                                        </td>
                                        <td className="px-2 py-2">${p.currentPrice || p.openPrice}</td>
                                        <td className="px-2 py-2">${p.tp !== "0" ? p.tp : '-'}</td>
                                        <td className="px-2 py-2" style={{ 
                                            color: pnl >= 0 ? '#10B981' : '#EF4444' 
                                        }}>
                                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2">-</td>
                                        <td className="px-2 py-2">
                                            <button
                                                className="text-[11px] underline text-red-500 hover:text-red-700"
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    if (!address) return
                                                    try {
                                                        await closeTrade(p.index)
                                                        fetchGNSPositions()
                                                    } catch (error) {
                                                        console.error("Error closing position:", error)
                                                    }
                                                }}
                                            >
                                                Close
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

    const renderOrderHistory = () => {
        const hasHegicHistory = orderHistory.length > 0
        const hasGnsHistory = normalizedGnsHistory.length > 0

        if (!hasHegicHistory && !hasGnsHistory && !isFetchingGnsHistory) {
            return (
                <div className="p-3">
                    <EmptyPanelState title="Order History" />
                </div>
            )
        }

        return (
            <div className="p-3 space-y-6">
                {hasHegicHistory && (
                    <div>
                        <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Hegic Order History
                        </h4>
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
                    </div>
                )}

                <div className="">
                    <div className="flex items-center justify-between mb-2">
                        {/* <h4 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                            GNS Trade History
                        </h4> */}
                        {isFetchingGnsHistory && (
                            <span className="text-[10px] text-gray-500">Syncing...</span>
                        )}
                    </div>
                    {hasGnsHistory ? (
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                    <th className="text-left px-2 py-1">Time</th>
                                    <th className="text-left px-2 py-1">Pair</th>
                                    <th className="text-left px-2 py-1">Side</th>
                                    <th className="text-left px-2 py-1">Type</th>
                                    <th className="text-left px-2 py-1">Price</th>
                                    <th className="text-left px-2 py-1">Collateral</th>
                                    <th className="text-left px-2 py-1">Lev.</th>
                                    <th className="text-left px-2 py-1">P&L</th>
                                    <th className="text-left px-2 py-1">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {normalizedGnsHistory.map((trade) => (
                                    <tr key={trade.id} className="border-b border-gray-200">
                                        <td className="px-2 py-2">{trade.time}</td>
                                        <td className="px-2 py-2">{trade.pair}</td>
                                        <td className="px-2 py-2" style={{ color: trade.side === 'Long' ? '#10B981' : trade.side === 'Short' ? '#EF4444' : 'inherit' }}>
                                            {trade.side}
                                        </td>
                                        <td className="px-2 py-2">{trade.type}</td>
                                        <td className="px-2 py-2">{trade.price}</td>
                                        <td className="px-2 py-2">{trade.collateral}</td>
                                        <td className="px-2 py-2">{trade.leverage}</td>
                                        <td
                                            className="px-2 py-2"
                                            style={{ color: (trade.pnlValue ?? 0) >= 0 ? '#10B981' : '#EF4444' }}
                                        >
                                            {trade.pnl}
                                        </td>
                                        <td className="px-2 py-2">{trade.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-[11px] text-gray-500">
                            {isFetchingGnsHistory ? "Fetching latest trades..." : "No GNS trades yet."}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (activePanel) {
            case 0: return renderPositions()
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
        { id: 1, title: "Orders" },
        // { id: 2, title: "Stop Orders" },
        // { id: 3, title: "Tracker Assets" },
        // { id: 4, title: "Risk & Margin Details", isHealthy: true },
        // { id: 5, title: "Fills" },
        { id: 6, title: "History" },
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
                          ${activePanel === p.id
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            <h1 className="truncate">{p.title}</h1>
                            {p.isHealthy && (
                                <span className="border rounded-[40%] px-1 py-px text-[8px] sm:text-[9px]" style={{ borderColor: 'var(--text-success)', backgroundColor: 'var(--text-success)', color: 'var(--text-primary)' }}>
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

            {/* Position Details Modal */}
            {selectedPosition && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg w-full mx-4">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                                Position #{selectedPosition.positionId}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                                onClick={() => setSelectedPosition(null)}
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div className="text-gray-500">Strategy</div>
                                <div className="font-medium">{selectedPosition.strategyInfo?.name}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Amount</div>
                                <div className="font-medium">{selectedPosition.amount}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Mark Price</div>
                                <div className="font-medium">${selectedPosition.markPrice}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Profit Zone</div>
                                <div className="font-medium">${selectedPosition.strikePrice}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Payout Amount</div>
                                <div className="font-medium">${selectedPosition.payoutAmount}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Net P&L</div>
                                <div className="font-medium" style={{ 
                                    color: parseFloat(selectedPosition.profit) >= 0 ? '#10B981' : '#EF4444' 
                                }}>
                                    {parseFloat(selectedPosition.profit) >= 0 ? '+' : ''}${selectedPosition.profit}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500">Expires In</div>
                                <div className="font-medium">{selectedPosition.expirationTimestamp}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Payoff Available</div>
                                <div className="font-medium">{selectedPosition.payoff ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex gap-3">
                            <button
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                                onClick={() => setSelectedPosition(null)}
                            >
                                Dismiss
                            </button>
                            <button
                                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${selectedPosition.payoff ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                onClick={() => {
                                    if (!selectedPosition.payoff || !address) return
                                    closeHegicPosition(selectedPosition.positionId, address as string).then(() => {
                                        setSelectedPosition(null)
                                        fetchPositions()
                                    })
                                }}
                            >
                                Close Position
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}