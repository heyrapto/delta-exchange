"use client"

import { useState } from "react"
import CustomConnectButton from "../custom/connect-button"
import { axiosInstance } from "@/utils/axios"
import { useAccount } from "wagmi"
import {
    Asset,
    callHegicStrategyContract,
    OptionType,
  } from "../../blockchain/hegic/hegicCalls";
import { useAppContext } from "@/context/app-context"
import { Hex } from "viem"
import { toast } from "react-toastify";

interface FuturesTradePanelProps {
  isLoggedIn?: boolean
}

export const FuturesTradePanel = ({ isLoggedIn = false }: FuturesTradePanelProps) => {
  const [leverage, setLeverage] = useState(20)
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState<Hex | "">("");

  const { state } = useAppContext();
  const { asset, strategy, isFetching, selectedPremium, period, amount } =
    state;

  const { address } = useAccount();

  const handleBalanceChange = (balance: number) => {
    setUserBalance(balance);
  };

const callStrategy = async () => {
    try {
      setShowConfirmModal(true);
      const tx = await callHegicStrategyContract({
        optionType: state.strategy.toUpperCase() as OptionType,
        amount: parseFloat(amount),
        period,
        asset: asset as Asset,
        index: 0,
        premium: parseFloat(selectedPremium),
      });

      if (typeof tx === "object" && "status" in tx) {
        console.log("Transaction status:", tx.status);
        console.log("Transaction message:", tx.message);

        setShowConfirmModal(false);
        toast.error(tx.message);
      } else {
        setTxHash(tx);
        setShowConfirmModal(false);
        setShowSuccessModal(true);

        // call the referral reward function
        try {
          await axiosInstance.post("/referrals/reward", {
            refereeAddress: address,
            rewardAmount: parseFloat(amount) * 0.002,
            transactionHash: tx,
          });
        } catch (rewardError) {
          console.error("Referral reward failed:", rewardError);
          toast.warning(
            "Referral reward processing failed, but trade was successful"
          );
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full h-full flex flex-col bg-white border border-gray-300 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-gray-700 mb-6">
            Want to get started? Create an account in just a few seconds.
          </p>
          <CustomConnectButton
                onclick={callStrategy}
                onBalanceChange={handleBalanceChange}
            />
        </div>

        {/* Placeholder for order form elements when logged in */}
        <div className="space-y-4 opacity-30 pointer-events-none">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Leverage</span>
            <span className="font-medium">{leverage}x</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Market</div>
            <div className="text-xs text-gray-600">Bracket Order</div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Funds req:</span>
              <span>0.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Margin:</span>
              <span>0.00 USD</span>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs text-center">
            Save up to 50% with Scalper Offer
          </div>
          <button className="w-full py-2 bg-gray-300 text-gray-500 rounded text-sm">
            Activate
          </button>
        </div>
      </div>
    )
  }

  // Logged in view would show the actual trade form
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
