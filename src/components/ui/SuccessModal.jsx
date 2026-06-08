import { useEffect } from 'react';

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message 
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-300">
      <div className="bg-[#0c5252] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
        <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-family-manrope">
          <span className="material-symbols-outlined text-sm font-bold">check</span>
        </div>
        <div>
          <p className="text-sm font-family-lexend font-black tracking-tight">{title}</p>
          <p className="text-[10px] font-family-manrope font-medium opacity-80">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
