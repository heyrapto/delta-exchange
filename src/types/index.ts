export interface OptionData {
    strike: number
    delta: number
    bidQty: number
    bid: number
    mark: number
    ask: number
    askQty: number
    oi: number
    volume: number
    change24h: number
    // Greek view specific
    vega?: number
    gamma?: number
    theta?: number
    low?: number
    high?: number
    open?: number
    last?: number
}

export type ViewMode = "table" | "chart"
export type TableView = "standard" | "greek" | "greekDetailed"
export type OptionType = "calls" | "puts"