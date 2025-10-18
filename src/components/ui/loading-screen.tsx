export const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex space-x-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" />
            </div>
        </div>
    )
}
