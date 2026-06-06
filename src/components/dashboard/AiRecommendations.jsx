const AiRecommendations = ({ aiData, isAiLoading, hasCheckedInToday }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45, 106, 106, 0.08)] border border-outline-variant/20 min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-cyan-100/50">
            <span className="material-symbols-outlined text-cyan-600 text-xl">psychology</span>
          </div>
          <h3 className="font-manrope text-xl text-on-surface font-semibold">Saran AI</h3>
        </div>
        {aiData && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
            aiData.stress_level === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
            aiData.stress_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            {aiData.stress_level} Stress
          </span>
        )}
      </div>

      {isAiLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 h-20 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : aiData ? (
        <ul className="space-y-3">
          {aiData.recommendations.slice(0, 4).map((rec, i) => (
            <li key={i} className="bg-[#f4f3f1]/50 p-3 rounded-xl flex items-start gap-3 border border-transparent hover:border-primary/10 transition-all">
              <span className="material-symbols-outlined text-secondary mt-0.5 text-lg">
                {i % 3 === 0 ? 'self_improvement' : i % 3 === 1 ? 'bedtime' : 'directions_walk'}
              </span>
              <div>
                <p className="text-xs text-on-surface leading-relaxed font-medium">{rec}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">auto_awesome</span>
          <p className="text-xs text-on-surface-variant italic">
            {hasCheckedInToday 
              ? 'Gagal memuat saran AI.' 
              : 'Lakukan check-in harian untuk mendapatkan saran kesehatan mental dari AI kami.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
