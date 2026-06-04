import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import checkinService from '../services/checkinService';
import aiService from '../services/aiService';
import CheckinModal from '../components/ui/CheckinModal';
import ChatBot from '../components/ui/ChatBot';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  // AI Prediction State
  const [aiData, setAiData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Heatmap State
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [heatmapData, setHeatmapData] = useState([]);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(false);

  const fetchAiPrediction = useCallback(async (userData, checkin) => {
    setIsAiLoading(true);
    try {
      const prediction = await aiService.predictStress(userData, checkin);
      setAiData(prediction);
    } catch (error) {
      console.error('AI Prediction failed:', error);
      setAiData(null);
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await dashboardService.getSummary();
      if (response.success) {
        setSummary(response.data);
        
        // If checked in today, fetch details for AI
        if (response.data.hasCheckedInToday) {
          const checkinRes = await checkinService.getTodayStatus();
          if (checkinRes.success && checkinRes.data.checkin) {
            fetchAiPrediction(user, checkinRes.data.checkin);
          }
        } else {
          setAiData(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [user, fetchAiPrediction]);

  const fetchHeatmap = useCallback(async (year) => {
    setIsHeatmapLoading(true);
    try {
      const promises = Array.from({ length: 12 }, (_, i) => checkinService.getHistory(i + 1, year));
      const results = await Promise.all(promises);
      const combined = results.reduce((acc, curr) => {
        if (curr.success && curr.data && curr.data.history) {
          return acc.concat(curr.data.history);
        }
        return acc;
      }, []);
      setHeatmapData(combined);
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
    } finally {
      setIsHeatmapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const load = async () => {
        await fetchSummary();
        await fetchHeatmap(viewYear);
      };
      load();
    }
  }, [user?.id, user, fetchSummary, fetchHeatmap, viewYear]);

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${baseUrl}${path}`;
  };

  if (loading || isSummaryLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  const stressPercentage = summary?.stressRiskPercentage || 0;
  const dashOffset = 283 - (283 * stressPercentage) / 100;

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

  // Generate dots for the whole year logic...
  const startDate = new Date(viewYear, 0, 1);
  const endDate = new Date(viewYear, 11, 31);
  let startDayOfWeek = startDate.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < startDayOfWeek; i++) { currentWeek.push(null); }
  const monthLabels = [];
  let currentMonth = -1;
  for (let d = 1; d <= totalDays; d++) {
    const currentDate = new Date(viewYear, 0, d);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    if (currentDate.getMonth() !== currentMonth && currentWeek.length === 0) {
      monthLabels.push({ month: currentDate.getMonth(), weekIndex: weeks.length });
      currentMonth = currentDate.getMonth();
    } else if (currentDate.getMonth() !== currentMonth && d === 1) {
      monthLabels.push({ month: currentDate.getMonth(), weekIndex: 0 });
      currentMonth = currentDate.getMonth();
    } else if (currentDate.getMonth() !== currentMonth && currentDate.getDate() <= 7) {
       monthLabels.push({ month: currentDate.getMonth(), weekIndex: weeks.length });
       currentMonth = currentDate.getMonth();
    }
    const dayData = heatmapData.find(h => h.date === dateStr);
    currentWeek.push({ date: dateStr, level: dayData ? dayData.level : 0 });
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) { currentWeek.push(null); }
    weeks.push(currentWeek);
  }

  const monthNamesFull = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  return (
    <div className="bg-background text-on-background font-lexend min-h-screen">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-manrope text-4xl text-primary mb-1 font-bold">Halo, {user.name.split(' ')[0]}.</h1>
            <p className="text-lg text-on-surface-variant">Bagaimana perasaanmu hari ini? Mari luangkan waktu sejenak untuk evaluasi.</p>
          </div>
          <button 
            onClick={() => !summary?.hasCheckedInToday && setIsCheckinModalOpen(true)}
            className={`font-medium px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 ${
              summary?.hasCheckedInToday 
                ? 'bg-secondary-container text-on-secondary-container cursor-default opacity-80' 
                : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {summary?.hasCheckedInToday ? 'task_alt' : 'edit_note'}
            </span>
            {summary?.hasCheckedInToday ? 'Sudah Check-In' : 'Check-in Sekarang'}
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {/* Stress Risk Score Card */}
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
                <p className="text-on-surface-variant">
                  {stressPercentage <= 30 
                    ? 'Kondisimu terpantau stabil minggu ini. Teruskan rutinitas baik yang sudah kamu bangun.' 
                    : stressPercentage <= 70 
                    ? 'Ada sedikit peningkatan kecemasan. Coba luangkan waktu untuk bernapas dalam.' 
                    : 'Tingkat stresmu cukup tinggi. Sangat disarankan untuk beristirahat atau berbicara dengan ahli.'}
                </p>
              </div>
            </div>

            {/* Yearly Heatmap */}
            <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45,106,106,0.08)] border border-outline-variant/20 overflow-hidden relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-manrope text-xl text-on-surface font-semibold">Heatmap Ketenangan {viewYear}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Lacak konsistensi ketenangan harianmu sepanjang tahun.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewYear(prev => prev - 1)} className="p-1 rounded hover:bg-surface-container text-outline">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="font-bold text-sm min-w-[36px] text-center">{viewYear}</span>
                  <button onClick={() => setViewYear(prev => prev + 1)} disabled={viewYear >= now.getFullYear()} className="p-1 rounded hover:bg-surface-container text-outline disabled:opacity-30 disabled:hover:bg-transparent">
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
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* AI Recommendations */}
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
                    {summary?.hasCheckedInToday 
                      ? 'Gagal memuat saran AI. Pastikan server AI aktif.' 
                      : 'Lakukan check-in harian untuk mendapatkan saran kesehatan mental dari AI kami.'}
                  </p>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(45, 106, 106, 0.08)] border border-outline-variant/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-manrope text-xl text-on-surface font-semibold">Lencana Diraih</h3>
                <Link to="/challenges" className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                  Lihat Semua
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {summary?.recentBadges?.length > 0 ? (
                  summary.recentBadges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center p-4 bg-secondary-container rounded-xl text-center">
                      <span className="material-symbols-outlined text-3xl text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {badge.name.toLowerCase().includes('mula') ? 'workspace_premium' : 'military_tech'}
                      </span>
                      <span className="text-[11px] text-on-secondary-container font-medium">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-xs text-on-surface-variant italic">Belum ada lencana yang terbuka.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Nav... */}
      <nav className="md:hidden bg-white border-t border-outline-variant/20 fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Link className="flex flex-col items-center justify-center text-primary" to="/dashboard">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#3f4848]" to="/groups">
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="text-[10px] font-medium">Grup</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#3f4848]" to="/challenges">
          <span className="material-symbols-outlined mb-1">emoji_events</span>
          <span className="text-[10px] font-medium">Tantangan</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#3f4848]" to="/profile">
          {user.avatar ? (
            <img src={getAvatarUrl(user.avatar)} alt="Profil" className="w-6 h-6 rounded-full object-cover mb-1 border border-primary/10" />
          ) : (
            <span className="material-symbols-outlined mb-1">account_circle</span>
          )}
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
      </nav>

      <CheckinModal 
        isOpen={isCheckinModalOpen} 
        onClose={() => setIsCheckinModalOpen(false)}
        onSuccess={() => {
          fetchSummary();
          fetchHeatmap(viewYear);
        }}
      />

      <ChatBot 
        stressLevel={aiData?.stress_level} 
        recommendations={aiData?.recommendations} 
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
