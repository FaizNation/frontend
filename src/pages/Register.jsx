import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'MALE',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    setFormData({
      ...formData,
      [name || id]: value,
    });
    setError('');
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Harap isi semua bidang di atas.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }
    setStep(2);
    setError('');
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.age) {
      setError('Harap masukkan umur Anda.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age, 10)
      };
      await register(dataToSubmit);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-start pt-16 px-4 font-lexend antialiased">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#2D6A6A] mb-2 font-manrope">Mulai Perjalanan Anda</h1>
        <p className="text-gray-500 text-sm">Bergabung dengan komunitas kami untuk untuk mendapatkan akses penuh</p>
      </header>

      {/* Progress Tracker */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className={`text-[10px] font-bold w-1/2 text-center uppercase tracking-tight ${step >= 1 ? 'text-[#2D6A6A]' : 'text-gray-400'}`}>
            Buat Akun
          </div>
          <div className={`text-[10px] font-bold w-1/2 text-center uppercase tracking-tight ${step >= 2 ? 'text-[#2D6A6A]' : 'text-gray-400'}`}>
            tentang Kamu
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-1 h-1.5 bg-[#2D6A6A] rounded-full"></div>
          <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-[#2D6A6A]' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      {/* Form Container */}
      <main className="w-full max-w-2xl bg-white rounded-2xl p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-10">
        <h2 className="text-xl font-bold text-[#2D6A6A] mb-8 font-manrope">
          Step {step}: {step === 1 ? 'Buat Akun' : 'Tentang Kamu'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100 animate-fade-in">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Account Creation */
          <form onSubmit={nextStep} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600 ml-1" htmlFor="name">Nama Lengkap</label>
              <input 
                className="w-full px-4 py-3 bg-[#F9FAFB] border-none rounded-xl focus:ring-2 focus:ring-[#2D6A6A] placeholder-gray-400 text-gray-700 outline-none transition-all" 
                id="name" 
                name="name" 
                placeholder="Masukkan nama Anda" 
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600 ml-1" htmlFor="email">Email</label>
              <input 
                className="w-full px-4 py-3 bg-[#F9FAFB] border-none rounded-xl focus:ring-2 focus:ring-[#2D6A6A] placeholder-gray-400 text-gray-700 outline-none transition-all" 
                id="email" 
                name="email" 
                placeholder="nama@email.com" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600 ml-1" htmlFor="password">Kata Sandi</label>
              <input 
                className="w-full px-4 py-3 bg-[#F9FAFB] border-none rounded-xl focus:ring-2 focus:ring-[#2D6A6A] placeholder-gray-400 text-gray-700 outline-none transition-all" 
                id="password" 
                name="password" 
                placeholder="Minimal 8 karakter" 
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <span className="material-symbols-outlined text-gray-400 text-lg">verified_user</span>
              <span className="text-[11px] text-gray-400 font-medium">Privasi dan keamanan Anda adalah prioritas utama kami.</span>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4 flex justify-end items-center gap-4">
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="px-8 py-2.5 border border-gray-300 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-8 py-2.5 bg-[#2D6A6A] text-white font-bold text-sm rounded-lg hover:bg-[#1f4a4a] transition-colors flex items-center gap-2"
              >
                Next 
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Personal Details */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="MALE" 
                    className="peer sr-only"
                    checked={formData.gender === 'MALE'}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-transparent bg-gray-50 rounded-xl transition-all peer-checked:border-[#2D6A6A]/20 peer-checked:bg-white peer-checked:shadow-sm">
                    <svg className="w-8 h-8 text-gray-700 mb-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="10" cy="14" r="5"></circle><path d="M14 10l7-7m0 0h-6m6 0v6"></path></svg>
                    <span className="text-sm font-bold text-gray-700">Laki-laki</span>
                  </div>
                </label>
                <label className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="FEMALE" 
                    className="peer sr-only"
                    checked={formData.gender === 'FEMALE'}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-transparent bg-gray-50 rounded-xl transition-all peer-checked:border-[#2D6A6A]/20 peer-checked:bg-white peer-checked:shadow-sm">
                    <svg className="w-8 h-8 text-gray-700 mb-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"></circle><path d="M12 14v7m-3-3h6"></path></svg>
                    <span className="text-sm font-bold text-gray-700">Perempuan</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="age">Umur</label>
              <div className="relative">
                <input 
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#2D6A6A] placeholder-gray-300 text-gray-700 outline-none transition-all" 
                  id="age" 
                  name="age" 
                  placeholder="Misal: 25" 
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-700 font-bold">Tahun</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              <p>Privasi dan keamanan Anda adalah prioritas utama kami.</p>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4 flex justify-end items-center gap-4">
              <button 
                type="button"
                onClick={prevStep}
                className="px-8 py-2.5 border border-gray-300 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 bg-[#2D6A6A] text-white font-bold text-sm rounded-lg hover:bg-[#1f4a4a] transition-colors flex items-center gap-2 shadow-lg shadow-[#2D6A6A]/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.111 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Daftar Sekarang
                    <span className="material-symbols-outlined text-sm font-bold">done_all</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-10 text-center text-sm border-t border-gray-50 pt-8">
          <span className="text-gray-500 font-medium">Sudah punya akun?</span>
          <Link to="/login" className="text-[#2D6A6A] font-bold hover:underline ml-1">Masuk di sini</Link>
        </div>
      </main>
    </div>
  );
};

export default Register;
