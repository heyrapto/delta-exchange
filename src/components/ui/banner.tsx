import { useState } from "react";
import { BiCheckCircle, BiLink } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; 

  return (
    <div className="flex justify-between p-3" style={{ 
      background: 'linear-gradient(to right, var(--header-bg-gradient-start), var(--header-bg-gradient-end))',
      color: 'var(--text-primary)'
    }}>
      <div className="flex items-center gap-2">
        <BiCheckCircle />
        <p className="text-sm">
          Pay zero closing fee on the closing leg when you exit futures trades in the Scalper Offer. Join now
        </p>
        <BiLink />
      </div>

      <CgClose
        className="cursor-pointer"
        onClick={() => setIsVisible(false)} 
      />
    </div>
  );
};
