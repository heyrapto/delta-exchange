const Loader = () => {
    return (
      <div className="flex gap-1">
        <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: 'var(--button-primary-bg)' }} />
                <span className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: 'var(--button-primary-bg)' }} />
                <span className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'var(--button-primary-bg)' }} />
            </div>
      </div>
    );
  };
  
  export default Loader;
  