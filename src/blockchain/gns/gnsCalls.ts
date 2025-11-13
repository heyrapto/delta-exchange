import { writeContract, readContract, getAccount } from "@wagmi/core";
import { parseUnits, parseEther, maxUint256 } from "viem";
import { ethers } from "ethers";
import erc20ABI from "./ERC20ABI.json";
import gnsMergedDiamondABI from "./gnsMergedDiamondABI.json";
import { wagmiConfig } from "../../utils/wagmi";
import GNS_CONTRACTS from "./gnsContracts";
import { takePlatformFee } from "./platformFee";

// Trade struct interface matching the contract
export interface GNSTrade {
  user: string;
  index: number;
  pairIndex: number;
  leverage: number; // in 1e3 precision (e.g., 150000 = 150x)
  long: boolean;
  isOpen: boolean;
  collateralIndex: number;
  tradeType: number; // 0 = MARKET, 1 = LIMIT, 2 = STOP
  collateralAmount: bigint; // in wei/units
  openPrice: bigint; // scaled by 1e8
  tp: bigint; // take profit price (1e8 precision)
  sl: bigint; // stop loss price (1e8 precision)
}

export interface OpenTradeParams {
  pairIndex: number;
  leverage: number; // e.g., 150 for 150x
  long: boolean;
  collateralAmount: number; // in USDC (will be converted to 6 decimals)
  openPrice?: bigint; // for limit orders (1e8 precision)
  tp?: bigint; // take profit (1e8 precision)
  sl?: bigint; // stop loss (1e8 precision)
  tradeType?: number; // 0 = MARKET, 1 = LIMIT, 2 = STOP
  collateralIndex?: number; // default 1 for USDC
  maxSlippageP?: number; // max slippage in basis points (default 1000 = 10%)
  referrer?: string; // referral address
  index?: number; // trade index (auto-incremented, usually 0 for new trades)
}

/**
 * Approve USDC spending for GNS contract
 */
const approveUSDC = async (amount: bigint): Promise<string | null> => {
  try {
    const account = getAccount(wagmiConfig).address;
    if (!account) {
      throw new Error("No account connected");
    }

    const allowance = await readContract(wagmiConfig, {
      address: GNS_CONTRACTS.USDC as `0x${string}`,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account, GNS_CONTRACTS.GNS_DIAMOND],
    });

    if ((allowance as bigint) < amount) {
      const approvalHash = await writeContract(wagmiConfig, {
        address: GNS_CONTRACTS.USDC as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [GNS_CONTRACTS.GNS_DIAMOND, maxUint256],
      });
      console.log("USDC Approval Hash:", approvalHash);
      return approvalHash;
    }

    return null;
  } catch (error) {
    console.error("Error approving USDC:", error);
    throw error;
  }
};

/**
 * Open a market trade
 */
export const openTrade = async (params: OpenTradeParams): Promise<string> => {
  try {
    const account = getAccount(wagmiConfig).address;
    if (!account) {
      throw new Error("No account connected");
    }

    const {
      pairIndex,
      leverage,
      long,
      collateralAmount,
      openPrice = BigInt(0),
      tp = BigInt(0),
      sl = BigInt(0),
      tradeType = GNS_CONTRACTS.TRADE_TYPES.MARKET,
      collateralIndex = GNS_CONTRACTS.COLLATERAL_INDEXES.USDC,
      maxSlippageP = 1000, // 10% default
      referrer = ethers.ZeroAddress,
      index = 0,
    } = params;

    // Convert leverage to 1e3 precision (e.g., 150 -> 150000)
    const leverageScaled = BigInt(leverage * 1000);

    // Convert collateral amount to 6 decimals (USDC)
    const collateralAmountWei = parseUnits(
      collateralAmount.toString(),
      6
    );

    // Approve USDC if needed
    await approveUSDC(collateralAmountWei);

    // Take platform fee
    const feeHash = await takePlatformFee(collateralAmount);
    console.log("Platform fee hash:", feeHash);

    // Prepare trade struct
    const trade: GNSTrade = {
      user: account,
      index,
      pairIndex,
      leverage: Number(leverageScaled),
      long,
      isOpen: true,
      collateralIndex,
      tradeType,
      collateralAmount: collateralAmountWei,
      openPrice,
      tp,
      sl,
    };

    // Call openTrade function
    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "openTrade",
      args: [trade, maxSlippageP, referrer],
    });

    console.log("Open Trade Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error opening trade:", error);
    throw error;
  }
};

/**
 * Open a trade with native ETH (if supported)
 */
export const openTradeNative = async (
  params: OpenTradeParams
): Promise<string> => {
  try {
    const account = getAccount(wagmiConfig).address;
    if (!account) {
      throw new Error("No account connected");
    }

    const {
      pairIndex,
      leverage,
      long,
      collateralAmount,
      openPrice = BigInt(0),
      tp = BigInt(0),
      sl = BigInt(0),
      tradeType = GNS_CONTRACTS.TRADE_TYPES.MARKET,
      collateralIndex = GNS_CONTRACTS.COLLATERAL_INDEXES.USDC,
      maxSlippageP = 1000,
      referrer = ethers.ZeroAddress,
      index = 0,
    } = params;

    const leverageScaled = BigInt(leverage * 1000);
    const collateralAmountWei = parseEther(collateralAmount.toString());

    const trade: GNSTrade = {
      user: account,
      index,
      pairIndex,
      leverage: Number(leverageScaled),
      long,
      isOpen: true,
      collateralIndex,
      tradeType,
      collateralAmount: collateralAmountWei,
      openPrice,
      tp,
      sl,
    };

    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "openTradeNative",
      args: [trade, maxSlippageP, referrer],
      value: collateralAmountWei,
    });

    console.log("Open Trade Native Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error opening trade with native:", error);
    throw error;
  }
};

/**
 * Update Take Profit and Stop Loss for an active trade
 */
export const updateTpSl = async (
  index: number,
  newTp: bigint,
  newSl: bigint
): Promise<string> => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "updateTpSl",
      args: [index, newTp, newSl],
    });

    console.log("Update TP/SL Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error updating TP/SL:", error);
    throw error;
  }
};

/**
 * Cancel a pending limit order
 */
export const cancelOpenOrder = async (index: number): Promise<string> => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "cancelOpenOrder",
      args: [index],
    });

    console.log("Cancel Order Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

/**
 * Close a trade
 */
export const closeTrade = async (index: number): Promise<string> => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "closeTrade",
      args: [index],
    });

    console.log("Close Trade Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error closing trade:", error);
    throw error;
  }
};

/**
 * Close a trade with market price
 */
export const closeTradeMarket = async (
  index: number,
  expectedPrice: bigint
): Promise<string> => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "closeTradeMarket",
      args: [index, expectedPrice],
    });

    console.log("Close Trade Market Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error closing trade market:", error);
    throw error;
  }
};

/**
 * Update leverage for an existing trade
 */
export const updateLeverage = async (
  index: number,
  newLeverage: number
): Promise<string> => {
  try {
    const leverageScaled = BigInt(newLeverage * 1000);

    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "updateLeverage",
      args: [index, leverageScaled],
    });

    console.log("Update Leverage Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error updating leverage:", error);
    throw error;
  }
};

/**
 * Update leverage with native ETH
 */
export const updateLeverageNative = async (
  index: number,
  newLeverage: number,
  value: bigint
): Promise<string> => {
  try {
    const leverageScaled = BigInt(newLeverage * 1000);

    const hash = await writeContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "updateLeverageNative",
      args: [index, leverageScaled],
      value,
    });

    console.log("Update Leverage Native Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error updating leverage native:", error);
    throw error;
  }
};

