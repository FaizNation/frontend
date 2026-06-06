const GroupAdminPanel = ({ group, onPrivacyChange }) => {
  return (
    <section className="bg-[#F8FAFC] border border-gray-100 p-8 rounded-3xl shadow-sm">
      <h2 className="text-xl font-bold text-[#114B4B] mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined">settings</span> Admin
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Invite Code */}
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">key</span> Kode Undangan
          </p>
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
            <span className="font-mono font-bold text-gray-700 tracking-wider">
              {group.inviteCode || 'Tidak Tersedia'}
            </span>
            {group.inviteCode && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(group.inviteCode);
                  alert('Kode berhasil disalin!');
                }}
                className="text-gray-400 hover:text-[#114B4B] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Bagikan kode ini untuk mengundang anggota baru.</p>
        </div>

        {/* Privacy Settings */}
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">public</span> Pengaturan Privasi
          </p>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div 
                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${!group.isPublic ? 'border-[#114B4B] bg-[#114B4B]' : 'border-gray-300 group-hover:border-[#114B4B]'}`}
                onClick={() => onPrivacyChange(false)}
              >
                {!group.isPublic && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <div onClick={() => onPrivacyChange(false)}>
                <p className="text-sm font-bold text-gray-800">Grup Privat</p>
                <p className="text-[10px] text-gray-500">Hanya yang memiliki kode yang bisa bergabung.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div 
                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${group.isPublic ? 'border-[#114B4B] bg-[#114B4B]' : 'border-gray-300 group-hover:border-[#114B4B]'}`}
                onClick={() => onPrivacyChange(true)}
              >
                {group.isPublic && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <div onClick={() => onPrivacyChange(true)}>
                <p className="text-sm font-bold text-gray-800">Grup Publik</p>
                <p className="text-[10px] text-gray-500">Siapa saja bisa menemukan dan bergabung.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupAdminPanel;
