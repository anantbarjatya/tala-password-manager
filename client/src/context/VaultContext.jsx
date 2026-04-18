import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import api from '../api/axiosInstance';

const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);

  
  const AUTO_LOCK_TIME = 2 * 60 * 1000;

  const lockVault = useCallback(() => {
    setVaultUnlocked(false);
    setCredentials([]);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const resetAutoLockTimer = useCallback(() => {
    if (!vaultUnlocked) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      lockVault();
      alert('Vault locked due to inactivity.');
    }, AUTO_LOCK_TIME);
  }, [vaultUnlocked, lockVault]);

  // Detect user activity
  useEffect(() => {
    if (!vaultUnlocked) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleActivity = () => {
      resetAutoLockTimer();
    };

    events.forEach((event) =>
      window.addEventListener(event, handleActivity)
    );

    resetAutoLockTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [vaultUnlocked, resetAutoLockTimer]);

  const unlockVault = async (masterPassword) => {
    const res = await api.post('/api/auth/verify-master', {
      masterPassword,
    });

    if (res.data.success) {
      setVaultUnlocked(true);
      await fetchCredentials();
    }

    return res.data;
  };

  const fetchCredentials = async () => {
    setLoading(true);

    try {
      const res = await api.get('/api/credentials');
      setCredentials(res.data.credentials);
    } finally {
      setLoading(false);
    }
  };

  const addCredential = async (data) => {
    const res = await api.post('/api/credentials', data);

    setCredentials((prev) => [
      res.data.credential,
      ...prev,
    ]);

    return res.data;
  };

  const updateCredential = async (id, data) => {
    const res = await api.put(`/api/credentials/${id}`, data);

    setCredentials((prev) =>
      prev.map((c) =>
        c._id === id ? res.data.credential : c
      )
    );

    return res.data;
  };

  const deleteCredential = async (id) => {
    await api.delete(`/api/credentials/${id}`);

    setCredentials((prev) =>
      prev.filter((c) => c._id !== id)
    );
  };

  const revealPassword = async (id) => {
    const res = await api.get(
      `/api/credentials/${id}/reveal`
    );

    return res.data.password;
  };

  return (
    <VaultContext.Provider
      value={{
        credentials,
        vaultUnlocked,
        loading,
        unlockVault,
        lockVault,
        fetchCredentials,
        addCredential,
        updateCredential,
        deleteCredential,
        revealPassword,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => useContext(VaultContext);