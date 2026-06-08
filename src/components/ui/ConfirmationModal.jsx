import { useEffect } from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
          <span className="material-symbols-outlined text-3xl">
            {variant === 'danger' ? 'warning' : 'info'}
          </span>
        </div>
        
        <h3 className="font-family-lexend text-xl font-black text-[#1a1c1a] mb-2">{title}</h3>
        <p className="text-sm text-gray-500 font-medium font-family-manrope leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-family-lexend text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
              variant === 'danger' 
                ? 'bg-red-500 text-white shadow-red-200 hover:bg-red-600' 
                : 'bg-primary text-white shadow-primary/20 hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 font-family-manrope rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
