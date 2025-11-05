import { writeContract, readContract, getAccount } from "@wagmi/core";
import { parseEther } from "viem";
import erc20ABI from "./ERC20ABI.json";
import investABI from "./investABI.json";
import { wagmiConfig } from "../../utils/wagmi";
import { ethers, MaxInt256 } from "ethers";
import { takePlatformFree } from "./platformFee";

interface HegicStrategyParams {
  optionType: OptionType;
  amount: number;
  period: string;
  asset: Asset;
  index: number;
  premium: number;
}

export enum OptionType {
  CALL = "CALL",
  PUT = "PUT",
  STRAP = "STRAP",
  STRIP = "STRIP",
  BULLCALL = "BULLCALL",
  BEARCALL = "BEARCALL",
  BULLPUT = "BULLPUT",
  BEARPUT = "BEARPUT",
  STRADDLE = "STRADDLE",
  STRANGLE = "STRANGLE",
  CONDOR = "CONDOR",
  BUTTERFLY = "BUTTERFLY",
}

export enum Asset {
  ETH = "ETH",
  BTC = "BTC",
}

interface StrategyCallParams {
  strategy: string;
  amount: number;
  period: number;
  premium: number;
}

// Add this helper function to determine period range
export const getPeriodRange = (days: number) => {
  if (days >= 7 && days <= 13) return "7-13";
  if (days >= 14 && days <= 29) return "14-29";
  if (days >= 30 && days <= 59) return "30-59";
  if (days >= 60 && days <= 90) return "60-90";
  throw new Error("Invalid period range");
};

const strategyCall = async ({
  strategy,
  amount,
  period,
}: StrategyCallParams) => {
  try {
    if (amount <= 0 || period <= 0) {
      throw new Error("Invalid Amount Or Days");
    }

    const CONTRACT_ADDRESS_ARB = "0x7740FC99bcaE3763a5641e450357a94936eaF380";
    const CONTRACT_ADDRESS_USDCe = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";
    const amountInETH = parseEther(amount.toString());
    const timeInSeconds = period * 86_400;
    const account = getAccount(wagmiConfig).address;

    // taking platform fee

    // First approve USDC
    const allowance = await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS_USDCe,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account, CONTRACT_ADDRESS_ARB],
    });

    if (allowance === 0n) {
      const approvalHash = await writeContract(wagmiConfig, {
        address: CONTRACT_ADDRESS_USDCe,
        abi: erc20ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS_ARB, MaxInt256],
      });
      console.log("Approval Hash:", approvalHash);
    }

    const feeTakenHash = await takePlatformFree(amount);

    console.log("feeTakenHash", feeTakenHash);

    if (!feeTakenHash) {
      throw new Error("Error in taking platform fee");
    }

    // Then execute the strategy purchase
    const purchaseHash = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS_ARB,
      abi: investABI,
      functionName: "buyWithReferal",
      args: [
        strategy,
        amountInETH,
        BigInt(timeInSeconds),
        [],
        ethers.ZeroAddress,
      ],
    });

    return purchaseHash;
  } catch (error) {
    console.error(error);
    return { status: false, message: "Transaction failed" };
  }
};

interface StrategyConfig {
  period: number;
  contract: string;
}

interface PeriodStrategies {
  [period: string]: StrategyConfig;
}

interface AssetStrategies {
  [strategy: string]: PeriodStrategies;
}

interface Strategies {
  [asset: string]: AssetStrategies;
}

export async function callHegicStrategyContract({
  optionType,
  amount,
  period,
  asset,
  premium,
}: HegicStrategyParams) {
  try {
    const strategies: Strategies = {
      ETH: {
        CALL: {
          "7-13": {
            period: 1123200,
            contract: "0x09a4B65b3144733f1bFBa6aEaBEDFb027a38Fb60",
            //0xF48f571DdD77dba9Ae10fefF6df04484685091D9 - 13
            // 0xaF38a4d9153B149F05FA85C2cCFAaA677c99040E - 29
            // 0x05458B7d9531EaD242290De60bEaa3cC10C87560 - 30
            // 0xE53a20c824cEAB8151AF8Fc92E7Eb689cFbD1231 - 60
          },
          "14-29": {
            period: 2505600,
            contract: "0x6418C3514923a6464A26A2ffA5f17bF1efC96a21",
          },
          "30-59": {
            period: 5097600,
            contract: "0xE377A1a97237b3B89a96d8B731A2ab10d5DaC16C",
          },
          "60-90": {
            period: 7776000,
            contract: "0x2727B807D22fCAeB7F900F49894054Ed92b9125B",
          },
        },
        PUT: {
          "7-13": {
            period: 1123200,
            contract: "0xaA0DfBFb8dA7f45BB41c0fB68B71FAEB959B22aa",
          },
          "14-29": {
            period: 2505600,
            contract: "0x2739A4C003080A5B3Ade22b92c3321EDa2Da3A9e",
          },
          "30-59": {
            period: 5097600,
            contract: "0xf711D0BC60F37cA28845BA623ccd9C635E5073A1",
          },
          "60-90": {
            period: 7776000,
            contract: "0x015FAA9aF7599e6cea597EBC7e7e04A149a3E992",
          },
        },
        STRAP: {
          "7-13": {
            period: 1123200,
            contract: "0x64622a28F97D877E9Ff1E2A7322786A58c3D8Fc7",
          },
          "14-29": {
            period: 2505600,
            contract: "0x64623eA34BC4B0d567b777213dcF9Ae3F8f1388F",
          },
          "30-59": {
            period: 5097600,
            contract: "0x64464e5fd7742277334dA1Fc4C189Ca12c3E30EA",
          },
          "60-90": {
            period: 7776000,
            contract: "0x69f53282F5C237Bac96231757A46D058E6b373d1",
          },
        },
      },
      // Add BTC section following the same structure
    };

    const periodRange = getPeriodRange(parseFloat(period));
    const strategyConfig = strategies[asset][optionType][periodRange];

    if (!strategyConfig) {
      throw new Error("Invalid strategy configuration");
    }

    return await strategyCall({
      strategy: strategyConfig.contract,
      amount,
      period: parseFloat(period),
      premium,
    });
  } catch (error) {
    console.error("Error in callHegicStrategyContract:", error);
    throw new Error("Transaction failed");
  }
}
