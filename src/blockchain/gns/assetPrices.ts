import axios from "axios";
import GNS_CONTRACTS from "./gnsContracts";

type CacheEntry = {
  price: number;
  timestamp: number;
};

type PriceCache = {
  [key: string]: CacheEntry;
};

const CACHE_DURATION = 30 * 1000; // 30 seconds cache duration
const priceCache: PriceCache = {};

const getCachedPrice = (asset: string): number | null => {
  const cacheEntry = priceCache[asset];
  if (!cacheEntry) return null;

  const now = Date.now();
  if (now - cacheEntry.timestamp > CACHE_DURATION) return null;

  return cacheEntry.price;
};

const setCachedPrice = (asset: string, price: number): void => {
  priceCache[asset] = {
    price,
    timestamp: Date.now(),
  };
};

/**
 * Get price for a specific asset from CryptoCompare
 */
const getAssetPriceFromAPI = async (asset: string): Promise<number> => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${asset}&tsyms=USD`
    );

    const price = response.data?.USD;
    if (!price) throw new Error("Invalid API response format");

    return price;
  } catch (error) {
    console.error(`Error fetching ${asset} price:`, error);
    throw error;
  }
};

/**
 * Get price for a specific asset (with caching)
 */
export const getAssetPrice = async (asset: string): Promise<number> => {
  const upperAsset = asset.toUpperCase();
  const cachedPrice = getCachedPrice(upperAsset);
  if (cachedPrice !== null) return cachedPrice;

  try {
    const price = await getAssetPriceFromAPI(upperAsset);
    setCachedPrice(upperAsset, price);
    return price;
  } catch (error) {
    console.error(`Error fetching ${upperAsset} price:`, error);
    const lastCachedPrice = priceCache[upperAsset]?.price;
    if (lastCachedPrice) return lastCachedPrice;
    throw error;
  }
};

/**
 * Get price for a trading pair by pairIndex
 */
export const getPairPrice = async (pairIndex: number): Promise<number> => {
  const pair = GNS_CONTRACTS.PAIRS[pairIndex as keyof typeof GNS_CONTRACTS.PAIRS];
  if (!pair) {
    throw new Error(`Invalid pair index: ${pairIndex}`);
  }

  return getAssetPrice(pair.from);
};

/**
 * Get prices for multiple assets at once
 */
export const getMultipleAssetPrices = async (
  assets: string[]
): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {};

  await Promise.all(
    assets.map(async (asset) => {
      try {
        prices[asset.toUpperCase()] = await getAssetPrice(asset);
      } catch (error) {
        console.error(`Failed to fetch price for ${asset}:`, error);
      }
    })
  );

  return prices;
};

/**
 * Get all active pair prices
 */
export const getAllActivePairPrices = async (): Promise<
  Record<number, number>
> => {
  const activePairs = Object.entries(GNS_CONTRACTS.PAIRS).filter(
    ([, pair]) => pair.active
  );

  const prices: Record<number, number> = {};

  await Promise.all(
    activePairs.map(async ([pairIndex, pair]) => {
      try {
        const price = await getAssetPrice(pair.from);
        prices[Number(pairIndex)] = price;
      } catch (error) {
        console.error(
          `Failed to fetch price for pair ${pairIndex} (${pair.from}):`,
          error
        );
      }
    })
  );

  return prices;
};

// Convenience functions for common assets
export const getBtcPrice = async (): Promise<number> => {
  return getAssetPrice("BTC");
};

export const getEthPrice = async (): Promise<number> => {
  return getAssetPrice("ETH");
};

export const getLinkPrice = async (): Promise<number> => {
  return getAssetPrice("LINK");
};

export const getDogePrice = async (): Promise<number> => {
  return getAssetPrice("DOGE");
};

export const getAdaPrice = async (): Promise<number> => {
  return getAssetPrice("ADA");
};

export const getAavePrice = async (): Promise<number> => {
  return getAssetPrice("AAVE");
};

export const getAlgoPrice = async (): Promise<number> => {
  return getAssetPrice("ALGO");
};

export const getBatPrice = async (): Promise<number> => {
  return getAssetPrice("BAT");
};

export const getCompPrice = async (): Promise<number> => {
  return getAssetPrice("COMP");
};

export const getDotPrice = async (): Promise<number> => {
  return getAssetPrice("DOT");
};

export const getLtcPrice = async (): Promise<number> => {
  return getAssetPrice("LTC");
};

export const getManaPrice = async (): Promise<number> => {
  return getAssetPrice("MANA");
};

export const getSnxPrice = async (): Promise<number> => {
  return getAssetPrice("SNX");
};

export const getUniPrice = async (): Promise<number> => {
  return getAssetPrice("UNI");
};

export const getXlmPrice = async (): Promise<number> => {
  return getAssetPrice("XLM");
};

export const getXrpPrice = async (): Promise<number> => {
  return getAssetPrice("XRP");
};

