"use client"

import { useState, useMemo, useEffect } from "react"
import { BiChevronDown, BiChevronUp, BiDownload, BiSearch, BiStar } from "react-icons/bi"
import { getPairPrice } from "@/blockchain/gns/assetPrices"
import GNS_CONTRACTS from "@/blockchain/gns/gnsContracts"

interface MarketsContract {
  contract: string
  description: string
  lastPrice: number
  change24h: number
  volume24h: number
  openInterest: number
  high24h: number
  low24h: number
  funding: number
  leverage: number
  pairIndex?: number
}

type SortField = "contract" | "change24h" | "volume24h" | "openInterest" | "funding"
type SortDirection = "asc" | "desc"

export const MarketsTable = () => {
  const [activeTab, setActiveTab] = useState("Futures")
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())

  // Generate contracts from GNS pairs
  const [contracts, setContracts] = useState<MarketsContract[]>([])

  // Fetch real prices for all active pairs
  useEffect(() => {
    const fetchContractData = async () => {
      const activePairs = Object.entries(GNS_CONTRACTS.PAIRS).filter(([, pair]) => pair.active)
      
      const contractsData = await Promise.all(
        activePairs.map(async ([pairIndexStr, pair]) => {
          const pairIndex = Number(pairIndexStr)
          try {
            const symbol = `${pair.from}USDT`
            const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
            const ticker = await tickerRes.json()
            
            if (ticker) {
              const lastPrice = parseFloat(ticker.lastPrice)
              const openPrice = parseFloat(ticker.openPrice)
              const change24h = ((lastPrice - openPrice) / openPrice) * 100
              const volume24h = parseFloat(ticker.quoteVolume) / 1000000 // Convert to millions
              
              return {
                contract: `${pair.from}USD`,
                description: `${pair.from} Perpetual 200x`,
                lastPrice,
                change24h,
                volume24h,
                openInterest: 0, // Would need separate API call
                high24h: parseFloat(ticker.highPrice),
                low24h: parseFloat(ticker.lowPrice),
                funding: 0.0100,
                leverage: 200,
                pairIndex,
              }
            }
          } catch (error) {
            console.error(`Error fetching data for ${pair.from}:`, error)
          }
          
          // Fallback data
          return {
            contract: `${pair.from}USD`,
            description: `${pair.from} Perpetual 200x`,
            lastPrice: 0,
            change24h: 0,
            volume24h: 0,
            openInterest: 0,
            high24h: 0,
            low24h: 0,
            funding: 0.0100,
            leverage: 200,
            pairIndex,
          }
        })
      )
      
      setContracts(contractsData.filter(c => c.lastPrice > 0))
    }

    fetchContractData()
    const interval = setInterval(fetchContractData, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const tabs = ["Watchlist", "Options", "Futures", "Straddle", "Trackers", "Analytics"]
  const categories = [
    "ALL",
    "LAYER 1",
    "SMART CONTRACTS",
    "SOLANA ECOSYSTEM",
    "MEME",
    "DEFI",
    "AI",
    "RWA",
    "LAYER 2",
    "GAMING",
    "NFT",
  ]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedAndFilteredContracts = useMemo(() => {
    let filtered = contracts.filter((contract) => {
      const matchesSearch =
        contract.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }
        return 0
      })
    }

    return filtered
  }, [contracts, searchQuery, sortField, sortDirection])

  const totalVolume = contracts.reduce((sum, c) => sum + c.volume24h, 0)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <BiChevronDown className="w-3 h-3 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <BiChevronUp className="w-3 h-3 text-black" />
    ) : (
      <BiChevronDown className="w-3 h-3 text-black" />
    )
  }

  const toggleWatchlist = (contract: string) => {
    const newWatchlist = new Set(watchlist)
    if (newWatchlist.has(contract)) {
      newWatchlist.delete(contract)
    } else {
      newWatchlist.add(contract)
    }
    setWatchlist(newWatchlist)
  }

  return (
    <div className="w-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#ADFF2F] text-black"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="px-4 py-3 border-b border-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeCategory === category
                    ? "bg-[#ADFF2F] text-black font-semibold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Volume and Download */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">
              24 hr Volume ${totalVolume.toFixed(1)}M
            </span>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-black">
              <BiDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Q Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ADFF2F]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Contract
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Description
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer hover:text-black"
                onClick={() => handleSort("contract")}
              >
                <div className="flex items-center gap-1">
                  Last Price
                  <SortIcon field="contract" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer hover:text-black"
                onClick={() => handleSort("change24h")}
              >
                <div className="flex items-center gap-1">
                  24h Change
                  <SortIcon field="change24h" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer hover:text-black"
                onClick={() => handleSort("volume24h")}
              >
                <div className="flex items-center gap-1">
                  24h Volume
                  <SortIcon field="volume24h" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer hover:text-black"
                onClick={() => handleSort("openInterest")}
              >
                <div className="flex items-center gap-1">
                  Open Interest
                  <SortIcon field="openInterest" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                24h Prices
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer hover:text-black"
                onClick={() => handleSort("funding")}
              >
                <div className="flex items-center gap-1">
                  Funding
                  <SortIcon field="funding" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredContracts.map((contract, index) => (
              <tr
                key={contract.contract}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWatchlist(contract.contract)
                      }}
                      className="hover:opacity-70"
                    >
                      <BiStar
                        className={`w-4 h-4 ${
                          watchlist.has(contract.contract)
                            ? "text-[#ADFF2F] fill-[#ADFF2F]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <span className="font-medium">{contract.contract}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{contract.description}</td>
                <td className="px-4 py-3 font-medium">
                  ${contract.lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${
                    contract.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {contract.change24h >= 0 ? "+" : ""}
                  {contract.change24h.toFixed(2)}%
                </td>
                <td className="px-4 py-3">
                  ${contract.volume24h.toFixed(2)}M
                </td>
                <td className="px-4 py-3">${contract.openInterest.toFixed(1)}M</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  High: ${contract.high24h.toLocaleString()}
                  <br />
                  Low: ${contract.low24h.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 ${
                    contract.funding >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {contract.funding >= 0 ? "+" : ""}
                  {contract.funding.toFixed(4)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
