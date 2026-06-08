import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    const fieldName = name || id;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [fieldName]: '',
    });
    setGeneralError('');
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Nama lengkap wajib diisi';
    if (!formData.email) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email tidak valid';
    }
    if (!formData.password) {
      errors.password = 'Kata sandi wajib diisi';
    } else if (formData.password.length < 8) {
      errors.password = 'Minimal 8 karakter';
    }
    return errors;
  };

  const nextStep = (e) => {
    e.preventDefault();
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setStep(2);
    setFieldErrors({});
    setGeneralError('');
  };

  const prevStep = () => {
    setStep(1);
    setFieldErrors({});
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.age) {
      setFieldErrors({ age: 'Harap masukkan umur Anda.' });
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age, 10)
      };
      await register(dataToSubmit);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('email')) {
        setFieldErrors({ email: 'Email sudah terdaftar.' });
        setStep(1);
      } else {
        setGeneralError(msg || 'Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col items-center justify-start pt-16 px-4 font-lexend antialiased">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-family-lexend font-black text-[#2D6A6A] mb-2">Mulai Perjalanan Anda</h1>
        <p className="text-on-surface-variant/70 text-sm font-family-manrope font-medium">Bergabung dengan komunitas kami untuk mendapatkan akses penuh</p>
      </header>

      {/* Progress Tracker */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <div className={`text-[10px] font-family-lexend font-black uppercase tracking-widest ${step >= 1 ? 'text-[#2D6A6A]' : 'text-outline/40'}`}>
            Buat Akun
          </div>
          <div className={`text-[10px] font-family-lexend font-black uppercase tracking-widest ${step >= 2 ? 'text-[#2D6A6A]' : 'text-outline/40'}`}>
            Tentang Kamu
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-1 h-2 bg-[#2D6A6A] rounded-full shadow-sm"></div>
          <div className={`flex-1 h-2 rounded-full transition-all duration-500 shadow-sm ${step >= 2 ? 'bg-[#2D6A6A]' : 'bg-outline-variant/30'}`}></div>
        </div>
      </div>

      {/* Form Container */}
      <main className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(45,106,106,0.06)] border border-white/50 mb-10">
        <h2 className="text-xl font-family-lexend font-black text-[#2D6A6A] mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">{step}</span>
          {step === 1 ? 'Buat Akun' : 'Tentang Kamu'}
        </h2>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-fade-in">
            {generalError}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Account Creation */
          <form onSubmit={nextStep} className="space-y-6 font-family-manrope" noValidate>
            <Input 
              label="Nama Lengkap" 
              id="name" 
              name="name" 
              placeholder="Masukkan nama lengkap Anda" 
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
            />
            <Input 
              label="Email" 
              id="email" 
              name="email" 
              placeholder="nama@email.com" 
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />
            <Input 
              label="Kata Sandi" 
              id="password" 
              name="password" 
              placeholder="Minimal 8 karakter" 
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />

            <div className="flex items-center space-x-2 py-2 px-1">
              <span className="text-tertiary-container material-symbols-outlined text-outline/40 text-lg">verified_user</span>
              <span className="text-[11px] text-tertiary-container font-bold">Privasi dan keamanan Anda adalah prioritas utama kami.</span>
            </div>

            <div className="border-t border-gray-50 pt-8 mt-4 flex justify-end items-center gap-4">
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="px-8 py-3 text-outline font-black text-xs uppercase tracking-widest hover:text-primary transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-10 py-3.5 bg-[#2D6A6A] text-white font-black text-xs rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-primary/10 uppercase tracking-widest"
              >
                Selanjutnya 
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Personal Details */
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div>
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4 ml-1">Jenis Kelamin</label>
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
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-transparent bg-surface-container-low rounded-2xl transition-all peer-checked:border-primary/20 peer-checked:bg-white peer-checked:shadow-md">
                    <svg className="w-10 h-10 text-on-surface-variant mb-2 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="10" cy="14" r="5"></circle><path d="M14 10l7-7m0 0h-6m6 0v6"></path></svg>
                    <span className="text-xs font-family-lexend font-black text-on-surface uppercase">Laki-laki</span>
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
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-transparent bg-surface-container-low rounded-2xl transition-all peer-checked:border-primary/20 peer-checked:bg-white peer-checked:shadow-md">
                    <svg className="w-10 h-10 text-on-surface-variant mb-2 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"></circle><path d="M12 14v7m-3-3h6"></path></svg>
                    <span className="text-xs font-family-lexend font-black text-on-surface uppercase">Perempuan</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input 
                  label="Umur"
                  id="age" 
                  name="age" 
                  placeholder="Misal: 25" 
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  error={fieldErrors.age}
                />
                {!fieldErrors.age && (
                  <span className="absolute right-4 top-[44px] text-xs text-outline-variant font-black uppercase tracking-widest pointer-events-none">Tahun</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2 px-1">
              <span className="text-tertiary-container material-symbols-outlined text-outline/40 text-lg">verified_user</span>
              <span className="text-[11px] text-tertiary-container font-bold">Privasi dan keamanan Anda adalah prioritas utama kami.</span>
            </div>

            <div className="border-t border-gray-50 pt-8 mt-4 flex justify-end items-center gap-4">
              <button 
                type="button"
                onClick={prevStep}
                className="px-8 py-3 font-family-lexend text-outline font-black text-xs uppercase tracking-widest hover:text-primary transition-colors"
              >
                Kembali
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-10 py-3.5 bg-[#2D6A6A] font-family-lexend text-white font-black text-xs rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-primary/10 uppercase tracking-widest disabled:opacity-70"
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
                    <span className="material-symbols-outlined text-sm font-bold">done</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-10 text-center text-sm border-t border-gray-50 pt-8">
          <span className="text-on-surface-variant font-family-lexend font-medium">Sudah punya akun?</span>
          <Link to="/login" className="text-[#2D6A6A] font-family-lexend font-black hover:underline ml-2 transition-all">Masuk di sini</Link>
        </div>
      </main>
    </div>
  );
};

export default Register;
