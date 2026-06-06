import { Link } from 'react-router-dom';
import BadgeCard from '../ui/BadgeCard';

const RecentBadges = ({ recentBadges }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45,106,106,0.08)] border border-outline-variant/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope text-xl text-on-surface font-semibold">Lencana Diraih</h3>
        <Link to="/challenges" className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
          Lihat Semua
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {recentBadges?.length > 0 ? (
          recentBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} variant="compact" />
          ))
        ) : (
          <div className="col-span-full py-4 text-center text-xs text-on-surface-variant italic">Belum ada lencana yang terbuka.</div>
        )}
      </div>
    </div>
  );
};

export default RecentBadges;
