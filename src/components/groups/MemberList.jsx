import { getImageUrl } from '../../utils/api';

const MemberList = ({ members, isAdmin, currentUserId, onKick, onLeave, isMember }) => {
  const getAvatarUrl = (path) => {
    return getImageUrl(path) || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm sticky top-28">
      <h3 className="text-sm font-semibold text-[#114B4B] mb-6">Daftar Anggota</h3>
      <div className="space-y-4">
        {members?.map(member => (
          <div key={member.id} className="flex items-center gap-3 group relative">
            <img 
              src={getAvatarUrl(member.avatar)} 
              alt={member.name} 
              className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{member.name}</p>
              {member.role === 'ADMIN' && <p className="text-[9px] text-[#2D6A6A] font-bold uppercase">Admin</p>}
            </div>
            {isAdmin && member.id !== currentUserId && (
              <button 
                onClick={() => onKick(member.id, member.name)}
                className="absolute right-0 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-500 hover:text-white transition-all"
                title="Keluarkan Anggota"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        ))}
      </div>
      {isMember && !isAdmin && (
        <button 
          onClick={onLeave}
          className="mt-8 w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          Keluar Grup
        </button>
      )}
    </div>
  );
};

export default MemberList;
