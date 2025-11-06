import Modal from "./layout";

const ConfirmModal = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex items-center flex-col gap-4 bg-white rounded-lg p-6 shadow-md border border-[#ADFF2F]">
        <span className="relative inline-block w-[48px] h-[48px] border-[5px] border-[#ADFF2F] rounded-full box-border animate-pulse before:content-[''] before:absolute before:w-[48px] before:h-[48px] before:border-[5px] before:border-[#ADFF2F] before:rounded-full before:inline-block before:box-border before:left-1/2 before:top-1/2 before:animate-scaleUp"></span>
        <div className="text-center text-[1.1rem] text-black w-full md:w-[25rem]">
          <p className="font-semibold">Confirm this transaction in your wallet</p>
          <p className="font-light">Then wait a moment for the transaction hash.</p>
          <p className="font-light">To cancel, decline the prompt in your wallet app.</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
