export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  onclick?: () => void;
}

export const Button = ({ children, variant = "primary", className, onClick }: ButtonProps) => {
    const baseClasses = "px-2 sm:px-4 h-[36px] sm:h-[42px] rounded-none cursor-pointer min-w-[80px] sm:min-w-[130px] text-xs sm:text-sm";
    
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
    <button
     className={`${baseClasses} ${className}`} 
     style={getButtonStyle()} 
     onClick={onClick}
     >
      {children}
    </button>
  );
};