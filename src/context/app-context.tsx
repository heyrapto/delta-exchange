"use client"

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useCallback,
    useEffect,
  } from "react";
  import { getProfitZones } from "../blockchain/hegic/profitZoneCalculator";
  import calculatePremium, {
    TokenType,
  } from "../blockchain/hegic/premuimCalculator";
  import { getAssetPrice } from "../blockchain/hegic/assetPrices";
  // GNS imports
  import { getPairPrice } from "../blockchain/gns/assetPrices";
  import { getUserGNSPositions, getTradingVariables } from "../blockchain/gns/gnsPositions";
import { useRouter } from "next/navigation";
import { TSentiment } from "@/types";
  
  type AppContextState = {
    period: string;
    amount: string;
    selectedPremium: string;
    selectedProfitZone: number;
    asset: TokenType;
    sentiment: TSentiment;
    strategy: string;
    premiumAndProfitZone: Array<{
      premium: string;
      profitZone: number;
    }>;
    isFetching: boolean;
    assetPrice: number;
    isFetchingPremiums: boolean;
    // GNS specific state
    gnsPairIndex: number;
    gnsLeverage: number;
    gnsTradeType: 'long' | 'short';
    gnsOrderType: 'market' | 'limit' | 'stop';
    gnsQuantity: string;
    gnsLotSize: string;
    gnsTp: string;
    gnsSl: string;
    gnsPairPrice: number;
    gnsAvailableMargin: number;
    gnsFundsRequired: number;
    gnsPositions: any[];
    gnsTradingVariables: any;
    isFetchingGNSPositions: boolean;
    isFetchingGNSPrices: boolean;
  };
  
  type AppContextType = {
    state: AppContextState;
    handlePeriodChange: (period: string) => void;
    handleAmountChange: (amount: string) => void;
    handleProfitZoneSelect: (strike: string) => void;
    handleAssetChange: (asset: TokenType) => void;
    handleSentimentChange: (sentiment: TSentiment) => void;
    handleStrategyChange: (strategy: string) => void;
    formatNumber: (num: number) => string;
    // GNS handlers
    handleGNSPairChange: (pairIndex: number) => void;
    handleGNSLeverageChange: (leverage: number) => void;
    handleGNSTradeTypeChange: (type: 'long' | 'short') => void;
    handleGNSOrderTypeChange: (type: 'market' | 'limit' | 'stop') => void;
    handleGNSQuantityChange: (quantity: string) => void;
    handleGNSLotSizeChange: (lotSize: string) => void;
    handleGNSTpChange: (tp: string) => void;
    handleGNSSlChange: (sl: string) => void;
    handleGNSQuantityPercent: (percent: number) => void;
    fetchGNSPositions: (userAddress: string) => Promise<void>;
    fetchGNSTradingVariables: () => Promise<void>;
  };
  
  const AppContext = createContext<AppContextType | undefined>(undefined);
  
  export function AppContextProvider({ children }: { children: ReactNode }) {
    const navigate = useRouter();
    const [state, setState] = useState<AppContextState>({
      period: "7",
      amount: "1",
      selectedPremium: "0",
      selectedProfitZone: 0,
      asset: "ETH" as TokenType,
      sentiment: "bull" as TSentiment,
      strategy: "CALL",
      premiumAndProfitZone: [],
      isFetching: false,
      isFetchingPremiums: false,
      assetPrice: 0,
      // GNS initial state
      gnsPairIndex: 0, // BTC/USD
      gnsLeverage: 200,
      gnsTradeType: 'long',
      gnsOrderType: 'market',
      gnsQuantity: '',
      gnsLotSize: '0.001 BTC',
      gnsTp: '',
      gnsSl: '',
      gnsPairPrice: 0,
      gnsAvailableMargin: 0,
      gnsFundsRequired: 0,
      gnsPositions: [],
      gnsTradingVariables: null,
      isFetchingGNSPositions: false,
      isFetchingGNSPrices: false,
    });
  
    const handlePeriodChange = useCallback(
      (period: string) => {
        setState((prev) => ({ ...prev, period }));
      },
      [navigate]
    );
  
    const handleAmountChange = useCallback(
      (amount: string) => {
        setState((prev) => ({ ...prev, amount }));
      },
      [navigate]
    );
  
    const handleProfitZoneSelect = useCallback(
      (profitZone: string) => {
        console.log("premium", profitZone);
        setState((prev) => ({
          ...prev,
          selectedProfitZone: Number(profitZone),
          selectedPremium:
            state.premiumAndProfitZone.find(
              (item) => item.profitZone.toString() === profitZone
            )?.premium || "0",
        }));
      },
      [navigate]
    );
  
    const handleAssetChange = useCallback(
      (asset: TokenType) => {
        setState((prev) => ({ ...prev, asset }));
      },
      [navigate]
    );
  
    const handleSentimentChange = useCallback(
      (sentiment: TSentiment) => {
        setState((prev) => ({ ...prev, sentiment }));
      },
      [navigate]
    );
  
    const formatNumber = useCallback((num: number) => {
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(num);
    }, []);
  
    const handleStrategyChange = useCallback(
      (strategy: string) => {
        setState((prev) => ({ ...prev, strategy }));
      },
      [navigate]
    );

    // GNS handlers
    const handleGNSPairChange = useCallback(
      (pairIndex: number) => {
        setState((prev) => ({ ...prev, gnsPairIndex: pairIndex }));
      },
      []
    );

    const handleGNSLeverageChange = useCallback(
      (leverage: number) => {
        setState((prev) => ({ ...prev, gnsLeverage: leverage }));
      },
      []
    );

    const handleGNSTradeTypeChange = useCallback(
      (type: 'long' | 'short') => {
        setState((prev) => ({ ...prev, gnsTradeType: type }));
      },
      []
    );

    const handleGNSOrderTypeChange = useCallback(
      (type: 'market' | 'limit' | 'stop') => {
        setState((prev) => ({ ...prev, gnsOrderType: type }));
      },
      []
    );

    const handleGNSQuantityChange = useCallback(
      (quantity: string) => {
        setState((prev) => {
          const qty = parseFloat(quantity) || 0;
          const lotSizeValue = parseFloat(prev.gnsLotSize.replace(' BTC', '')) || 0.001;
          const fundsRequired = qty * lotSizeValue * prev.gnsPairPrice / prev.gnsLeverage;
          return { ...prev, gnsQuantity: quantity, gnsFundsRequired: fundsRequired };
        });
      },
      []
    );

    const handleGNSLotSizeChange = useCallback(
      (lotSize: string) => {
        setState((prev) => ({ ...prev, gnsLotSize: lotSize }));
      },
      []
    );

    const handleGNSTpChange = useCallback(
      (tp: string) => {
        setState((prev) => ({ ...prev, gnsTp: tp }));
      },
      []
    );

    const handleGNSSlChange = useCallback(
      (sl: string) => {
        setState((prev) => ({ ...prev, gnsSl: sl }));
      },
      []
    );

    const handleGNSQuantityPercent = useCallback(
      (percent: number) => {
        setState((prev) => {
          const maxQuantity = prev.gnsAvailableMargin > 0 
            ? (prev.gnsAvailableMargin * prev.gnsLeverage) / prev.gnsPairPrice 
            : 0;
          const quantity = (maxQuantity * percent / 100).toFixed(3);
          const lotSizeValue = parseFloat(prev.gnsLotSize.replace(' BTC', '')) || 0.001;
          const fundsRequired = parseFloat(quantity) * lotSizeValue * prev.gnsPairPrice / prev.gnsLeverage;
          return { 
            ...prev, 
            gnsQuantity: quantity, 
            gnsFundsRequired: fundsRequired 
          };
        });
      },
      []
    );

    const fetchGNSPositions = useCallback(
      async (userAddress: string) => {
        if (!userAddress) return;
        setState((prev) => ({ ...prev, isFetchingGNSPositions: true }));
        try {
          const positions = await getUserGNSPositions(userAddress);
          setState((prev) => ({ ...prev, gnsPositions: positions }));
        } catch (error) {
          console.error("Error fetching GNS positions:", error);
        } finally {
          setState((prev) => ({ ...prev, isFetchingGNSPositions: false }));
        }
      },
      []
    );

    const fetchGNSTradingVariables = useCallback(
      async () => {
        setState((prev) => ({ ...prev, isFetchingGNSPrices: true }));
        try {
          const variables = await getTradingVariables();
          setState((prev) => ({ ...prev, gnsTradingVariables: variables }));
        } catch (error) {
          console.error("Error fetching GNS trading variables:", error);
        } finally {
          setState((prev) => ({ ...prev, isFetchingGNSPrices: false }));
        }
      },
      []
    );
  
    // fetch asset price
    useEffect(() => {
      const fetchAssetPrice = async () => {
        setState((prev) => ({ ...prev, isFetching: true }));
        getAssetPrice(state.asset)
          .then((data) => {
            setState((prev) => ({
              ...prev,
              assetPrice: data,
            }));
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setState((prev) => ({ ...prev, isFetching: false }));
          });
      };
  
      fetchAssetPrice();
    }, [state.asset]);
  
    // calculate Strike (Cost) and premium
    useEffect(() => {
      const fetchPremium = async () => {
        setState((prev) => ({ ...prev, isFetchingPremiums: true }));
  
        calculatePremium(
          Number(state.amount),
          Number(state.period),
          state.strategy.split("-")[0].toUpperCase() as string,
          state.asset
        )
          .then((premiums) => {
            console.log("strategy", state.strategy);
            const profitZones = getProfitZones(
              premiums as string[],
              state.strategy,
              state.assetPrice,
              state.amount
            );
  
            console.log(premiums);
  
            const combinedData = (premiums as string[]).map((premium, index) => ({
              premium,
              profitZone: profitZones[index],
            }));
  
            setState((prev) => ({
              ...prev,
              premiumAndProfitZone: combinedData,
              selectedPremium: combinedData[0].premium,
              selectedProfitZone: combinedData[0].profitZone,
            }));
          })
  
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setState((prev) => ({ ...prev, isFetchingPremiums: false }));
          });
      };
  
      fetchPremium();
    }, [
      state.amount,
      state.period,
      state.strategy,
      state.asset,
      state.sentiment,
      state.assetPrice,
    ]);
  
    // Fetch GNS pair price when pairIndex changes
    useEffect(() => {
      const fetchGNSPairPrice = async () => {
        setState((prev) => ({ ...prev, isFetchingGNSPrices: true }));
        try {
          const price = await getPairPrice(state.gnsPairIndex);
          setState((prev) => ({ ...prev, gnsPairPrice: price }));
        } catch (error) {
          console.error("Error fetching GNS pair price:", error);
        } finally {
          setState((prev) => ({ ...prev, isFetchingGNSPrices: false }));
        }
      };

      if (state.gnsPairIndex !== undefined) {
        fetchGNSPairPrice();
      }
    }, [state.gnsPairIndex]);

    return (
      <AppContext.Provider
        value={{
          state,
          handlePeriodChange,
          handleAmountChange,
          handleProfitZoneSelect,
          handleAssetChange,
          handleSentimentChange,
          handleStrategyChange,
          formatNumber,
          // GNS handlers
          handleGNSPairChange,
          handleGNSLeverageChange,
          handleGNSTradeTypeChange,
          handleGNSOrderTypeChange,
          handleGNSQuantityChange,
          handleGNSLotSizeChange,
          handleGNSTpChange,
          handleGNSSlChange,
          handleGNSQuantityPercent,
          fetchGNSPositions,
          fetchGNSTradingVariables,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
  export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error(
        "usePriceSelector must be used within a PriceSelectorProvider"
      );
    }
    return context;
  }  