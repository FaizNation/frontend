import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/api';

const Groups = () => {
  const { user, loading: authLoading } = useAuth();
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('joined'); // Default to 'joined'
  
  // Search & Filter State (for discover mode)
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Join by Code state
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const navigate = useNavigate();
  const categories = ['Semua', 'Mindfulness', 'Sleep', 'Anxiety', 'Depression', 'Work-Life Balance'];

  const fetchJoinedGroups = useCallback(async () => {
    try {
      const response = await groupService.getJoinedGroups();
      if (response.success) {
        setJoinedGroups(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch joined groups:', err);
    }
  }, []);

  const fetchDiscoverGroups = useCallback(async (searchTerm = '', category = '') => {
    setIsLoading(true);
    try {
      const catParam = category === 'Semua' ? '' : category;
      const response = await groupService.getAllGroups(searchTerm, catParam);
      if (response.success) {
        setDiscoverGroups(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch discover groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (user) {
      const init = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchJoinedGroups(),
          fetchDiscoverGroups(search, selectedCategory)
        ]);
        setIsLoading(false);
      };
      init();
    }
  }, [user, fetchJoinedGroups, fetchDiscoverGroups, search, selectedCategory]);

  // Handle Discover Filters (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && viewMode === 'discover') {
        fetchDiscoverGroups(search, selectedCategory);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, viewMode, user, fetchDiscoverGroups]);

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    setJoinError('');
    try {
      const response = await groupService.joinByCode(inviteCode.trim());
      if (response.success) {
        setInviteCode('');
        await fetchJoinedGroups(); // Refresh list
        navigate(`/groups/${response.data.groupId}`);
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Kode tidak valid.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleQuickJoin = async (e, groupId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await groupService.joinGroup(groupId);
      if (response.success) {
        await fetchJoinedGroups();
        navigate(`/groups/${groupId}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal bergabung.');
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen flex flex-col font-manrope">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {viewMode === 'joined' ? (
          /* JOINED GROUPS VIEW (Figma Matched) */
          joinedGroups.length > 0 ? (
            <div className="max-w-[1200px] w-full mx-auto px-6 py-12 md:py-16 animate-fade-in">
              <header className="mb-12">
                <h1 className="font-manrope text-4xl text-primary mb-1 font-bold">Circle Saya</h1>
                <p className="ttext-lg text-on-surface-variant">
                  Tempat aman untuk berbagi, bertumbuh, dan menemukan ketenangan bersama komunitas pilihan Anda.
                </p>
              </header>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {joinedGroups.map((group) => (
                    <div 
                      key={group.id}
                      className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        {/* Circular Image */}
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center shrink-0">
                          {group.imageUrl ? (
                            <img src={getImageUrl(group.imageUrl)} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-3xl text-emerald-600/50">
                              {group.category === 'Mindfulness' ? 'spa' : 'groups'}
                            </span>
                          )}
                        </div>
                        {/* Category Pill */}
                        <span className="px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#2D6A6A] text-xs font-semibold">
                          {group.category}
                        </span>
                      </div>

                      <div className="mb-8 flex-grow">
                        <h3 className="font-semibold text-[#1A3333] text-xl mb-2">{group.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <span className="material-symbols-outlined text-lg">group</span>
                          {group.memberCount} Anggota
                        </div>
                      </div>

                      {/* Full Width Button */}
                      <Link 
                        to={`/groups/${group.id}`}
                        className="w-full py-4 bg-[#114B4B] text-white text-center rounded-xl font-medium text-sm hover:bg-[#0A3838] transition-colors mt-auto"
                      >
                        Masuk Grup
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Temukan Grup Lain Section */}
              {!isLoading && joinedGroups.length > 0 && (
                <div className="mt-24 flex justify-between items-center pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-semibold text-[#1A3333]">Temukan Grup Lain</h2>
                  <button 
                    onClick={() => setViewMode('discover')}
                    className="text-sm font-semibold text-[#2D6A6A] hover:underline flex items-center gap-1 group"
                  >
                    Lihat Semua
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* EMPTY JOINED STATE (As per provided HTML) */
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#2D6A6A] mb-8 max-w-2xl leading-tight">
                Anda Belum Bergabung dengan Circle Manapun
              </h1>
              <button 
                onClick={() => setViewMode('discover')}
                className="group flex items-center gap-3 text-xl font-medium text-[#2D6A6A] hover:opacity-80 transition-all"
              >
                Temukan Grup
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          )
        ) : (
          /* DISCOVER GROUPS VIEW */
          <div className="max-w-[1200px] w-full mx-auto px-6 py-12 md:py-16 animate-fade-in">
            <header className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl text-[#2D6A6A] mb-4 font-extrabold tracking-tight">Temukan Circle mu</h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">Bergabunglah dengan circle yang saling mendukung dan memiliki pengalaman serupa. Tempat yang aman untuk mendengarkan, berbagi, dan berkembang bersama.</p>
            </header>

            {/* Bento Grid Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-surface-variant relative overflow-hidden flex flex-col justify-center shadow-sm">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-on-surface">Explore Circle</h2>
                    <p className="text-sm text-on-surface-variant font-medium">Cari berdasarkan topik atau feeling.</p>
                  </div>
                  <Link 
                    to="/groups/create"
                    className="bg-[#0c5252] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Create Circle
                  </Link>
                </div>

                <div className="relative z-10 mb-6 mt-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                  <input 
                    type="text"
                    placeholder="Cari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border-none rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface shadow-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-[#CBEBCA] text-[#06200C] border-[#CBEBCA]' : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-high'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#49453F] text-white p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <span className="material-symbols-outlined text-white text-sm">vpn_key</span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">Punya Undangan?</h2>
                  <p className="text-xs text-white/80 font-medium mb-8">Masukan kode undangan anda dibawah ini.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="ENTER CODE"
                      value={inviteCode}
                      onChange={(e) => {setInviteCode(e.target.value.toUpperCase()); setJoinError('');}}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-center tracking-widest uppercase font-bold text-sm outline-none focus:border-white"
                    />
                  </div>
                  {joinError && <p className="text-[10px] text-red-200 font-bold text-center">{joinError}</p>}
                  <button 
                    onClick={handleJoinByCode}
                    disabled={isJoining || !inviteCode.trim()}
                    className="w-full py-3 bg-white text-[#49453F] font-bold text-xs rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            </div>

            {/* Discover Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverGroups.map((group) => {
                const isJoined = joinedGroups.some(jg => jg.id === group.id);
                return (
                  <Link 
                    to={`/groups/${group.id}`} 
                    key={group.id}
                    className="group bg-white rounded-3xl p-6 border border-surface-variant shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                        {group.imageUrl ? (
                            <img src={getImageUrl(group.imageUrl)} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-[32px]">{group.category === 'Mindfulness' ? 'spa' : 'groups'}</span>
                          )}
                      </div>
                      {isJoined && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          BERGABUNG
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-on-surface text-xl mb-2 group-hover:text-primary transition-colors">{group.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">{group.description}</p>
                    <div className="pt-6 border-t border-surface-variant flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-outline font-bold text-[10px] uppercase">
                        <span className="material-symbols-outlined text-lg">mood</span>
                        {group.category}
                      </div>
                      {!isJoined && (
                        <button 
                          onClick={(e) => handleQuickJoin(e, group.id)}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Groups;
