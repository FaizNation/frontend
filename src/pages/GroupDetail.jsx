import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';

import iconCerah from '../assets/cuaca/cerah-dan-hangat.svg';
import iconTenang from '../assets/cuaca/tenang-dan-stabil.svg';
import iconMendung from '../assets/cuaca/mendung-dan-teduh.svg';
import iconHujan from '../assets/cuaca/hujan-yang-menyenangkan.svg';

const GroupDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('tentang'); // 'tentang' or 'laporan'

  const fetchGroupDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await groupService.getGroupDetail(id);
      if (response.success) {
        setGroup(response.data);
      }
      
      const reportRes = await groupService.getGroupReport(id).catch(() => null);
      if (reportRes?.success) {
        setReport(reportRes.data);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat detail grup.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      if (user && id) {
        await fetchGroupDetail();
      }
    };
    load();
  }, [user?.id, user, id, fetchGroupDetail]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const response = await groupService.joinGroup(id);
      if (response.success) {
        await fetchGroupDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal bergabung ke grup.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar dari grup ini?')) return;
    try {
      const response = await groupService.removeMember(id, user.id);
      if (response.success) {
        navigate('/groups');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal keluar dari grup.');
    }
  };

  const handleKickMember = async (memberId, memberName) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengeluarkan ${memberName} dari grup ini?`)) return;
    try {
      const response = await groupService.removeMember(id, memberId);
      if (response.success) {
        await fetchGroupDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || `Gagal mengeluarkan ${memberName}.`);
    }
  };

  const handlePrivacyChange = async (isPublic) => {
    if (isPublic === group.isPublic) return;
    try {
      const formData = new FormData();
      formData.append('name', group.name);
      formData.append('description', group.description || '');
      formData.append('category', group.category);
      formData.append('is_public', isPublic);
      
      const response = await groupService.updateGroup(id, formData);
      if (response.success) {
        await fetchGroupDetail();
      }
    } catch (error) {
      console.error('Failed to change privacy:', error);
      alert('Gagal mengubah privasi grup.');
    }
  };

  const isMember = group?.members?.some(m => m.id === user?.id);
  const isAdmin = group?.members?.some(m => m.id === user?.id && m.role === 'ADMIN');

  const getAvatarUrl = (path) => {
    if (!path) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    if (path.startsWith('http')) return path;
    return `http://localhost:4000${path}`;
  };

  if (authLoading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114B4B]"></div>
    </div>
  );

  if (!user) return null;

  if (error || !group) return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <span className="material-symbols-outlined text-7xl text-red-300 mb-6">error_outline</span>
        <h2 className="text-3xl font-bold text-gray-800 mb-3 font-manrope">{error || 'Grup tidak ditemukan'}</h2>
        <button onClick={() => navigate('/groups')} className="px-8 py-3 bg-[#114B4B] text-white font-bold rounded-xl mt-6">Kembali ke Komunitas</button>
      </main>
      <Footer />
    </div>
  );

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

  const moodVisuals = report ? getMoodVisuals(report.mood?.type) : { icon: iconCerah, activeSegments: 0 };

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col font-['Inter',sans-serif]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        
        {/* Header Pill Card */}
        <div className="bg-[#F0F4F4] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              {group.imageUrl ? (
                <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-emerald-600/50">
                  {group.category === 'Mindfulness' ? 'spa' : 'groups'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#114B4B] bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-semibold">{group.category}</span>
                <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">group</span>
                  {group.memberCount} Anggota Bergabung
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A3333] tracking-tight">{group.name}</h1>
            </div>
          </div>
          
          <div>
            {isMember ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-[#114B4B] text-white rounded-xl font-medium text-sm shadow-md">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Telah Bergabung
              </div>
            ) : (
              <button 
                onClick={handleJoin}
                disabled={isJoining}
                className="px-8 py-3 bg-[#114B4B] text-white rounded-xl font-medium text-sm shadow-md hover:bg-[#0A3838] transition-colors disabled:opacity-70"
              >
                {isJoining ? 'Memproses...' : 'Gabung Grup'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {isMember && (
          <div className="flex gap-8 border-b border-gray-200 mb-8 animate-fade-in">
            <button 
              onClick={() => setActiveTab('tentang')}
              className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'tentang' ? 'text-[#114B4B]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="material-symbols-outlined text-lg">info</span>
              Tentang
              {activeTab === 'tentang' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#114B4B] rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('laporan')}
              className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'laporan' ? 'text-[#114B4B]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="material-symbols-outlined text-lg">monitoring</span>
              Laporan
              {activeTab === 'laporan' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#114B4B] rounded-t-full"></div>}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            
            {activeTab === 'tentang' && (
              <>
                {/* Admin Panel */}
                {isAdmin && (
                  <section className="bg-[#F8FAFC] border border-gray-100 p-8 rounded-3xl shadow-sm">
                    <h2 className="text-xl font-bold text-[#114B4B] mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined">settings</span> Admin
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Invite Code */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">key</span> Kode Undangan
                        </p>
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
                          <span className="font-mono font-bold text-gray-700 tracking-wider">
                            {group.inviteCode || 'Tidak Tersedia'}
                          </span>
                          {group.inviteCode && (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(group.inviteCode);
                                alert('Kode berhasil disalin!');
                              }}
                              className="text-gray-400 hover:text-[#114B4B] transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">Bagikan kode ini untuk mengundang anggota baru.</p>
                      </div>

                      {/* Privacy Settings */}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">public</span> Pengaturan Privasi
                        </p>
                        <div className="space-y-3">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${!group.isPublic ? 'border-[#114B4B] bg-[#114B4B]' : 'border-gray-300 group-hover:border-[#114B4B]'}`}>
                              {!group.isPublic && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <div onClick={() => handlePrivacyChange(false)}>
                              <p className="text-sm font-bold text-gray-800">Grup Privat</p>
                              <p className="text-[10px] text-gray-500">Hanya yang memiliki kode yang bisa bergabung.</p>
                            </div>
                          </label>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${group.isPublic ? 'border-[#114B4B] bg-[#114B4B]' : 'border-gray-300 group-hover:border-[#114B4B]'}`}>
                              {group.isPublic && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <div onClick={() => handlePrivacyChange(true)}>
                              <p className="text-sm font-bold text-gray-800">Grup Publik</p>
                              <p className="text-[10px] text-gray-500">Siapa saja bisa menemukan dan bergabung.</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* About Section */}
                <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                  <h2 className="text-xl font-bold text-[#114B4B] mb-4">Tentang Grup</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {group.description || 'Grup ini didedikasikan untuk menciptakan ruang aman bagi semua anggota untuk saling bercerita dan mendukung perjalanan satu sama lain menuju keseimbangan mental yang lebih baik.'}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#F8FAFC] p-4 rounded-xl">
                      <span className="material-symbols-outlined text-[#114B4B] mb-2">calendar_month</span>
                      <p className="text-xs font-bold text-gray-800 mb-1">Sesi Mingguan</p>
                      <p className="text-[10px] text-gray-500">Setiap hari Minggu pukul 07:00 WIB</p>
                    </div>
                    <div className="bg-[#F8FAFC] p-4 rounded-xl">
                      <span className="material-symbols-outlined text-[#114B4B] mb-2">{group.isPublic ? 'public' : 'lock'}</span>
                      <p className="text-xs font-bold text-gray-800 mb-1">Grup {group.isPublic ? 'Publik' : 'Privat'}</p>
                      <p className="text-[10px] text-gray-500">{group.isPublic ? 'Terbuka untuk semua' : 'Privasi Anda adalah prioritas kami'}</p>
                    </div>
                  </div>
                </section>

                {/* Rules Section */}
                <section className="pt-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#114B4B]">gavel</span> Aturan Komunitas
                  </h2>
                  <div className="space-y-6">
                    {group.rules && group.rules.length > 0 ? (
                      group.rules.map((rule, idx) => (
                        <div key={rule.id || idx} className="flex gap-4 items-start border-l-2 border-[#114B4B] pl-4">
                          <div className="w-6 h-6 rounded-full bg-[#114B4B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{rule.content || rule}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex gap-4 items-start border-l-2 border-[#114B4B] pl-4">
                          <div className="w-6 h-6 rounded-full bg-[#114B4B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 mb-1">Saling Menghargai</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Gunakan bahasa yang santun dan dukung sesama anggota dalam perjalanan mereka.</p>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start border-l-2 border-[#114B4B] pl-4">
                          <div className="w-6 h-6 rounded-full bg-[#114B4B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 mb-1">Kerahasiaan Terjaga</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Apa yang dibagikan di dalam grup, tetap berada di dalam grup demi kenyamanan bersama.</p>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start border-l-2 border-[#114B4B] pl-4">
                          <div className="w-6 h-6 rounded-full bg-[#114B4B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 mb-1">Tidak Ada Spam/Iklan</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Fokus pada konten kesehatan mental dan dukungan emosional.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Laporan Tab */}
            {activeTab === 'laporan' && (
              <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm animate-fade-in space-y-10">
                
                {report ? (
                  <>
                    {/* Participation Section (Circular Progress) */}
                    <div className="flex items-center gap-8">
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
                      <h3 className="font-manrope text-xl font-bold text-[#1A3333] mb-4">Suasana Hati</h3>
                      <div className="bg-[#FFFDF5] border border-[#F4EBD0] rounded-3xl p-8 relative overflow-hidden">
                        
                        <div className="flex gap-6 mb-8 relative z-10">
                          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#F4EBD0]">
                            <img src={moodVisuals.icon} alt={report.mood?.type} className="w-10 h-10 object-contain" />
                          </div>
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-manrope text-xl font-bold text-[#1A3333]">{report.mood?.type || 'Cerah & Hangat'}</h4>
                                <p className="text-[11px] text-gray-500 font-medium">{Math.round(report.mood?.happyPercentage || 0)}% Anggota Merasa Bahagia</p>
                              </div>
                              <span className="text-[9px] font-bold text-gray-500 tracking-[0.15em] uppercase">Kondisi Saat Ini</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 leading-relaxed mt-3">
                              "{report.mood?.description || 'Sebagian besar anggota grup merasa cukup berenergi hari ini! Ini adalah waktu yang tepat untuk berkolaborasi dan berbagi hal positif.'}"
                            </p>
                          </div>
                        </div>

                        {/* Segmented Progress Bar (4 segments max) */}
                        <div className="flex gap-1.5 h-1.5 w-full relative z-10">
                          <div className={`flex-1 rounded-full ${moodVisuals.activeSegments >= 1 ? 'bg-amber-400' : 'bg-gray-200'}`}></div>
                          <div className={`flex-1 rounded-full ${moodVisuals.activeSegments >= 2 ? 'bg-amber-400' : 'bg-gray-200'}`}></div>
                          <div className={`flex-1 rounded-full ${moodVisuals.activeSegments >= 3 ? 'bg-amber-400' : 'bg-gray-200'}`}></div>
                          <div className={`flex-1 rounded-full ${moodVisuals.activeSegments >= 4 ? 'bg-amber-400' : 'bg-gray-200'}`}></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                    <span className="material-symbols-outlined text-4xl mb-3 text-gray-400">hourglass_empty</span>
                    <p className="text-sm font-semibold text-gray-500">Sedang memuat laporan...</p>
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Right Column: Members List */}
          <div className="lg:col-span-1">
             <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm sticky top-28">
               <h3 className="text-sm font-semibold text-[#114B4B] mb-6">Daftar Anggota</h3>
               <div className="space-y-4">
                 {group.members?.map(member => (
                   <div key={member.id} className="flex items-center gap-3 group relative">
                     <img 
                       src={getAvatarUrl(member.avatar)} 
                       alt={member.name} 
                       className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200"
                     />
                     <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-gray-800 truncate">{member.name}</p>
                       {member.role === 'ADMIN' && <p className="text-[9px] text-[#2D6A6A] font-bold uppercase">Admin</p>}
                     </div>
                     {isAdmin && member.id !== user.id && (
                       <button 
                         onClick={() => handleKickMember(member.id, member.name)}
                         className="absolute right-0 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-500 hover:text-white transition-all"
                         title="Keluarkan Anggota"
                       >
                         <span className="material-symbols-outlined text-[14px]">close</span>
                       </button>
                     )}
                   </div>
                 ))}
               </div>
               {isMember && !isAdmin && (
                 <button 
                   onClick={handleLeaveGroup}
                   className="mt-8 w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                 >
                   Keluar Grup
                 </button>
               )}
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroupDetail;
