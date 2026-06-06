const StressRiskCard = ({ stressPercentage }) => {
  const dashOffset = 283 - (283 * (stressPercentage || 0)) / 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45,106,106,0.08)] flex flex-col md:flex-row items-center gap-12 border border-outline-variant/20">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle className="text-[#efeeeb]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
          <circle 
            className={stressPercentage > 60 ? 'text-red-500' : 'text-secondary'} 
            cx="50" cy="50" fill="none" r="45" 
            stroke="currentColor" 
            strokeDasharray="283" 
            strokeDashoffset={dashOffset} 
            strokeLinecap="round" 
            strokeWidth="8"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-manrope text-3xl text-on-surface font-bold">{stressPercentage}%</span>
        </div>
      </div>
      <div>
        <h2 className="font-manrope text-2xl text-on-surface mb-1 font-semibold">
          {stressPercentage <= 30 ? 'Risiko Stres Rendah' : stressPercentage <= 70 ? 'Risiko Stres Sedang' : 'Risiko Stres Tinggi'}
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {stressPercentage <= 30 
            ? 'Kondisimu terpantau stabil minggu ini. Teruskan rutinitas baik yang sudah kamu bangun.' 
            : stressPercentage <= 70 
            ? 'Ada sedikit peningkatan kecemasan. Coba luangkan waktu untuk bernapas dalam.' 
            : 'Tingkat stresmu cukup tinggi. Sangat disarankan untuk beristirahat atau berbicara dengan ahli.'}
        </p>
      </div>
    </div>
  );
};

export default StressRiskCard;
