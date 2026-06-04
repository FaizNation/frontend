import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({ count: 0, hasCheckedInToday: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // We can fetch profile and dashboard summary to get streak info
          const [profile, summary] = await Promise.all([
            authService.getProfile(),
            api.get('/dashboard/summary').then(res => res.data.data).catch(() => null)
          ]);
          
          setUser(profile);
          if (summary) {
            setStreakData({
              count: summary.currentStreak || 0, // Assuming BE provides currentStreak
              hasCheckedInToday: summary.hasCheckedInToday || false
            });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data.user);
    // Refresh streak data after login
    refreshStreak();
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStreakData({ count: 0, hasCheckedInToday: false });
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  const refreshStreak = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data.success) {
        setStreakData({
          count: res.data.data.currentStreak || 0,
          hasCheckedInToday: res.data.data.hasCheckedInToday || false
        });
      }
    } catch (error) {
      console.error('Failed to refresh streak:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      await refreshStreak();
      return profile;
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, streakData, login, register, logout, updateProfile, refreshProfile, refreshStreak }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
