import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden px-4 sm:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12 lg:pb-16">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12" style={{ maxWidth: '1200px' }}>

        <div className="flex flex-col gap-5 sm:gap-6 z-10">
          <h1
            className="text-3xl sm:text-4xl lg:text-[40px] font-manrope"
            style={{
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              fontWeight: '700',
              color: '#1a1c1a',
            }}
          >
            Pantau Kesehatan Mental Anda Secara Proaktif dengan AI
          </h1>

          <p
            className="text-base sm:text-lg font-lexend"
            style={{
              lineHeight: '1.6',
              color: '#3f4848',
              maxWidth: '576px',
            }}
          >
            MindBalance mendeteksi pola stres dan emosi secara dini, memberikan dukungan personal
            agar Anda tetap tenang dan produktif setiap hari.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:-translate-y-0.5 w-full sm:w-auto justify-center font-lexend"
              style={{
                backgroundColor: '#2d6a6a',
                color: '#abe8e7',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 14px 0 rgba(45,106,106,0.39)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,106,106,0.23)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(45,106,106,0.39)'; }}
            >
              {user ? 'Buka Dashboard' : 'Mulai Perjalanan Anda'}
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                arrow_forward
              </span>
            </Link>

            <button
              className="border px-5 sm:px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 w-full sm:w-auto font-lexend"
              style={{
                borderColor: '#707978',
                color: '#1a1c1a',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.02em',
              }}
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        <div
          className="relative w-full z-10 grid grid-cols-2 grid-rows-2 hidden lg:grid"
          style={{ gap: '16px', height: '480px' }}
        >
          <div
            className="col-span-1 row-span-2 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(45,106,106,0.08)' }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkvHtbNBRjYtSsZ6r9n-Gl4uR0th7eGGpBP40_2WJrXZCkzboLOYW0-7bOY7rCtz9ITJdtGZnApr_Xkx-2qIuf14jb9zXo7RcauPLo5ie2EcHdwAKotCe6D_Io6Moh0k2ZDTofRDq3-CTeNPvcjHMEUPxyBtvtt1ZJKAka5T6iszOw3FIoW3Ifw2s_YL1yvxao2DkbvjWiE79xo8_OD9_t1PuywzO_t2lpud-kTGOS4QbHdUcH1umgaKGHmZWQ2GvtAELC_-Y5hxlc"
              alt="Person meditating"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="col-span-1 row-span-1 rounded-xl overflow-hidden flex flex-col justify-center"
            style={{
              backgroundColor: '#efeeeb',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(45,106,106,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(45,106,106,0.15)', color: '#2D6A6A' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  favorite
                </span>
              </div>
              <span
                style={{
                  fontFamily: '"Lexend", sans-serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#3f4848',
                }}
              >
                Skor Ketenangan
              </span>
            </div>
            <span
              style={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: '28px',
                fontWeight: '600',
                color: '#1a1c1a',
              }}
            >
              85%
            </span>
            <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: '#e3e2e0' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '85%', backgroundColor: '#49654b' }}
              />
            </div>
          </div>

          <div
            className="col-span-1 row-span-1 rounded-xl overflow-hidden relative"
            style={{ boxShadow: '0 20px 40px rgba(45,106,106,0.08)' }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY_cWF30qhWjatQxllK5JoQYiwrCXmMhQXhl9jyAhYK4dw3jIRX5GPUAtbOlig9RM5d1f617cuqOB0_kMlN2JbhQLLkhA4kIsf7nzXZc5Libz5rLjQdmXNo6wCxNeTJ8TVCMFpZhzp7YFtSP1iLSSTtY365SfRx8IZQxEnoEJPx0OUX7FViRh1t6skXrHAs9DyjSjfTOpsZwNkZJgHDP7zV-TxEohOzHzv_xgxlx829Q7LanjVYcoSWDcXSzoVlo_J9jDTZ23raPOv"
              alt="Nature scene"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
            />
          </div>
        </div>

        <div
          className="relative w-full rounded-xl overflow-hidden lg:hidden"
          style={{ height: '260px', boxShadow: '0 20px 40px rgba(45,106,106,0.08)' }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkvHtbNBRjYtSsZ6r9n-Gl4uR0th7eGGpBP40_2WJrXZCkzboLOYW0-7bOY7rCtz9ITJdtGZnApr_Xkx-2qIuf14jb9zXo7RcauPLo5ie2EcHdwAKotCe6D_Io6Moh0k2ZDTofRDq3-CTeNPvcjHMEUPxyBtvtt1ZJKAka5T6iszOw3FIoW3Ifw2s_YL1yvxao2DkbvjWiE79xo8_OD9_t1PuywzO_t2lpud-kTGOS4QbHdUcH1umgaKGHmZWQ2GvtAELC_-Y5hxlc"
            alt="Person meditating"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      <div
        className="absolute top-0 right-0 -z-10 rounded-full blur-3xl"
        style={{
          width: '600px',
          height: '600px',
          backgroundColor: 'rgba(45,106,106,0.05)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 -z-10 rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          backgroundColor: 'rgba(73,101,75,0.05)',
          transform: 'translate(-30%, 30%)',
        }}
      />
    </section>
  );
};

export default HeroSection;
