import { BiSignal1 } from "react-icons/bi";
import { CgArrowTopRight } from "react-icons/cg";
import { IoGitNetworkSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { FaSignal } from "react-icons/fa";

export const Footer = () => {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected");
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

  const statusColor = connectionStatus === "connected"
    ? "text-green-500"
    : connectionStatus === "connecting"
    ? "text-yellow-400"
    : "text-red-500";

  return (
    <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-gray-700 px-4 py-2 text-sm text-gray-300">
      <div className="flex items-center gap-2">
      <FaSignal className={statusColor} />
        <span className="capitalize">{connectionStatus}</span>
        {connectionStatus === "connected" && lastUpdated && (
          <span className="text-gray-400">• Last updated {timeSinceUpdate}</span>
        )}
      </div>
      <CgArrowTopRight className="text-gray-400" />
    </footer>
  );
};
