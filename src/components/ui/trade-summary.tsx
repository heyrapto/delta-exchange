import { useState } from "react";
import {
  Asset,
  callHegicStrategyContract,
  OptionType,
} from "../../blockchain/hegic/hegicCalls";
import { Hex } from "viem";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axios";
import { useAccount } from "wagmi";
import { useAppContext } from "@/context/app-context";
import CustomConnectButton from "../custom/connect-button";
import SuccessModal from "./modals/success-modal";
import ConfirmModal from "./modals/confirm-modal";
import { Icons } from "./custom/icons";

export function TradeSummary() {
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

  // Format premium to avoid extremely long numbers
  const formatPremium = (premium: string) => {
    const num = parseFloat(premium);
    if (isNaN(num)) return premium;
    // If the number is very large or has many decimals, limit to 6 significant digits
    if (num >= 1000) {
      return num.toFixed(2);
    }
    // For smaller numbers, limit decimal places to 5
    const formatted = num.toFixed(5);
    // Remove trailing zeros
    return parseFloat(formatted).toString();
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

  return (
    <>
      <ConfirmModal isOpen={showConfirmModal} />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        txHash={txHash}
      />
      <div className="relative w-full min-w-0 border border-white/0 py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 lg:px-6 rounded-lg overflow-hidden">
        <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6 min-w-0">
          <div className="w-full sm:flex-1 sm:min-w-0 space-y-2">
            <div className="flex items-center justify-between capitalize gap-1 sm:gap-2 min-w-0">
              <p className="text-[#392929] text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Strategy</p>
              <p className="text-[#7A7A7A] font-medium text-[10px] sm:text-xs md:text-sm text-right truncate min-w-0 flex-1">
                {asset} {strategy.replace("-", " ")}
              </p>
            </div>

            <div className="flex items-center justify-between capitalize gap-1 sm:gap-2 min-w-0">
              <p className="text-[#392929] text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Exercising</p>
              <p className="text-[#7A7A7A] font-medium text-[10px] sm:text-xs md:text-sm flex items-center gap-1 flex-shrink-0">
                Manual <Icons.questionMark />
              </p>
            </div>

            <div className="flex items-center justify-between capitalize gap-1 sm:gap-2 min-w-0">
              <p className="text-[#392929] text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Liquidation</p>
              <p className="text-[#7A7A7A] font-medium text-[10px] sm:text-xs md:text-sm flex-shrink-0">None</p>
            </div>
          </div>

          <div className="w-full sm:flex-1 sm:min-w-0 space-y-2">
            <div className="flex items-center justify-between capitalize gap-1 sm:gap-2 min-w-0">
              <p className="text-[#392929] text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Profit Zone</p>
              <p className="text-[#7A7A7A] font-medium text-[10px] sm:text-xs md:text-sm text-right flex-shrink-0">
                {">"}
                {isFetching ? "..." : "$3,257"}
              </p>
            </div>

            <div className="flex items-center justify-between capitalize gap-1 sm:gap-2 min-w-0">
              <p className="text-[#392929] text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Max. Loss Zone</p>
              <p className="text-[#7A7A7A] font-medium text-[10px] sm:text-xs md:text-sm flex items-center gap-1 flex-shrink-0">
                {"<"}$3,130
              </p>
            </div>

            <div className="flex items-center justify-between text-[#392929] gap-1 sm:gap-2 min-w-0">
              <p className="text-[10px] sm:text-xs md:text-[13px] leading-5 font-normal whitespace-nowrap flex-shrink-0">Total Cost</p>
              <div className="flex items-center gap-1 font-medium text-[10px] sm:text-xs md:text-sm text-right min-w-0 flex-1 justify-end">
                <span className="flex-shrink-0"><Icons.USDC /></span>
                <span className="truncate" title={selectedPremium}>{formatPremium(selectedPremium)}</span>
                <span className="flex-shrink-0 whitespace-nowrap"> USDC.e</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="relative bg-green-100 border border-white/0 w-full min-w-0 rounded-lg py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 lg:px-6 gap-3 sm:gap-4 flex flex-col overflow-hidden">
        <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
        <div className="space-y-2 sm:space-y-2.5 min-w-0">
          <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
            <p className="text-[10px] sm:text-xs text-[#392b2b] whitespace-nowrap flex-shrink-0">Your Balance</p>
            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-[#392b2b] text-right min-w-0 flex-1 justify-end">
              <span className="flex-shrink-0"><Icons.USDC /></span>
              <span className="truncate">{userBalance ? userBalance.toFixed(2) : "0.00"}</span>
              <span className="flex-shrink-0 whitespace-nowrap"> USDC.e</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
            <p className="text-[10px] sm:text-xs text-[#392b2b] whitespace-nowrap flex-shrink-0">Platform Fee (0.1%)</p>
            <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs text-[#392b2b] text-right min-w-0 flex-1 justify-end">
              <span className="flex-shrink-0"><Icons.USDC /></span>
              <span className="truncate">{(parseFloat(selectedPremium) / 1000).toFixed(2)}</span>
              <span className="flex-shrink-0 whitespace-nowrap"> USDC.e</span>
            </div>
          </div>
        </div>
        <div className="w-full min-w-0">
          <div className="relative w-full h-[36px] sm:h-[40px] min-w-0">
            <div className="absolute inset-0 bg-[#2934FF] rounded-[9px] opacity-16" />
            <div className="absolute inset-0 bg-gradient-to-b from-white to-white/0 rounded-[9px]" />
            <div className="absolute inset-0 border border-white/20 rounded-[8.5px]" />
            <div className="relative w-full h-full bg-[#2934FF] rounded-[9px] text-white font-medium text-[10px] sm:text-xs md:text-sm hover:bg-[#2934FF]/90 transition-colors min-w-0 overflow-hidden">
              <CustomConnectButton
                onclick={callStrategy}
                onBalanceChange={handleBalanceChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}