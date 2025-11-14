"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Hex } from "viem"

interface FuturesTradePanelProps {
  isLoggedIn?: boolean
}

export const FuturesTradePanel = ({ isLoggedIn = false }: FuturesTradePanelProps) => {
  const [leverage, setLeverage] = useState(20)
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState<Hex | "">("");
  const { address } = useAccount();

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300 p-4">
      <div className="text-sm font-medium mb-4">Place Order</div>
      {/* Full trade form would go here */}
      <div className="flex-1 text-center text-gray-500 text-sm flex items-center justify-center">
        Trade form (to be implemented)
      </div>
    </div>
  )
}
