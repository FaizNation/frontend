import { getImageUrl } from '../../utils/api';

const BadgeCard = ({ badge, variant = 'compact' }) => {
  const isUnlocked = badge.isUnlocked !== undefined ? badge.isUnlocked : true; 
  
  const displayImage = badge.imageUrl || badge.iconUrl;

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('mula')) return 'workspace_premium';
    if (n.includes('hari') || n.includes('streak')) return 'local_fire_department';
    if (n.includes('grup') || n.includes('komunitas')) return 'groups';
    return 'military_tech';
  };

  if (variant === 'compact') {
    // Styling for Dashboard (Recent Badges)
    return (
      <div className="flex flex-col items-center p-4 bg-secondary-container rounded-xl text-center shadow-sm border border-primary/5 h-full">
        <div className="w-12 h-12 flex items-center justify-center mb-2">
          {displayImage ? (
            <img 
              src={getImageUrl(displayImage)} 
              alt={badge.name} 
              className={`w-full h-full object-contain ${!isUnlocked ? 'grayscale' : ''}`} 
            />
          ) : (
            <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              {getIcon(badge.name)}
            </span>
          )}
        </div>
        <span className="text-[10px] text-on-secondary-container font-bold leading-tight line-clamp-2">{badge.name}</span>
      </div>
    );
  }

  // Styling for Challenges Page (Full View)
  return (
    <div 
      className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
        isUnlocked 
          ? 'bg-white border-primary/20 shadow-md hover:shadow-xl hover:-translate-y-1' 
          : 'bg-surface-container-low border-outline-variant/20 opacity-75 grayscale-[0.5]'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`rounded-full flex-shrink-0 ${isUnlocked ? 'bg-secondary-container text-secondary' : 'bg-surface-variant text-outline'}`}>
          {displayImage ? (
            <img 
              src={getImageUrl(displayImage)} 
              alt={badge.name} 
              className="w-20 h-20 object-contain" 
            />
          ) : (
            <span className="material-symbols-outlined text-4xl" style={isUnlocked ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {getIcon(badge.name)}
            </span>
          )}
        </div>
        {!isUnlocked && (
          <div className="bg-gray-100 p-1.5 rounded-full" title="Terkunci">
            <span className="material-symbols-outlined text-outline text-sm">lock</span>
          </div>
        )}
      </div>
      
      <h3 className="font-manrope font-bold text-on-surface text-lg mb-2">{badge.name}</h3>
      <p className="text-sm text-on-surface-variant mb-4 flex-1">{badge.description}</p>
      
      <div className="pt-4 border-t border-outline-variant/10">
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">Syarat</p>
        <p className="text-xs font-semibold text-on-surface">{badge.criteria || 'Misi rahasia'}</p>
      </div>
      
      {isUnlocked && badge.unlockedAt && (
        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 px-3 py-2 rounded-xl w-max">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Diraih: {new Date(badge.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
