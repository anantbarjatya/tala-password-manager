import { createContext, useContext, useState } from 'react';
import api from '../api/axiosInstance';

const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const unlockVault = async (masterPassword) => {
    const res = await api.post('/api/auth/verify-master', { masterPassword });
    if (res.data.success) {
      setVaultUnlocked(true);
      await fetchCredentials();
    }
    return res.data;
  };

  const lockVault = () => {
    setVaultUnlocked(false);
    setCredentials([]);
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
    setCredentials(prev => [res.data.credential, ...prev]);
    return res.data;
  };

  const updateCredential = async (id, data) => {
    const res = await api.put(`/api/credentials/${id}`, data);
    setCredentials(prev =>
      prev.map(c => c._id === id ? res.data.credential : c)
    );
    return res.data;
  };

  const deleteCredential = async (id) => {
    await api.delete(`/api/credentials/${id}`);
    setCredentials(prev => prev.filter(c => c._id !== id));
  };

  const revealPassword = async (id) => {
    const res = await api.get(`/api/credentials/${id}/reveal`);
    return res.data.password;
  };

  return (
    <VaultContext.Provider value={{
      credentials, vaultUnlocked, loading,
      unlockVault, lockVault, fetchCredentials,
      addCredential, updateCredential, deleteCredential, revealPassword,
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => useContext(VaultContext);