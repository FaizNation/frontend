import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../ui/ProfileModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import apiHidup from '../../assets/api/apiHidup.svg';
import apiMati from '../../assets/api/apiMati.svg'; 
import { getImageUrl } from '../../utils/api';
import IconLogo from '../../assets/Icon.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, logout, updateProfile, streakData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate('/login');
  };

  const handleProfileUpdate = (updatedUser) => {
    updateProfile(updatedUser);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="border-b sticky top-0 z-50 bg-[#f5f7f5] border-[rgba(45,106,106,0.1)] shadow-[0_20px_40px_rgba(45,106,106,0.05)] font-manrope">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 h-16 sm:h-20 max-w-7xl mx-auto">
          {/* Brand */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0"
          >
            <img
              src={IconLogo}
              alt="Logo"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              MindBalance
            </span>
          </Link>

          {/* Navigation Web - Authenticated */}
          {user && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-colors relative py-1 ${isActive('/dashboard') ? 'text-primary' : 'text-[#3f4848] hover:text-primary'}`}
              >
                Beranda
                {isActive('/dashboard') && <span className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary rounded-full"></span>}
              </Link>
              <Link
                to="/groups"
                className={`text-sm font-semibold transition-colors relative py-1 ${isActive('/groups') ? 'text-primary' : 'text-[#3f4848] hover:text-primary'}`}
              >
                Grup
                {isActive('/groups') && <span className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary rounded-full"></span>}
              </Link>
              <Link
                to="/challenges"
                className={`text-sm font-semibold transition-colors relative py-1 ${isActive('/challenges') ? 'text-primary' : 'text-[#3f4848] hover:text-primary'}`}
              >
                Tantangan
                {isActive('/challenges') && <span className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary rounded-full"></span>}
              </Link>
            </nav>
          )}

          {/* Trailing Icons & Auth */}
          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                {/* Streak */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efeeeb] rounded-full shadow-sm">
                  <img
                    src={streakData?.hasCheckedInToday ? apiHidup : apiMati}
                    alt="Streak"
                    className="w-3.5 h-4.5 object-contain"
                  />
                  <span className={`font-bold text-sm ${streakData?.hasCheckedInToday ? 'text-orange-600' : 'text-slate-500'}`}>
                    {streakData?.count || 0}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1 hover:bg-[#f4f3f1] transition-colors p-1 rounded-lg"
                  >
                    {user.avatar ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-primary/10"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[#3f4848] text-2xl">account_circle</span>
                    )}
                    <span className="material-symbols-outlined text-[#3f4848] text-base">expand_more</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[rgba(45,106,106,0.1)] py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-lexend">Akun Saya</p>
                        <p className="text-sm font-bold text-[#1a1c1a] truncate font-manrope">{user.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          setProfileModalOpen(true);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#3f4848] hover:bg-[#f4f3f1] font-manrope"
                      >
                        <span className="material-symbols-outlined text-lg">person</span>
                        Edit Profil
                      </button>
                      <button
                        onClick={() => {
                          setLogoutModalOpen(true);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-manrope"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/login"
                  className="transition-colors duration-200 font-manrope text-[15px] font-medium text-[#3f4848] hover:text-primary"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition duration-300 ease-in-out hover:-translate-y-0.5 bg-primary text-[#abe8e7] font-manrope text-[14px] font-medium tracking-[0.02em] shadow-[0_4px_14px_0_rgba(45,106,106,0.35)] hover:shadow-[0_6px_20px_rgba(45,106,106,0.25)]"
                >
                  Mulai Gratis
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 text-primary"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[28px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t px-4 py-4 flex flex-col gap-3 bg-[#f5f7f5] border-[rgba(45,106,106,0.1)]">
            {user ? (
              <>
                <Link to="/dashboard" className="py-2.5 px-4 rounded-lg font-medium font-manrope text-[15px] text-[#3f4848] bg-white border border-[rgba(45,106,106,0.1)]" onClick={() => setMenuOpen(false)}>Beranda</Link>
                <Link to="/groups" className="py-2.5 px-4 rounded-lg font-medium font-manrope text-[15px] text-[#3f4848]" onClick={() => setMenuOpen(false)}>Grup</Link>
                <Link to="/challenges" className="py-2.5 px-4 rounded-lg font-medium font-manrope text-[15px] text-[#3f4848]" onClick={() => setMenuOpen(false)}>Tantangan</Link>
                <button
                  onClick={() => {
                    setLogoutModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-4 rounded-lg font-medium font-manrope text-[15px] text-red-500 border border-red-100"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-center py-2.5 rounded-lg font-medium transition-colors duration-200 font-manrope text-[15px] text-[#3f4848] border border-[rgba(45,106,106,0.2)]"
                  onClick={() => setMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-[#abe8e7] font-manrope text-[14px] font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Mulai Gratis
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <ProfileModal
        key={profileModalOpen ? 'profile-modal-open' : 'profile-modal-closed'}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <ConfirmationModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Keluar dari Akun?"
        message="Apakah Anda yakin ingin keluar? Anda perlu masuk kembali untuk mengakses fitur MindBalance."
        confirmText="Ya, Keluar"
        cancelText="Tetap Disini"
        variant="danger"
      />
    </>
  );
};

export default Navbar;
