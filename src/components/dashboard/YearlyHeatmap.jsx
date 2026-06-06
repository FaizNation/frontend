const YearlyHeatmap = ({ viewYear, heatmapData, isHeatmapLoading, onYearChange }) => {
  const now = new Date();

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'bg-orange-200';
      case 2: return 'bg-amber-200';
      case 3: return 'bg-sky-200';
      case 4: return 'bg-sky-400';
      case 5: return 'bg-emerald-400';
      default: return 'bg-[#efeeeb]';
    }
  };

  const startDate = new Date(viewYear, 0, 1);
  const endDate = new Date(viewYear, 11, 31);
  
  let startDayOfWeek = startDate.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const weeks = [];
  let currentWeek = [];
  
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  const monthLabels = [];
  let currentMonthCounter = -1;

  for (let d = 1; d <= totalDays; d++) {
    const currentDate = new Date(viewYear, 0, d);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    if (currentDate.getMonth() !== currentMonthCounter) {
      if (currentWeek.length === 0 || d === 1 || currentDate.getDate() <= 7) {
        monthLabels.push({ month: currentDate.getMonth(), weekIndex: weeks.length });
        currentMonthCounter = currentDate.getMonth();
      }
    }

    const dayData = heatmapData?.find(h => h.date === dateStr);
    currentWeek.push({
      date: dateStr,
      level: dayData ? dayData.level : 0,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthNamesFull = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45,106,106,0.08)] border border-outline-variant/20 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-manrope text-xl text-on-surface font-semibold">Heatmap Ketenangan {viewYear}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Lacak konsistensi ketenangan harianmu sepanjang tahun.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onYearChange(viewYear - 1)} className="p-1 rounded hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="font-bold text-sm min-w-[36px] text-center">{viewYear}</span>
          <button onClick={() => onYearChange(viewYear + 1)} disabled={viewYear >= now.getFullYear()} className="p-1 rounded hover:bg-surface-container text-outline disabled:opacity-30 disabled:hover:bg-transparent">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-max">
          <div className="flex relative h-6 mb-1 text-xs text-outline font-medium ml-8">
            {monthLabels.map((label, idx) => (
              <span key={idx} className="absolute" style={{ left: `${label.weekIndex * 16}px` }}>
                {monthNamesFull[label.month]}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[10px] text-outline font-medium w-6 h-[106px] mt-1">
              <span>Sen</span><span>Rab</span><span>Jum</span>
            </div>
            <div className="flex-1">
              {isHeatmapLoading ? (
                <div className="h-[106px] flex items-center justify-center">
                  <div className="animate-pulse flex gap-2">
                    {[...Array(20)].map((_, i) => <div key={i} className="w-3 h-3 rounded-sm bg-gray-100"></div>)}
                  </div>
                </div>
              ) : (
                <div className="flex gap-1">
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {week.map((day, dayIdx) => (
                        day ? (
                          <div key={`${weekIdx}-${dayIdx}`} title={`${day.date}: Level ${day.level || 'Belum check-in'}`} className={`w-3 h-3 rounded-sm transition-colors duration-500 ${getLevelColor(day.level)}`}></div>
                        ) : (
                          <div key={`${weekIdx}-${dayIdx}`} className="w-3 h-3 bg-transparent"></div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 text-[11px] text-outline font-medium">
            <div className="flex items-center gap-2">
              <span>Kurang</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-orange-200"></div>
                <div className="w-3 h-3 rounded-sm bg-amber-200"></div>
                <div className="w-3 h-3 rounded-sm bg-sky-200"></div>
                <div className="w-3 h-3 rounded-sm bg-sky-400"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
              </div>
              <span>Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#efeeeb]"></div>
              <span>Tidak check-in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;
