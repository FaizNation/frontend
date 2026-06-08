// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';

// const EmergencyContact = () => {
//   const contacts = [
//     {
//       name: "Layanan Darurat Nasional",
//       number: "119",
//       description: "Untuk kondisi darurat medis dan ancaman keselamatan jiwa."
//     },
//     {
//       name: "Layanan Psikologi Sejiwa (Kemenkes)",
//       number: "119 (ekstensi 8)",
//       description: "Layanan konsultasi kesehatan jiwa dari Kementerian Kesehatan RI."
//     },
//     {
//       name: "D'HOPE (Depression and Hope)",
//       number: "0811-3855-472",
//       description: "Layanan dukungan psikososial dan pencegahan bunuh diri."
//     },
//     {
//       name: "Yayasan Pulih",
//       number: "(021) 78842580",
//       description: "Konseling dan pemulihan trauma psikologis."
//     }
//   ];

//   return (
//     <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
//       <Navbar />
//       <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in">
//         <div className="text-center mb-12">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <span className="material-symbols-outlined text-red-500 text-4xl">emergency</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-black text-red-600 mb-4 tracking-tight">Butuh Bantuan Segera?</h1>
//           <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
//             Jika Anda merasa berada dalam bahaya, mengalami krisis emosional akut, atau memiliki pikiran untuk menyakiti diri sendiri, mohon segera hubungi tenaga profesional. Anda tidak sendirian.
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {contacts.map((contact, idx) => (
//             <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-red-100/50 hover:border-red-200 transition-colors">
//               <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
//               <a href={`tel:${contact.number.replace(/\D/g, '')}`} className="inline-block text-2xl font-black text-red-500 mb-4 hover:underline">
//                 {contact.number}
//               </a>
//               <p className="text-sm text-gray-500 leading-relaxed">
//                 {contact.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default EmergencyContact;