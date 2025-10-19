import Image from 'next/image'

export const StrategyBuilder = () => {
  return (
    <div className="h-[700px] w-full flex flex-col items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
      {/* Placeholder Image */}
      <div className="flex flex-col items-center gap-2 mt-[150px]">
      <Image src={"/basket-order.webp"} width={150} height={150} alt="Add Contracts" className="mb-4 opacity-80" />

      {/* Main Text */}
      <div className="text-center">
        <p className="font-medium text-lg mb-1" style={{ color: 'var(--text-primary)' }}>+ Add Contracts from Options Chain</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Selected contracts will show up here
        </p>
      </div>
      </div>

      {/* Footer */}
      <div className="mt-auto w-full px-4 py-2 text-sm justify-center items-center flex flex-col" style={{ color: 'var(--text-secondary)' }}>

         {/* Learn More Link */}
      <a
        href="#"
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: 'var(--button-primary-bg)' }}
        target="_blank"
      >
        Learn more about basket orders
        <span className="inline-block">↗</span>
      </a>
        <span>Available Margin 0 USD</span>
      </div>
    </div>
  )
}
