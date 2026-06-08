import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import logoDicoding from '../assets/logo/logo-dicoding.svg';
import logoCodingCamp from '../assets/logo/logo-codingcamp.svg';
import logoDBS from '../assets/logo/logo-dbs-foundation.svg';

const About = () => {
  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in">
        <h1 className="text-4xl font-family-lexend md:text-5xl font-black text-primary mb-6 tracking-tight">Tentang Kami</h1>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20 space-y-8">
          <section>
            <h2 className="text-2xl font-family-lexend font-bold text-primary mb-4">Visi Kami</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed">
              MindBalance lahir dari sebuah keyakinan sederhana: kesehatan mental sama pentingnya dengan kesehatan fisik. Visi kami adalah menciptakan dunia di mana setiap orang memiliki akses ke ruang yang aman, dukungan komunitas yang tulus, dan alat yang dibutuhkan untuk mengelola stres dan kecemasan sehari-hari tanpa stigma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-family-lexend font-bold text-primary mb-4">Misi Kami</h2>
            <p className="text-on-surface-variant font-family-manrope leading-relaxed">
              Kami berkomitmen untuk menyediakan platform digital yang intuitif dan suportif. Melalui perpaduan teknologi AI dan kekuatan komunitas, kami bertujuan untuk:
            </p>
            <ul className="list-disc list-inside mt-4 text-on-surface-variant font-family-manrope space-y-2 ml-4">
              <li>Membantu pengguna melacak dan memahami pola suasana hati mereka.</li>
              <li>Menghubungkan individu dengan grup pendukung yang relevan.</li>
              <li>Menyediakan saran proaktif untuk pencegahan stres.</li>
            </ul>
          </section>

          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
              <h2 className="text-2xl font-family-lexend font-bold text-primary mb-4">Tim Kami</h2>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-lg tracking-widest uppercase">
                Team ID: CC26-PSU281
              </span>
            </div>

            <p className="text-on-surface-variant leading-relaxed mb-6">
              MindBalance dikembangkan dengan dedikasi penuh oleh tim kolaboratif kami. Kami memadukan keahlian dalam rekayasa perangkat lunak, kecerdasan buatan, dan sains data untuk menciptakan solusi yang berdampak nyata.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Fadly Fais Fajarruddin", role: "Full Stack Developer" },
                { name: "Rengga Rendi Saputra", role: "Full Stack Developer" },
                { name: "Dwi Amanda Yona", role: "AI Engineer" },
                { name: "Saira Nashwa Ramadhani", role: "Data Scientist" },
                { name: "Shellomitha Sulvana Dewi", role: "Data Scientist" },
                { name: "Muhammad Ilham Firdaus", role: "AI Engineer" },
              ].map((member, idx) => (
                <div key={idx} className="bg-[#f8fdfd] border border-gray-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/20 transition-colors shadow-sm">
                  <div>
                    <h3 className="font-bold font-family-lexend text-gray-800 text-sm leading-tight mb-1">{member.name}</h3>
                    <p className="text-[11px] font-bold font-family-manrope text-gray-400 uppercase tracking-wider">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 pt-8">
            <div className="bg-inverse-surface rounded-[24px] p-8 border border-outline-variant/10 flex flex-col items-center gap-6">
              <h3 className="text-[11px] font-black font-family-lexend text-outline-variant uppercase tracking-widest text-center">
                Didukung oleh
              </h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500">
                <img src={logoDicoding} alt="Dicoding" className="h-6 sm:h-8 object-contain brightness-0 invert" />
                <img src={logoCodingCamp} alt="CodingCamp" className="h-6 sm:h-8 object-contain" />
                <img src={logoDBS} alt="DBS Foundation" className="h-6 sm:h-8 object-contain" />
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;