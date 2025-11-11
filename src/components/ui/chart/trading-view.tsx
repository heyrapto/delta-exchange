"use client"

import { useRef, useState, useEffect } from "react"

export const TradingViewChart = ({ symbol, interval = '60' }: { symbol: string; interval?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        const existingScript = document.getElementById('tradingview-widget-script')
        if (existingScript) existingScript.remove()

        const script = document.createElement('script')
        script.id = 'tradingview-widget-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = () => initWidget()
        document.head.appendChild(script)

        function initWidget() {
            if (containerRef.current && (window as any).TradingView) {
                containerRef.current.innerHTML = ''
                const widgetContainer = document.createElement('div')
                widgetContainer.id = 'tradingview_widget'
                widgetContainer.style.height = '100%'
                widgetContainer.style.width = '100%'
                containerRef.current.appendChild(widgetContainer)

                new (window as any).TradingView.widget({
                    autosize: true,
                    symbol: symbol,
                    interval: interval,
                    timezone: "Etc/UTC",
                    theme: "light",
                    style: "1",
                    locale: "en",
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    container_id: 'tradingview_widget',
                    height: '100%',
                    width: '100%',
                })

                setTimeout(() => setIsLoading(false), 1000)
            }
        }

        return () => {
            if (existingScript) existingScript.remove()
        }
    }, [symbol, interval])

    return (
        <div className="relative h-screen md:h-full w-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1d25]/80 z-10">
                    <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                </div>
            )}
            <div className="h-full w-full" ref={containerRef}></div>
        </div>
    )
}