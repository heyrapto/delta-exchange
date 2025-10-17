export const Button = ({ children, variant = "primary", className }: { children: React.ReactNode, variant?: "primary" | "secondary", className?: string }) => {
    const variantClasses = {    
        primary: "bg-orange-500 text-white",
        secondary: "bg-gray-500 text-white",
    };

    const baseClasses = "px-4 h-[42px] rounded-none cursor-pointer  min-w-[130px]";
  return (
    <button className={`${baseClasses} ${className} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};