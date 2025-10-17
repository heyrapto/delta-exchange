import { BiSignal1 } from "react-icons/bi"
import { CgArrowTopRight } from "react-icons/cg"

export const Footer = () => {
    return (
        <footer className="inline-flex items-center fixed bottom-0 left-0 w-full border-t border-gray-700">
            <BiSignal1 />
            <span>Connected</span>
            <CgArrowTopRight />
        </footer>
    )
}