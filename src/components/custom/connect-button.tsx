import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance, useAccount } from "wagmi";
import { Hex } from "viem";
import { useAppContext } from "@/context/app-context";
import { Button } from "../ui/reusable/button";
export const arbitrumUsdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
export const gnsUsdcAddress = "0xaf88d065e77c8cc2239327c5edb3a432268e5831"; // GNS USDC on Arbitrum

const CustomConnectButton = ({
  onclick,
  onBalanceChange,
  isGNS = false,
  requiredAmount,
}: {
  onclick?: () => void;
  onBalanceChange?: (balance: number) => void;
  isGNS?: boolean;
  requiredAmount?: number;
}) => {
  const { address } = useAccount();

  const { state } = useAppContext();
  const { selectedPremium, gnsFundsRequired } = state;

  // Use GNS USDC address if isGNS, otherwise use default
  const usdcAddress = isGNS ? gnsUsdcAddress : arbitrumUsdcAddress;
  const requiredFunds = isGNS ? gnsFundsRequired : (selectedPremium ? Number(selectedPremium) : 0);
  const actualRequiredAmount = requiredAmount !== undefined ? requiredAmount : requiredFunds;

  const { data: usdcBalance } = useBalance({
    address: address as Hex,
    token: usdcAddress,
  });

  useEffect(() => {
    if (usdcBalance && onBalanceChange) {
      onBalanceChange(Number(usdcBalance.formatted));
    }
  }, [usdcBalance, onBalanceChange]);

  const isInsufficientBalance =
    !!(
      usdcBalance &&
      actualRequiredAmount > 0 &&
      Number(usdcBalance.formatted) < actualRequiredAmount
    );

  const handleActionClick = () => {
    if (isInsufficientBalance) {
      return;
    }

    if (onclick) {
      onclick();
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="primary"
                    className="w-full"
                    onclick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="w-full cursor-not-allowed"
                    variant="primary"
                    onclick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex items-center gap-2 w-full">
                  {!onclick && (
                    <Button
                      variant="primary"
                      onclick={openAccountModal}
                      className="w-full"
                    >
                      {chain.iconUrl && (
                        <img
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          className="h-full"
                        />
                      )}
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </Button>
                  )}

                  {onclick && (
                    <Button
                      variant="primary"
                      className={`w-full ${
                        isInsufficientBalance ? "cursor-not-allowed" : ""
                      }`}
                      onClick={handleActionClick}
                      disabled={isInsufficientBalance}
                    >
                      {isInsufficientBalance
                        ? "Insufficient balance"
                        : isGNS
                        ? "Place Order"
                        : "Buy this strategy"}
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;