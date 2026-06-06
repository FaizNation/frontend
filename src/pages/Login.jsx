import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setFieldErrors({
      ...fieldErrors,
      [e.target.id]: '',
    });
    setGeneralError('');
  };

  const validate = () => {
    const errors = {};
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('email')) {
        setFieldErrors({ email: msg });
      } else if (msg.toLowerCase().includes('sandi') || msg.toLowerCase().includes('password')) {
        setFieldErrors({ password: 'Kata sandi Anda salah.' });
      } else {
        setGeneralError(msg || 'Login gagal. Periksa kembali akun Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-lexend min-h-screen flex items-center justify-center antialiased relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="w-full max-w-[1200px] px-6 flex justify-center py-20 relative z-10">
        <div className="w-full max-w-[540px] bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-[0_32px_64px_-16px_rgba(45,106,106,0.08)] border border-white/50">
          <div className="mb-12 text-center">
            <div className="text-primary/60 mb-6 inline-flex items-center justify-center p-3 bg-primary/5 rounded-full">
              <span className="material-symbols-outlined text-[32px]">spa</span>
            </div>
            <h1 className="font-manrope text-4xl text-on-surface mb-2 font-black tracking-tight">Selamat Datang</h1>
            <p className="font-lexend text-on-surface-variant text-sm">Masuk untuk melanjutkan perjalanan tenang Anda</p>
          </div>

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-fade-in">
              {generalError}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              id="email"
              placeholder="nama@email.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />
            <div className="flex flex-col gap-1">
              <Input
                label="Kata Sandi"
                id="password"
                placeholder="Minimal 8 karakter"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
              />
              {!fieldErrors.password && (
                <div className="flex justify-end px-1 mt-1">
                  <a href="#" className="text-[11px] font-bold text-primary hover:underline underline-offset-4 transition-all">Lupa Kata Sandi?</a>
                </div>
              )}
            </div>

            <Button type="submit" className="mt-4 w-full py-4 rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/10" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </Button>

          </form>

          <div className="mt-12 text-center pt-6 border-t border-outline-variant/40">
            <p className="font-lexend text-on-surface-variant text-sm font-medium">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-lexend text-primary hover:text-surface-tint font-bold underline-offset-4 hover:underline transition-colors duration-300 ml-1"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
