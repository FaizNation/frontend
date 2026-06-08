import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';

// UI Components
import ConfirmationModal from '../components/ui/ConfirmationModal';
import SuccessModal from '../components/ui/SuccessModal';

// Refactored Sub-components
import GroupHeader from '../components/groups/GroupHeader';
import GroupAbout from '../components/groups/GroupAbout';
import GroupRules from '../components/groups/GroupRules';
import GroupAdminPanel from '../components/groups/GroupAdminPanel';
import GroupReport from '../components/groups/GroupReport';
import MemberList from '../components/groups/MemberList';

const GroupDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('tentang'); 

  // Modal States
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [kickModalOpen, setKickModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, title: '', message: '' });

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
    try {
      const response = await groupService.removeMember(id, user.id);
      if (response.success) {
        setLeaveModalOpen(false);
        navigate('/groups');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal keluar dari grup.');
    }
  };

  const handleKickMember = async () => {
    if (!selectedMember) return;
    try {
      const response = await groupService.removeMember(id, selectedMember.id);
      if (response.success) {
        setKickModalOpen(false);
        setSelectedMember(null);
        await fetchGroupDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || `Gagal mengeluarkan member.`);
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

  if (authLoading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114B4B]"></div>
    </div>
  );

  if (!user) return null;

  if (error || !group) return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <span className="material-symbols-outlined text-7xl text-red-300 mb-6">error_outline</span>
        <h2 className="text-3xl font-bold text-gray-800 mb-3 font-manrope">{error || 'Grup tidak ditemukan'}</h2>
        <button onClick={() => navigate('/groups')} className="px-8 py-3 bg-[#114B4B] text-white font-bold rounded-xl mt-6">Kembali ke Komunitas</button>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        
        <GroupHeader 
          group={group} 
          isMember={isMember} 
          isAdmin={isAdmin} 
          isJoining={isJoining} 
          onJoin={handleJoin} 
          onSettingsClick={() => navigate(`/groups/${id}/edit`)} 
        />

        {/* Feedback Modals */}
        <SuccessModal 
          isOpen={successModal.open}
          onClose={() => setSuccessModal({ ...successModal, open: false })}
          title={successModal.title}
          message={successModal.message}
        />

        <ConfirmationModal 
          isOpen={leaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
          onConfirm={handleLeaveGroup}
          title="Keluar dari Grup?"
          message={`Apakah Anda yakin ingin keluar dari ${group.name}? Anda memerlukan undangan baru jika ingin bergabung kembali nanti.`}
          confirmText="Ya, Keluar"
          cancelText="Batal"
          variant="danger"
        />

        <ConfirmationModal 
          isOpen={kickModalOpen}
          onClose={() => {
            setKickModalOpen(false);
            setSelectedMember(null);
          }}
          onConfirm={handleKickMember}
          title="Keluarkan Anggota?"
          message={selectedMember ? `Apakah Anda yakin ingin mengeluarkan ${selectedMember.name} dari grup ini?` : ''}
          confirmText="Ya, Keluarkan"
          cancelText="Batal"
          variant="danger"
        />

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
            {activeTab === 'tentang' ? (
              <>
                {isAdmin && (
                  <GroupAdminPanel 
                    group={group} 
                    onPrivacyChange={handlePrivacyChange} 
                    onCopySuccess={() => setSuccessModal({ 
                      open: true, 
                      title: 'Kode Berhasil Disalin!', 
                      message: 'Bagikan kode ini untuk mengundang teman Anda.' 
                    })}
                  />
                )}
                <GroupAbout group={group} />
                <GroupRules rules={group.rules} />
              </>
            ) : (
              <GroupReport report={report} />
            )}
          </div>

          {/* Right Column: Members List */}
          <div className="lg:col-span-1">
             <MemberList 
               members={group.members} 
               isAdmin={isAdmin} 
               currentUserId={user.id} 
               onKick={(id, name) => {
                 setSelectedMember({ id, name });
                 setKickModalOpen(true);
               }} 
               onLeave={() => setLeaveModalOpen(true)}
               isMember={isMember}
             />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroupDetail;
