const features = [
  {
    icon: 'edit_note',
    title: 'Check-in Harian',
    description:
      'Ruang aman untuk mencatat emosi Anda melalui antarmuka visual yang organik dan menenangkan, mengurangi beban kognitif saat bercerita.',
  },
  {
    icon: 'insights',
    title: 'Prediksi & Insight AI',
    description:
      'Algoritma cerdas kami mempelajari pola Anda dari waktu ke waktu untuk memberikan peringatan dini dan saran proaktif yang disesuaikan.',
  },
  {
    icon: 'diversity_1',
    title: 'Mode Grup',
    description:
      'Terhubung dengan komunitas yang suportif atau buat lingkaran kecil dengan teman terpercaya untuk berbagi dukungan secara anonim dan aman.',
  },
];

const FeaturesSection = () => {
  return (
    <section
      className="px-4 sm:px-8 py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: '#f4f3f1' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-[32px] mb-3"
            style={{
              fontFamily: '"Manrope", sans-serif',
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              fontWeight: '600',
              color: '#1a1c1a',
            }}
          >
            Pendekatan Holistik untuk Kesejahteraan
          </h2>
          <p
            className="mx-auto text-sm sm:text-base"
            style={{
              fontFamily: '"Lexend", sans-serif',
              lineHeight: '1.6',
              color: '#3f4848',
              maxWidth: '600px',
            }}
          >
            Kami merancang fitur-fitur yang tidak hanya mencatat, tetapi juga memahami dan mendukung
            perjalanan mental Anda setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl transition-shadow duration-300 cursor-default"
              style={{
                backgroundColor: '#faf9f6',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(45,106,106,0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(45,106,106,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(45,106,106,0.03)';
              }}
            >
              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '9999px',
                  backgroundColor: '#e3e2e0',
                  color: '#2d6a6a',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: '"FILL" 1', fontSize: '24px' }}
                >
                  {feature.icon}
                </span>
              </div>

              <h3
                className="text-lg sm:text-xl lg:text-2xl mb-2"
                style={{
                  fontFamily: '"Manrope", sans-serif',
                  lineHeight: '1.4',
                  fontWeight: '600',
                  color: '#1a1c1a',
                }}
              >
                {feature.title}
              </h3>

              <p
                className="text-sm sm:text-base"
                style={{
                  fontFamily: '"Lexend", sans-serif',
                  lineHeight: '1.6',
                  color: '#3f4848',
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
