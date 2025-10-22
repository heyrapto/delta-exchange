import { useState, useEffect } from "react";
import { CgArrowTopRight } from "react-icons/cg";
import { FaSignal } from "react-icons/fa";

interface FooterProps {
  variant?: "mobile" | "desktop" | "both";
  position?: "fixed" | "absolute" | "relative" | "static";
  className?: string;
}

export const Footer = ({
  variant = "desktop",
  position = "fixed",
  className = "",
}: FooterProps) => {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connected");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("just now");

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const diffMs = new Date().getTime() - lastUpdated.getTime();
        const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
        const diffMinutes = Math.floor((diffMs / 1000 / 60) % 60);
        setTimeSinceUpdate(`${diffHours}h ${diffMinutes}min ago`);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.05) setConnectionStatus("disconnected");
      else if (rand < 0.1) setConnectionStatus("connecting");
      else setConnectionStatus("connected");

      if (connectionStatus === "connected") setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const statusColor =
    connectionStatus === "connected"
      ? "text-green-500"
      : connectionStatus === "connecting"
      ? "text-yellow-400"
      : "text-red-500";

  const visibilityClasses =
    variant === "mobile"
      ? "flex md:hidden"
      : variant === "desktop"
      ? "hidden md:flex"
      : "flex"; // both

  const baseClasses = `${position} bottom-0 left-0 right-0 mx-auto w-full xl:max-w-[120rem] items-center justify-between border-t border-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-900`;

  return (
    <footer className={`${baseClasses} ${visibilityClasses} ${className}`}>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <FaSignal className={`${statusColor} w-3 h-3 sm:w-4 sm:h-4`} />
        <span className="capitalize text-[10px] sm:text-xs">{connectionStatus}</span>
        {connectionStatus === "connected" && lastUpdated && (
          <span className="text-gray-900 text-[9px] sm:text-xs hidden sm:inline">
            • Last updated {timeSinceUpdate}
          </span>
        )}
      </div>
      <CgArrowTopRight className="text-black w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
    </footer>
  );
};
