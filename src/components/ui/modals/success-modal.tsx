import { GiCheckMark } from "react-icons/gi";
import { Button } from "../reusable/button";
import Modal from "./layout";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
}

const SuccessModal = ({ isOpen, onClose, txHash }: SuccessModalProps) => {
  if (!isOpen) return null;

  const viewOnArbiscan = `https://arbiscan.io/tx/${txHash}`;

  return (
    <Modal>
      <div className="flex items-center flex-col gap-4 bg-white rounded-lg p-6 shadow-md border border-[#ADFF2F]">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-[5rem] h-[5rem] rounded-full" style={{ backgroundColor: '#ADFF2F33' }}></div>
          <div className="absolute w-[4rem] h-[4rem] rounded-full" style={{ backgroundColor: '#ADFF2F66' }}></div>
          <div className="absolute w-[3rem] h-[3rem] rounded-full" style={{ backgroundColor: '#ADFF2F99' }}></div>
          <div className="relative w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center" style={{ backgroundColor: '#ADFF2F' }}>
            <GiCheckMark className="text-black text-[1.5rem]" />
          </div>
        </div>
        <p className="text-[1.2rem] text-black mt-2 font-semibold text-center">
          Your transaction was confirmed successfully
        </p>
        <div className="flex items-center gap-3 font-bold">
          <a href={viewOnArbiscan} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">View on Arbiscan</Button>
          </a>
          <Button onClick={onClose}>Close and Continue</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
