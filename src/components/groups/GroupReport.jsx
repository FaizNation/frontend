import iconCerah from '../../assets/cuaca/cerah-dan-hangat.svg';
import iconTenang from '../../assets/cuaca/tenang-dan-stabil.svg';
import iconMendung from '../../assets/cuaca/mendung-dan-teduh.svg';
import iconHujan from '../../assets/cuaca/hujan-yang-menyenangkan.svg';

const GroupReport = ({ report }) => {
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-60 bg-white rounded-3xl border border-gray-100">
        <span className="material-symbols-outlined text-4xl mb-3 text-gray-400">hourglass_empty</span>
        <p className="text-sm font-semibold text-gray-500">Sedang memuat laporan...</p>
      </div>
    );
  }

  const getMoodVisuals = (moodType) => {
    switch (moodType) {
      case 'Cerah & Hangat':
        return { icon: iconCerah, activeSegments: 4 };
      case 'Tenang & stabil':
      case 'Tenang & Stabil':
        return { icon: iconTenang, activeSegments: 3 };
      case 'Mendung dan teduh':
      case 'Mendung & Teduh':
        return { icon: iconMendung, activeSegments: 2 };
      case 'Hujan yang menyenangkan':
      case 'Hujan yang Menenangkan':
        return { icon: iconHujan, activeSegments: 1 };
      default:
        return { icon: iconCerah, activeSegments: 0 };
    }
  };

  const moodVisuals = getMoodVisuals(report.mood?.type);

  return (
    <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm animate-fade-in space-y-10">
      {/* Participation Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-[#E9ECEF]" cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8"></circle>
            <circle 
              className="text-[#0c5252]" 
              cx="50" cy="50" fill="none" r="40" 
              stroke="currentColor" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - (251.2 * (report.participation?.percentage || 0)) / 100} 
              strokeLinecap="round" 
              strokeWidth="8"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-manrope text-2xl font-black text-[#1A3333]">{Math.round(report.participation?.percentage || 0)}%</span>
            <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Aktif</span>
          </div>
        </div>
        <div>
          <h3 className="font-manrope text-xl font-bold text-[#1A3333] mb-2">Tingkat Partisipasi Hari Ini</h3>
          <p className="text-sm font-medium text-gray-700 mb-2">
            {report.participation?.checkedInCount || 0} dari {report.participation?.totalMembers || 0} orang telah melakukan check-in hari ini.
          </p>
          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {report.participation?.message || 'Ayo dukung teman yang belum check-in.'}
          </p>
        </div>
      </div>

      {/* Mood Section */}
      <div>
        <h3 className="font-manrope text-xl font-bold text-primary mb-6">Barometer Suasana Hati</h3>
        <div className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-[#2D6A6A]/10 via-[#FFD700]/5 to-[#FF8C00]/5 border border-primary/10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Illustrative Weather Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
              <img src={moodVisuals.icon} alt={report.mood?.type} className="w-30 h-30 object-contain relative drop-shadow-lg" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-bold text-on-surface">{report.mood?.type || 'Cerah & Hangat'}</h4>
                  <p className="text-on-surface-variant font-medium">{Math.round(report.mood?.happyPercentage || 0)}% Anggota Merasa Bahagia</p>
                </div>
                <div className="text-right hidden md:block">
                  <span className="text-[10px] font-bold text-green-900 px-3 py-1 uppercase">Kondisi Saat Ini</span>
                </div>
              </div>
              
              <p className="text-base md:text-lg font-medium text-on-surface-variant leading-relaxed">
                "{report.mood?.description || 'Sebagian besar anggota grup merasa cukup berenergi hari ini! Ini adalah waktu yang tepat untuk berkolaborasi dan berbagi hal positif.'}"
              </p>

              {/* Segmented Progress Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${moodVisuals.activeSegments >= 1 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-surface-container-highest'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-500 ${moodVisuals.activeSegments >= 2 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-surface-container-highest'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-500 ${moodVisuals.activeSegments >= 3 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-surface-container-highest'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-500 ${moodVisuals.activeSegments >= 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-surface-container-highest'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupReport;
