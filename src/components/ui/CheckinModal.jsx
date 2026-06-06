import { useState, useEffect } from 'react';
import checkinService from '../../services/checkinService';

const CheckinModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    skor_kebahagiaan: 5,
    waktu_tidur: 7,
    screen_time: 4,
    tingkat_olahraga: 'Kadang-kadang',
    interaksi_sosial: 8,
    waktu_kerja: 8,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Lock scroll when modal is open
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await checkinService.submitCheckin(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan check-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const exerciseOptions = ['Tidak Ada', 'Kadang-kadang', 'Rutin'];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden font-lexend animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start sticky top-0 bg-white z-10">
          <div className="text-center w-full">
            <h1 className="font-manrope text-2xl sm:text-[32px] text-primary mb-2 font-bold">Bagaimana harimu hari ini?</h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-md mx-auto">Refleksi singkat untuk keseimbangan mental Anda.</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-surface-container transition-colors text-outline"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Happiness Score */}
          <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
              <h3 className="font-manrope font-semibold text-on-surface text-lg">Skor Kebahagiaan</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-outline text-primary">
                <span>Kurang baik</span>
                <span className="text-primary font-bold text-xl">{formData.skor_kebahagiaan}</span>
                <span>Luar biasa</span>
              </div>
              <input 
                className="w-full h-2 bg-secondary-fixed-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                max="10" 
                min="1" 
                step="1" 
                type="range" 
                value={formData.skor_kebahagiaan}
                onChange={(e) => setFormData({ ...formData, skor_kebahagiaan: parseInt(e.target.value) })}
              />
              <p className="text-xs text-on-surface-variant italic">Seberapa puas Anda dengan perasaan Anda secara keseluruhan hari ini?</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sleep */}
            <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">bedtime</span>
                <span className="font-semibold text-on-surface">Waktu Tidur</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{formData.waktu_tidur}</span>
                <span className="text-on-surface-variant text-sm pb-1">jam</span>
              </div>
              <input 
                className="w-full h-2 bg-secondary-fixed-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                max="12" 
                min="0" 
                step="0.5" 
                type="range" 
                value={formData.waktu_tidur}
                onChange={(e) => setFormData({ ...formData, waktu_tidur: parseFloat(e.target.value) })}
              />
            </div>

            {/* Screen Time */}
            <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">smartphone</span>
                <span className="font-semibold text-on-surface">Screen Time</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{formData.screen_time}</span>
                <span className="text-on-surface-variant text-sm pb-1">jam</span>
              </div>
              <input 
                className="w-full h-2 bg-secondary-fixed-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                max="12" 
                min="0" 
                step="0.5" 
                type="range" 
                value={formData.screen_time}
                onChange={(e) => setFormData({ ...formData, screen_time: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {/* Exercise */}
          <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">fitness_center</span>
              <h3 className="font-semibold text-on-surface">Tingkat Olahraga</h3>
            </div>
            <div className="flex p-1 bg-surface-container rounded-full border border-outline-variant/20">
              {exerciseOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, tingkat_olahraga: option })}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                    formData.tingkat_olahraga === option
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Social & Work Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">groups</span>
                <span className="font-semibold text-on-surface">Interaksi Sosial</span>
              </div>
              <div className="flex justify-between text-primary text-xs text-outline mb-2">
                <span>Minimal</span>
                <span className="text-primary font-bold text-base">{formData.interaksi_sosial}</span>
                <span>Sangat Aktif</span>
              </div>
              <input 
                className="w-full h-2 bg-secondary-fixed-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                max="10" 
                min="1" 
                step="1" 
                type="range" 
                value={formData.interaksi_sosial}
                onChange={(e) => setFormData({ ...formData, interaksi_sosial: parseInt(e.target.value) })}
              />
            </div>
            <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">work</span>
                <span className="font-semibold text-on-surface">Waktu Kerja</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{formData.waktu_kerja}</span>
                <span className="text-on-surface-variant text-sm pb-1">jam</span>
              </div>
              <input 
                className="w-full h-2 bg-secondary-fixed-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                max="16" 
                min="0" 
                step="1" 
                type="range" 
                value={formData.waktu_kerja}
                onChange={(e) => setFormData({ ...formData, waktu_kerja: parseInt(e.target.value) })}
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col items-center gap-3 sticky bottom-0 z-10">
          {/* <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <p>Data Anda aman dan terenkripsi secara pribadi.</p>
          </div> */}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white rounded-full font-manrope font-bold text-lg shadow-lg hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.111 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Menyimpan...' : 'Simpan Refleksi Hari Ini'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckinModal;
