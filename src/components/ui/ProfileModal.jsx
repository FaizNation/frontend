import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Input from './Input';
import authService from '../../services/authService';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  // Base URL for backend if avatar is a relative path
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const [name, setName] = useState(user?.name || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`) : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file terlalu besar (maksimal 2MB)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let updatedUser = user;

      // 1. Update Name if changed
      if (name.trim() !== user.name) {
        updatedUser = await authService.updateProfile({ name: name.trim() });
      }

      // 2. Upload Avatar if selected
      if (selectedFile) {
        updatedUser = await authService.uploadAvatar(selectedFile);
      }

      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden font-lexend animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-[#f5f7f5]">
          <div>
            <h2 className="text-xl font-bold text-primary font-manrope">Edit Profil</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center font-medium animate-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 mb-2">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full border-4 border-primary/10 p-1 bg-white shadow-sm overflow-hidden">
                <img 
                  src={previewUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                  alt="Preview" 
                  className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                  }}
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-bold">Klik untuk ganti foto</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Lengkap"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Masukkan nama lengkap"
              error={error && error.toLowerCase().includes('nama') ? error : ''}
              required
            />
          </div>

          {error && !error.toLowerCase().includes('nama') && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center font-medium animate-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 !py-3.5 text-xs font-bold uppercase tracking-wider" 
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1 !py-3.5 text-xs font-bold uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.111 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : 'Simpan Profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
