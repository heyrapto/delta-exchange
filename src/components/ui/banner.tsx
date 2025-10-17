import { BiCheckCircle, BiLink } from "react-icons/bi"
import { CgClose } from "react-icons/cg"

export const Banner = () => {
    return (
        <div className="flex justify-between bg-gradient-to-r from-violet-500 from-5% to-violet-500 p-3">
            <div className="flex items-center gap-2">
                <BiCheckCircle />
                <p className="text-sm">Pay zero closing fee on the closing leg when you exit futures trades in the Scalper Offer. Join now</p>
                <BiLink />
            </div>

            <CgClose />
        </div>
    )
}