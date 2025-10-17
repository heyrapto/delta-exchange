export const Button = ({ children, variant = "primary" }: { children: React.ReactNode, variant?: "primary" | "secondary" }) => {
    const variantClasses = {    
        primary: "bg-orange-500 text-white",
        secondary: "bg-gray-500 text-white",
    };

    const baseClasses = "px-4 py-2 rounded-none cursor-pointer h-full min-w-[130px]";
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};