import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance, useAccount } from "wagmi";
import { Hex } from "viem";
import { useAppContext } from "@/context/app-context";
import { Button } from "../ui/reusable/button";
export const arbitrumUsdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";

const CustomConnectButton = ({
  onclick,
  onBalanceChange,
}: {
  onclick?: () => void;
  onBalanceChange?: (balance: number) => void;
}) => {
  const { address } = useAccount();

  const { state } = useAppContext();
  const { selectedPremium } = state;

  const { data: usdcBalance } = useBalance({
    address: address as Hex,
    token: arbitrumUsdcAddress,
  });

  useEffect(() => {
    if (usdcBalance && onBalanceChange) {
      onBalanceChange(Number(usdcBalance.formatted));
    }
  }, [usdcBalance, onBalanceChange]);

  const isInsufficientBalance =
    !!(
      usdcBalance &&
      selectedPremium &&
      Number(usdcBalance.formatted) < Number(selectedPremium)
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