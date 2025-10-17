import { BiSignal1 } from "react-icons/bi";
import { CgArrowTopRight } from "react-icons/cg";
import { IoGitNetworkSharp } from "react-icons/io5";

export const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-gray-700 px-4 py-2 text-sm text-gray-300">
      <div className="flex items-center gap-2">
        <IoGitNetworkSharp className="text-green-500" />
        <span>Connected</span>
      </div>
      <CgArrowTopRight className="text-gray-400" />
    </footer>
  );
};
