// GNS Multi-Collateral Diamond Contract Configuration
export const GNS_CONTRACTS = {
  // Main GNS Diamond Contract
  GNS_DIAMOND: "0xff162c694eaa571f685030649814282ea457f169",
  
  // USDC Address (Arbitrum)
  USDC: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  
  // Backend Base URL
  BACKEND_BASE_URL: "https://backend-arbitrum.gains.trade",
  
  // Trading Pairs Configuration
  // pairIndex mapping from gnsGuide.md
  PAIRS: {
    0: { from: "BTC", to: "USD", active: true },
    1: { from: "ETH", to: "USD", active: true },
    2: { from: "LINK", to: "USD", active: true },
    3: { from: "DOGE", to: "USD", active: true },
    4: { from: "MATIC", to: "USD", active: false },
    5: { from: "ADA", to: "USD", active: true },
    6: { from: "SUSHI", to: "USD", active: false },
    7: { from: "AAVE", to: "USD", active: true },
    8: { from: "ALGO", to: "USD", active: true },
    9: { from: "BAT", to: "USD", active: true },
    10: { from: "COMP", to: "USD", active: true },
    11: { from: "DOT", to: "USD", active: true },
    12: { from: "EOS", to: "USD", active: false },
    13: { from: "LTC", to: "USD", active: true },
    14: { from: "MANA", to: "USD", active: true },
    15: { from: "OMG", to: "USD", active: false },
    16: { from: "SNX", to: "USD", active: true },
    17: { from: "UNI", to: "USD", active: true },
    18: { from: "XLM", to: "USD", active: true },
    19: { from: "XRP", to: "USD", active: true },
    20: { from: "ZEC", to: "USD", active: false },
  },
  
  // Collateral Indexes
  COLLATERAL_INDEXES: {
    USDC: 1,
    // Add other collaterals as needed
  },
  
  // Trade Types
  TRADE_TYPES: {
    MARKET: 0,
    LIMIT: 1,
    STOP: 2,
  },
} as const;

export default GNS_CONTRACTS;

