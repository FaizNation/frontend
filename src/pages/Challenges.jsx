import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import dashboardService from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import BadgeCard from '../components/ui/BadgeCard';

const Challenges = () => {
  const { user, loading } = useAuth();
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await dashboardService.getAllBadges();
        if (response.success) {
          setBadges(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch badges:', err);
        setError('Gagal memuat daftar lencana.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBadges();
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-background text-on-background font-lexend min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="font-manrope text-3xl sm:text-4xl text-primary mb-2 font-bold">Tantangan & Lencana</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Kumpulkan lencana eksklusif dengan menjaga konsistensi check-in harian Anda dan capai keseimbangan mental yang lebih baik.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(45,106,106,0.08)] border border-outline-variant/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 bg-[#f5f7f5]">
            <h2 className="font-manrope text-xl font-bold text-on-surface">Koleksi Lencana Anda</h2>
          </div>

          <div className="p-8">
            {error && (
              <div className="p-4 mb-8 bg-red-50 text-red-500 text-sm rounded-xl text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-sm text-on-surface-variant animate-pulse">Menyiapkan koleksi lencana...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} variant="full" />
                ))}
                
                {badges.length === 0 && !isLoading && !error && (
                  <div className="col-span-full py-16 flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-6xl text-outline-variant">inventory_2</span>
                    <p className="text-on-surface-variant italic">Belum ada data lencana yang tersedia dari sistem.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
