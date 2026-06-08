import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HelpCenter = () => {
  const faqs = [
    {
      q: "Bagaimana cara melakukan check-in harian?",
      a: "Anda dapat melakukan check-in harian dengan mengklik tombol 'Check-in Sekarang' di halaman Beranda/Dashboard. Jawab beberapa pertanyaan singkat mengenai perasaan Anda hari ini."
    },
    {
      q: "Apakah data saya aman?",
      a: "Ya, kami menggunakan enkripsi standar untuk melindungi data Anda. Data pribadi dan catatan emosional Anda tidak akan pernah dibagikan kepada pihak ketiga tanpa izin Anda."
    },
    {
      q: "Bagaimana cara bergabung dengan grup komunitas?",
      a: "Pergi ke halaman 'Grup', lalu pilih tab 'Temukan Grup'. Anda bisa mencari grup berdasarkan kategori atau memasukkan kode undangan grup privat."
    },
    {
      q: "Apakah MindBot bisa menggantikan psikolog?",
      a: "Tidak. MindBot dirancang sebagai alat pendukung untuk memberikan saran ringan dan pelacakan suasana hati. MindBot bukan pengganti diagnosis atau perawatan dari tenaga medis profesional."
    }
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-family-lexend md:text-5xl font-black text-primary mb-6 tracking-tight">Pusat Bantuan</h1>
          <p className="text-lg font-family-manrope text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban atas pertanyaan umum seputar fitur dan penggunaan MindBalance.
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold font-family-manrope text-gray-800 mb-3 flex items-start gap-3">
                <span className="text-primary font-family-lexend mt-0.5">Q.</span>
                {faq.q}
              </h3>
              <div className="text-on-surface-variant font-family-manrope leading-relaxed text-sm flex items-start gap-3">
                <span className="text-gray-400 font-family-lexend font-bold mt-0.5">A.</span>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-3xl p-8 text-center border border-primary/10">
          <h3 className="text-xl font-bold text-primary mb-2">Masih butuh bantuan?</h3>
          <p className="text-sm text-gray-600 mb-6">Tim dukungan kami siap membantu Anda.</p>
          <a href="mailto:support@mindbalance.com" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#0a3a3a] transition-colors">
            Hubungi Tim Support
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;