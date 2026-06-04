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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-lexend min-h-screen flex items-center justify-center antialiased relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="w-full max-w-[1200px] px-6 flex justify-center py-20 relative z-10">
        <div className="w-full max-w-[540px] bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-12 shadow-[0_32px_64px_-16px_rgba(45,106,106,0.08)] border border-white">
          <div className="mb-12 text-center">
            <div className="text-primary/60 mb-6 inline-flex items-center justify-center p-3 bg-primary/5 rounded-full">
              <span className="material-symbols-outlined text-[32px]">spa</span>
            </div>
            <h1 className="font-manrope text-4xl text-on-surface mb-1 font-bold tracking-tight">Selamat Datang Kembali</h1>
            <p className="font-lexend text-on-surface-variant">Masuk untuk melanjutkan perjalanan tenangAnda</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-lexend text-center">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              id="email"
              placeholder="nama@email.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1">
              <Input
                label="Kata Sandi"
                id="password"
                placeholder="Masukkan kata sandi Anda"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end px-1">
                <a href="#" className="text-xs text-primary hover:underline underline-offset-4 transition-all">Lupa Kata Sandi?</a>
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </Button>

          </form>

          <div className="mt-12 text-center pt-6 border-t border-outline-variant/40">
            <p className="font-lexend text-on-surface-variant">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-lexend text-primary hover:text-surface-tint font-medium underline-offset-4 hover:underline transition-colors duration-300 ml-1"
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
