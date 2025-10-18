import Image from 'next/image'

export const StrategyBuilder = () => {
  return (
    <div className="h-[700px] w-full flex flex-col items-center justify-center bg-[#1a1d25] text-gray-300">
      {/* Placeholder Image */}
      <Image src={"/basket-order.webp"} width={150} height={150} alt="Add Contracts" className="mb-4 opacity-80" />

      {/* Main Text */}
      <div className="text-center">
        <p className="text-white font-medium mb-1">+ Add Contracts from Options Chain</p>
        <p className="text-gray-400 text-sm">
          Selected contracts will show up here
        </p>
      </div>

      {/* Learn More Link */}
      <a
        href="#"
        className="text-orange-500 text-sm mt-6 hover:underline flex items-center gap-1"
        target="_blank"
      >
        Learn more about basket orders
        <span className="inline-block">↗</span>
      </a>

      {/* Footer */}
      <div className="mt-auto w-full px-4 py-2 border-t border-gray-700 text-sm text-gray-300 flex justify-between">
        <span>Available Margin</span>
        <span>0 USD</span>
      </div>
    </div>
  )
}
