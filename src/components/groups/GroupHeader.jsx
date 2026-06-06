import { getImageUrl } from '../../utils/api';

const GroupHeader = ({ group, isMember, isAdmin, isJoining, onJoin, onSettingsClick }) => {
  return (
    <div className="bg-[#F0F4F4] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-fade-in">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
          {group.imageUrl ? (
            <img src={getImageUrl(group.imageUrl)} alt={group.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-4xl text-emerald-600/50">
              {group.category === 'Mindfulness' ? 'spa' : 'groups'}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#114B4B] bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-semibold">{group.category}</span>
            <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">group</span>
              {group.memberCount} Anggota Bergabung
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A3333] tracking-tight">{group.name}</h1>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isAdmin && (
          <button 
            onClick={onSettingsClick}
            className="px-6 py-3 bg-white border border-[#114B4B]/20 text-[#114B4B] rounded-xl font-bold text-sm shadow-sm hover:bg-[#114B4B]/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            Pengaturan
          </button>
        )}
        {isMember ? (
          <div className="flex items-center gap-2 px-6 py-3 bg-[#114B4B] text-white rounded-xl font-medium text-sm shadow-md">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Telah Bergabung
          </div>
        ) : (
          <button 
            onClick={onJoin}
            disabled={isJoining}
            className="px-8 py-3 bg-[#114B4B] text-white rounded-xl font-medium text-sm shadow-md hover:bg-[#0A3838] transition-colors disabled:opacity-70"
          >
            {isJoining ? 'Memproses...' : 'Gabung Grup'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupHeader;
