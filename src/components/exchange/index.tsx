import { ExchangePanel } from "./exchange-panel"
import { ExchangeView } from "./exchange-view"

export const Exchange = () => {
    return (
        <div className="flex flex-col">
            <ExchangeView />
            <ExchangePanel />
        </div>
    )
}