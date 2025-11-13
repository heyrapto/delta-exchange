/* eslint-disable @typescript-eslint/no-explicit-any */
import { readContract } from "@wagmi/core";
import axios from "axios";
import { Contract, ethers } from "ethers";
import { wagmiConfig } from "../../utils/wagmi";
import gnsMergedDiamondABI from "./gnsMergedDiamondABI.json";
import GNS_CONTRACTS from "./gnsContracts";
import { GNSTrade } from "./gnsCalls";

export type GNSPositionType = {
  success: boolean;
  index: number;
  pairIndex: number;
  pairName: string;
  leverage: number;
  long: boolean;
  isOpen: boolean;
  collateralAmount: string;
  openPrice: string;
  currentPrice?: string;
  tp: string;
  sl: string;
  pnl?: string;
  pnlPercentage?: string;
  tradeType: string;
  collateralIndex: number;
};

/**
 * Get a single trade from the contract
 */
export const getTrade = async (
  userAddress: string,
  index: number
): Promise<GNSTrade | null> => {
  try {
    const trade = await readContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "getTrade",
      args: [userAddress, index],
    });

    if (!trade) {
      return null;
    }

    return trade as unknown as GNSTrade;
  } catch (error) {
    console.error(`Error fetching trade ${index}:`, error);
    return null;
  }
};

/**
 * Get all trades for multiple traders
 */
export const getAllTradesForTraders = async (
  traders: string[],
  start: number,
  count: number
): Promise<GNSTrade[]> => {
  try {
    const trades = await readContract(wagmiConfig, {
      address: GNS_CONTRACTS.GNS_DIAMOND as `0x${string}`,
      abi: gnsMergedDiamondABI.abi,
      functionName: "getAllTradesForTraders",
      args: [traders, start, count],
    });

    return trades as unknown as GNSTrade[];
  } catch (error) {
    console.error("Error fetching all trades:", error);
    return [];
  }
};

/**
 * Get user's open trades from backend
 */
export const getUserOpenTradesFromBackend = async (
  userAddress: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${GNS_CONTRACTS.BACKEND_BASE_URL}/open-trades/${userAddress}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching open trades from backend:", error);
    return [];
  }
};

/**
 * Get user's trading variables from backend
 */
export const getUserTradingVariables = async (
  userAddress: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `${GNS_CONTRACTS.BACKEND_BASE_URL}/user-trading-variables/${userAddress}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error fetching user trading variables:", error);
    return null;
  }
};

/**
 * Get trading variables (pairs, fees, etc.) from backend
 */
export const getTradingVariables = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${GNS_CONTRACTS.BACKEND_BASE_URL}/trading-variables`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error fetching trading variables:", error);
    return null;
  }
};

/**
 * Get user's trading history from backend
 */
export const getUserTradingHistory = async (
  userAddress: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${GNS_CONTRACTS.BACKEND_BASE_URL}/personal-trading-history-table/${userAddress}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching trading history:", error);
    return [];
  }
};

/**
 * Format trade type number to string
 */
const formatTradeType = (tradeType: number): string => {
  switch (tradeType) {
    case 0:
      return "MARKET";
    case 1:
      return "LIMIT";
    case 2:
      return "STOP";
    default:
      return "UNKNOWN";
  }
};

/**
 * Get pair name from pairIndex
 */
const getPairName = (pairIndex: number): string => {
  const pair = GNS_CONTRACTS.PAIRS[pairIndex as keyof typeof GNS_CONTRACTS.PAIRS];
  if (pair) {
    return `${pair.from}/${pair.to}`;
  }
  return `PAIR_${pairIndex}`;
};

/**
 * Calculate PnL for a position
 */
const calculatePnL = (
  trade: GNSTrade,
  currentPrice: bigint
): { pnl: string; pnlPercentage: string } | null => {
  try {
    if (!trade.isOpen || !currentPrice) {
      return null;
    }

    const openPrice = Number(trade.openPrice) / 1e8;
    const currentPriceNum = Number(currentPrice) / 1e8;
    const leverage = Number(trade.leverage) / 1000;
    const collateral = Number(trade.collateralAmount) / 1e6; // USDC has 6 decimals

    let priceChange: number;
    if (trade.long) {
      priceChange = (currentPriceNum - openPrice) / openPrice;
    } else {
      priceChange = (openPrice - currentPriceNum) / openPrice;
    }

    const pnl = collateral * leverage * priceChange;
    const pnlPercentage = priceChange * leverage * 100;

    return {
      pnl: pnl.toFixed(2),
      pnlPercentage: pnlPercentage.toFixed(2),
    };
  } catch (error) {
    console.error("Error calculating PnL:", error);
    return null;
  }
};

/**
 * Get formatted position data from a trade
 */
export const getGNSPositionData = async (
  userAddress: string,
  index: number,
  currentPrice?: bigint
): Promise<GNSPositionType | null> => {
  try {
    const trade = await getTrade(userAddress, index);

    if (!trade) {
      return null;
    }

    const leverage = Number(trade.leverage) / 1000;
    const collateralAmount = ethers.formatUnits(trade.collateralAmount, 6);
    const openPrice = (Number(trade.openPrice) / 1e8).toFixed(2);
    const tp = trade.tp > 0 ? (Number(trade.tp) / 1e8).toFixed(2) : "0";
    const sl = trade.sl > 0 ? (Number(trade.sl) / 1e8).toFixed(2) : "0";

    let pnlData = null;
    if (currentPrice) {
      pnlData = calculatePnL(trade, currentPrice);
    }

    return {
      success: true,
      index: trade.index,
      pairIndex: trade.pairIndex,
      pairName: getPairName(trade.pairIndex),
      leverage,
      long: trade.long,
      isOpen: trade.isOpen,
      collateralAmount,
      openPrice,
      currentPrice: currentPrice
        ? (Number(currentPrice) / 1e8).toFixed(2)
        : undefined,
      tp,
      sl,
      pnl: pnlData?.pnl,
      pnlPercentage: pnlData?.pnlPercentage,
      tradeType: formatTradeType(trade.tradeType),
      collateralIndex: trade.collateralIndex,
    };
  } catch (error) {
    console.error(`Error getting position data for index ${index}:`, error);
    return null;
  }
};

/**
 * Get all user positions
 */
export const getUserGNSPositions = async (
  userAddress: string
): Promise<GNSPositionType[]> => {
  try {
    // First, try to get trades from on-chain
    const trades = await getAllTradesForTraders([userAddress], 0, 50);

    if (trades.length === 0) {
      return [];
    }

    // Filter only open trades
    const openTrades = trades.filter((trade) => trade.isOpen);

    // Get position data for each open trade
    const positions = await Promise.all(
      openTrades.map(async (trade) => {
        try {
          return await getGNSPositionData(userAddress, trade.index);
        } catch (error) {
          console.error(
            `Failed to fetch position ${trade.index}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out null positions
    const validPositions = positions.filter(
      (position): position is GNSPositionType => position !== null
    );

    return validPositions;
  } catch (error) {
    console.error("Error fetching user GNS positions:", error);
    return [];
  }
};

