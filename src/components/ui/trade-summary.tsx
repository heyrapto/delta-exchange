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
      <div className="relative col-span-2 bg-green-100 border border-white/0 py-3.5 px-6 rounded-lg">
        <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10 lg:gap-24">
          <div className="w-full md:max-w-[50%] space-y-2">
            <div className="flex items-center justify-between capitalize">
              <p className="text-[#392929] text-[13px] leading-5 font-normal">Strategy</p>
              <p className="text-[#7A7A7A] font-medium text-sm">
                {asset} {strategy.replace("-", " ")}
              </p>
            </div>

            <div className="flex items-center justify-between capitalize">
              <p className="text-[#392929] text-[13px] leading-5 font-normal">Exercising</p>
              <p className="text-[#7A7A7A] font-medium text-sm flex items-center gap-2">
                Manual <Icons.questionMark />
              </p>
            </div>

            <div className="flex items-center justify-between capitalize">
              <p className="text-[#392929] text-[13px] leading-5 font-normal">Liquidation</p>
              <p className="text-[#7A7A7A] font-medium text-sm">None</p>
            </div>
          </div>

          <div className="w-full md:max-w-[50%] space-y-2">
            <div className="flex items-center justify-between capitalize">
              <p className="text-[#392929] text-[13px] leading-5 font-normal">Profit Zone</p>
              <p className="text-[#7A7A7A] font-medium text-sm">
                {">"}
                {isFetching ? "..." : "$3,257"}
              </p>
            </div>

            <div className="flex items-center justify-between capitalize">
              <p className="text-[#392929] text-[13px] leading-5 font-normal">Max. Loss Zone</p>
              <p className="text-[#7A7A7A] font-medium text-sm flex items-center gap-2">
                {"<"}$3,130
              </p>
            </div>

            <div className="flex items-center justify-between text-[#392929]">
              <p className="text-[13px] leading-5 font-normal">Total Cost</p>
              <p className="flex items-center gap-2 font-medium text-sm">
                <Icons.USDC /> {selectedPremium} USDC.e
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="relative bg-green-100 border border-white/0 h-full rounded-lg py-3.5 px-6 gap-4 flex flex-col">
        <div className="absolute inset-0 rounded-[8px] border border-white/[0.07] pointer-events-none" />
        <div>
          <div className="flex items-center justify-between *:text-xs *:text-[#392b2b]">
            <p>Your Balance</p>
            <p className="flex items-center gap-2 font-bold">
              <Icons.USDC /> {userBalance && userBalance.toFixed(2)} USDC.e
            </p>
          </div>

          <div className="flex items-center justify-between *:text-xs *:text-[#392b2b]">
            <p>Platform Fee (0.1%)</p>
            <p className="flex items-center gap-2 font-bold">
              <Icons.USDC /> {(parseFloat(selectedPremium) / 1000).toFixed(2)}{" "}
              USDC.e
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="relative w-full h-[40px]">
            <div className="absolute inset-0 bg-[#2934FF] rounded-[9px] opacity-16" />
            <div className="absolute inset-0 bg-gradient-to-b from-white to-white/0 rounded-[9px]" />
            <div className="absolute inset-0 border border-white/20 rounded-[8.5px]" />
            <div className="relative w-full h-full bg-[#2934FF] rounded-[9px] text-white font-medium text-sm hover:bg-[#2934FF]/90 transition-colors">
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