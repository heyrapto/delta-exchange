/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeContract } from "@wagmi/core";
import axios from "axios";
// import HEGOPS_ABI from "./HegopsABI.json";
import HEGIC_STRATEGIES_ABI from "./hegicStrategiesABI.json";
import HEGIC_OPERATIONAL_TREASURY_ABI from "./OperationalTreasuryABI.json";
import { Contract, ethers } from "ethers";
import { wagmiConfig } from "../../utils/wagmi";
import { provider } from "./provider";
import { ENVIRONMENT } from "../../utils/environment";
import { Hex } from "viem";
import { strategies } from "./hegicStrategies";

export type HegicPositionType = {
  success: boolean;
  positionId: number;
  state: number;
  strategy: string;
  negPnl: string;
  postPnl: string;
  expirationTimestamp: number;
  amount: string;
  markPrice: string;
  isExpired: boolean;
  payoutAmount: string;
  profit: string;
  strikePrice: string;
  payoff: boolean;
  strategyInfo: {
    name: string;
    asset: string;
  };
};

const HEGIC_OPERATIONAL_TREASURY = "0xec096ea6eB9aa5ea689b0CF00882366E92377371";
const HEGOPS_CONTRACT_ADDRESS = "0x5Fe380D68fEe022d8acd42dc4D36FbfB249a76d5";

function convertTimestampToCountdown(expirationTimestamp: string) {
  const now = Date.now() / 1000;
  console.log(
    "now ==> ",
    now,
    "Expiration Timestamp ==> ",
    Number(expirationTimestamp)
  );
  const timeDifference = Number(expirationTimestamp) - now;
  console.log("Time Difference ==> ", timeDifference);
  console.log("Expiration Date", new Date(Number(expirationTimestamp)));

  console.log("Time Difference in seconds:", timeDifference);

  if (timeDifference <= 0) {
    return "Expired";
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  return `${days} days and ${hours} hours`;
}

export const closeHegicPosition = async (
  positionId: number,
  walletAddress: string
): Promise<string | null> => {
  try {
    console.log("Closing Hegic Position:", positionId);

    const hash = await writeContract(wagmiConfig, {
      address: HEGIC_OPERATIONAL_TREASURY,
      abi: HEGIC_OPERATIONAL_TREASURY_ABI,
      functionName: "payOff",
      args: [positionId, walletAddress],
    });

    console.log("Transaction Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error closing Hegic position:", error);
    return null;
  }
};

const formatTimeRemaining = (timestamp: number) => {
  const totalSeconds = Number(timestamp) - Math.floor(Date.now() / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ");
};

const getHegicPositionAmountAndMarkPrice = async (
  positionId: string,
  strategy: Hex,
  address: Hex
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!provider) {
      throw new Error("Provider is not initialized");
    }
    const strategyContract = new ethers.Contract(
      strategy,
      HEGIC_STRATEGIES_ABI,
      provider
    );
    const [strategyData, payoutAmount, payoff] = await Promise.all([
      strategyContract.strategyData(positionId),
      strategyContract.payOffAmount(positionId),
      strategyContract.isPayoffAvailable(positionId, address, strategy),
    ]);

    const [amount, markPrice] = strategyData;

    return { amount, markPrice, payoutAmount, payoff };
  } catch (error) {
    throw error;
  }
};

export const getHegicPositionPnl = async (positionId: string, address: Hex) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!provider) {
      throw new Error("Provider is not defined");
    }

    const contract = new Contract(
      HEGIC_OPERATIONAL_TREASURY,
      HEGIC_OPERATIONAL_TREASURY_ABI,
      provider
    );

    const [state, strategy, negPnl, postPnl, expirationTimestamp] =
      await contract.lockedLiquidity(positionId);

    if (!strategy || !expirationTimestamp || !state) {
      return;
    }

    const { amount, markPrice, payoutAmount, payoff } =
      await getHegicPositionAmountAndMarkPrice(positionId, strategy, address);
    if (!amount || !markPrice) {
      throw new Error("Couldn't Fetch Amount and Mark Prices");
    }

    const strategyInfo = strategies[strategy as keyof typeof strategies];

    return {
      success: true,
      positionId,
      state,
      strategy,
      strategyInfo,
      payoff,
      negPnl: parseFloat(ethers.formatUnits(negPnl, 6)).toFixed(2),
      postPnl: parseFloat(ethers.formatUnits(postPnl, 6)).toFixed(2),
      expirationTimestamp: formatTimeRemaining(expirationTimestamp),
      expiryCountDown: convertTimestampToCountdown(expirationTimestamp),
      amount: ethers.formatEther(amount),
      markPrice: parseFloat(ethers.formatUnits(markPrice, 10)).toFixed(2),
      strikePrice: parseFloat(ethers.formatUnits(markPrice, 8)).toFixed(2),
      isExpired: Number(expirationTimestamp) < Date.now() / 1000,
      payoutAmount: parseFloat(ethers.formatUnits(payoutAmount, 6)).toFixed(2),
      profit: (
        parseFloat(ethers.formatUnits(postPnl, 6)) -
        parseFloat(ethers.formatUnits(payoutAmount, 6))
      ).toFixed(2),
    };
  } catch (error) {
    throw error;
  }
};
export const getUserHegicPositions = async (address: string) => {
  // gets the Posittions of the user by their NFT IDs
  // Gets the Position Data
  // eslint-disable-next-line no-useless-catch
  try {
    const baseURL = `https://arb-mainnet.g.alchemy.com/v2/${ENVIRONMENT.ARBISCAN_API_KEY}`;
    const url = `${baseURL}/getNFTs/?owner=${address}`;

    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
      },
    });

    const NFTs = response.data.ownedNfts || [];

    const positionIds = NFTs.map((nft: any) => {
      if (
        nft.contract.address.toLowerCase() ===
        HEGOPS_CONTRACT_ADDRESS.toLowerCase()
      ) {
        return Number(nft.id.tokenId);
      }
    });

    let userHegicPositionsData = await Promise.all(
      positionIds.map(async (positionId: string) => {
        const positionData = await getHegicPositionPnl(
          positionId,
          address as Hex
        );
        return positionData;
      })
    );
    userHegicPositionsData = userHegicPositionsData.filter(
      (position) => position != null
    );
    console.log("All positions data -", userHegicPositionsData);
    return userHegicPositionsData
      ? (userHegicPositionsData as HegicPositionType[])
      : [];
  } catch (error) {
    throw error;
  }
};
