import { useState } from "react";
import { BiCheckCircle, BiLink } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { Footer } from "../layout/footer";

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <Footer variant="mobile" position="relative" />
      <div
        className="flex justify-between items-start sm:items-center p-2 sm:p-3 gap-2"
        style={{
          background:
            "linear-gradient(to right, var(--header-bg-gradient-start), var(--header-bg-gradient-end))",
          color: "var(--text-primary)",
        }}
      >
        <div className="flex items-start sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <BiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm leading-tight">
            Pay zero closing fee on the closing leg when you exit futures trades in the Scalper Offer. Join now
          </p>
          <BiLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
        </div>

        <CgClose
          className="cursor-pointer w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0"
          onClick={() => setIsVisible(false)}
        />
      </div>
    </>
  );
};

