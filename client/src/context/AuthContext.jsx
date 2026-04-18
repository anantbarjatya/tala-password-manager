import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../config/firebase';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ─── Local login ───────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  // ─── Local register ────────────────────────────────────────
  const register = async (name, email, password, masterPassword) => {
    const res = await api.post('/api/auth/register', {
      name, email, password, masterPassword,
    });
    setUser(res.data.user);
    return res.data;
  };

  // ─── Google login ──────────────────────────────────────────
  const googleLogin = async () => {
    // Firebase popup open karo
    const result  = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Apne backend ko bhejo
    const res = await api.post('/api/auth/google', { idToken });
    setUser(res.data.user);
    return res.data; // { user, isNewUser }
  };

  // ─── Setup master password (Google users) ─────────────────
  const setupMasterPassword = async (masterPassword) => {
    const res = await api.post('/api/auth/setup-master', { masterPassword });
    // User update karo — masterPasswordSet: true
    setUser(prev => ({ ...prev, masterPasswordSet: true }));
    return res.data;
  };

  // ─── Logout ───────────────────────────────────────────────
  const logout = async () => {
    await api.post('/api/auth/logout');
    // Agar Google user hai toh Firebase se bhi logout karo
    if (auth.currentUser) {
      await signOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register,
      googleLogin, setupMasterPassword,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);