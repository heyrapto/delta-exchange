import erc20ABI from "./ERC20ABI.json";
import { writeContract } from "@wagmi/core";
import { wagmiConfig } from "../../utils/wagmi";
import { ENVIRONMENT } from "../../utils/environment";
import { parseUnits } from "viem";
import GNS_CONTRACTS from "./gnsContracts";

export const takePlatformFee = async (trxAmount: number) => {
  const platformFee = trxAmount / 1000;
  const feeWalletAddress = ENVIRONMENT.PLATFORM_FEE_ADDRESS;

  const feeSentHash = await writeContract(wagmiConfig, {
    address: GNS_CONTRACTS.USDC as `0x${string}`,
    abi: erc20ABI,
    functionName: "transfer",
    args: [feeWalletAddress, parseUnits(platformFee.toString(), 6)],
  });

  console.log("feeSent", feeSentHash);
  return feeSentHash;
};