const CTASection = () => {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div
          className="relative overflow-hidden flex flex-col items-start rounded-2xl sm:rounded-[2rem]"
          style={{
            backgroundColor: '#2d6a6a',
            padding: 'clamp(28px, 5vw, 48px)',
            boxShadow: '0 20px 40px rgba(45,106,106,0.15)',
          }}
        >
          <div className="z-10 w-full" style={{ maxWidth: '576px' }}>
            <h2
              className="text-2xl sm:text-3xl lg:text-[32px] mb-3 sm:mb-4"
              style={{
                fontFamily: '"Manrope", sans-serif',
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
                fontWeight: '600',
                color: '#ffffff',
              }}
            >
              Siap untuk Memulai Perjalanan Anda?
            </h2>
            <p
              className="text-base sm:text-lg mb-7 sm:mb-8"
              style={{
                fontFamily: '"Lexend", sans-serif',
                lineHeight: '1.6',
                color: '#abe8e7',
              }}
            >
              Bergabunglah dengan pengguna lain di Indonesia yang telah menemukan ketenangan dan
              dukungan melalui MindBalance.
            </p>
            <button
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 w-full sm:w-auto justify-center"
              style={{
                backgroundColor: '#faf9f6',
                color: '#2d6a6a',
                fontFamily: '"Lexend", sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.02em',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              }}
            >
              Mulai Perjalanan Anda Sekarang
            </button>
          </div>

          <div
            className="absolute right-0 top-0 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              width: '256px',
              height: '256px',
              backgroundColor: '#b1eeed',
              transform: 'translate(33%, -33%)',
            }}
          />
          <div
            className="absolute bottom-0 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{
              width: '192px',
              height: '192px',
              backgroundColor: '#cbebca',
              right: '25%',
              transform: 'translateY(33%)',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
