import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-family-lexend font-black text-primary mb-6 tracking-tight">Kebijakan Privasi</h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20 space-y-8">
          <p className="text-sm text-gray-500 italic">Terakhir diperbarui: 5 Juni 2026</p>

          <section>
            <h2 className="text-xl font-family-lexend font-bold text-primary mb-3">1. Pengumpulan Data</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed text-sm">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar, melakukan check-in harian, dan berpartisipasi dalam grup komunitas. Ini termasuk nama, alamat email, usia, jenis kelamin, serta metrik kesejahteraan harian Anda (seperti kualitas tidur dan suasana hati).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-family-lexend font-bold text-primary mb-3">2. Penggunaan Informasi</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed text-sm">
              Data yang dikumpulkan digunakan semata-mata untuk:
            </p>
            <ul className="list-disc list-inside mt-2 font-family-manrope text-sm text-on-surface-variant space-y-1.5 ml-4">
              <li>Memberikan rekomendasi yang dipersonalisasi melalui fitur AI kami.</li>
              <li>Meningkatkan pengalaman pengguna secara keseluruhan.</li>
              <li>Memfasilitasi interaksi yang aman di dalam grup komunitas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-family-lexend font-bold text-primary mb-3">3. Keamanan Data</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed text-sm">
              Kerahasiaan dan keamanan data kesehatan mental Anda adalah prioritas absolut kami. Kami menggunakan teknologi enkripsi standar industri untuk melindungi informasi Anda dari akses yang tidak sah. Kami <strong>tidak pernah</strong> menjual data pribadi Anda kepada pihak ketiga.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-family-lexend font-bold text-primary mb-3">4. Transparansi AI</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed text-sm">
              Fitur AI (MindBot) memproses input teks Anda untuk memberikan respon yang relevan. Percakapan ini diproses secara anonim dan tidak digunakan untuk melatih model AI publik tanpa persetujuan eksplisit Anda.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;