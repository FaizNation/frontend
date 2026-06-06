const GroupAbout = ({ group }) => {
  return (
    <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
      <h2 className="text-xl font-bold text-[#114B4B] mb-4">Tentang Grup</h2>
      <p className="text-gray-600 text-sm leading-relaxed mb-8">
        {group.description || 'Grup ini didedikasikan untuk menciptakan ruang aman bagi semua anggota untuk saling bercerita dan mendukung perjalanan satu sama lain menuju keseimbangan mental yang lebih baik.'}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#F8FAFC] p-4 rounded-xl">
          <span className="material-symbols-outlined text-[#114B4B] mb-2">calendar_month</span>
          <p className="text-xs font-bold text-gray-800 mb-1">Sesi Mingguan</p>
          <p className="text-[10px] text-gray-500">Setiap hari Minggu pukul 07:00 WIB</p>
        </div>
        <div className="bg-[#F8FAFC] p-4 rounded-xl">
          <span className="material-symbols-outlined text-[#114B4B] mb-2">{group.isPublic ? 'public' : 'lock'}</span>
          <p className="text-xs font-bold text-gray-800 mb-1">Grup {group.isPublic ? 'Publik' : 'Privat'}</p>
          <p className="text-[10px] text-gray-500">{group.isPublic ? 'Terbuka untuk semua' : 'Privasi Anda adalah prioritas kami'}</p>
        </div>
      </div>
    </section>
  );
};

export default GroupAbout;
