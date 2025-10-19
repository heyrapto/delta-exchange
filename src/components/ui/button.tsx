export const Button = ({ children, variant = "primary", className }: { children: React.ReactNode, variant?: "primary" | "secondary", className?: string }) => {
    const baseClasses = "px-4 h-[42px] rounded-none cursor-pointer min-w-[130px]";
    
    const getButtonStyle = () => {
        switch (variant) {
            case "primary":
                return {
                    backgroundColor: 'var(--button-primary-bg)',
                    color: 'var(--button-primary-text)'
                };
            case "secondary":
                return {
                    backgroundColor: 'var(--button-secondary-bg)',
                    color: 'var(--button-secondary-text)',
                    border: '1px solid var(--button-secondary-border)'
                };
            default:
                return {
                    backgroundColor: 'var(--button-primary-bg)',
                    color: 'var(--button-primary-text)'
                };
        }
    };

  return (
    <button className={`${baseClasses} ${className}`} style={getButtonStyle()}>
      {children}
    </button>
  );
};