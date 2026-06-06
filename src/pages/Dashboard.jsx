import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import checkinService from '../services/checkinService';
import aiService from '../services/aiService';
import CheckinModal from '../components/ui/CheckinModal';
import ChatBot from '../components/ui/ChatBot';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import StressRiskCard from '../components/dashboard/StressRiskCard';
import YearlyHeatmap from '../components/dashboard/YearlyHeatmap';
import AiRecommendations from '../components/dashboard/AiRecommendations';
import RecentBadges from '../components/dashboard/RecentBadges';

const Dashboard = () => {
  const { user, loading, refreshStreak } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  // AI Prediksi
  const [aiData, setAiData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Heatmap
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
      console.error('Prediksi AI gagal:', error);
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
      console.error('Gagal mengambil ringkasan:', error);
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
      console.error('Gagal mengambil heatmap:', error);
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

  if (loading || isSummaryLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-background text-on-background font-lexend min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <WelcomeHeader 
          name={user.name} 
          hasCheckedInToday={summary?.hasCheckedInToday} 
          onCheckinClick={() => setIsCheckinModalOpen(true)} 
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Kiri */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <StressRiskCard stressPercentage={summary?.stressRiskPercentage || 0} />
            <YearlyHeatmap 
              viewYear={viewYear} 
              heatmapData={heatmapData} 
              isHeatmapLoading={isHeatmapLoading} 
              onYearChange={setViewYear} 
            />
          </div>

          {/* Kanan */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <AiRecommendations 
              aiData={aiData} 
              isAiLoading={isAiLoading} 
              hasCheckedInToday={summary?.hasCheckedInToday} 
            />
            <RecentBadges recentBadges={summary?.recentBadges} />
          </div>
        </div>
      </main>

      <CheckinModal 
        isOpen={isCheckinModalOpen} 
        onClose={() => setIsCheckinModalOpen(false)}
        onSuccess={() => {
          fetchSummary();
          fetchHeatmap(viewYear);
          refreshStreak();
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
