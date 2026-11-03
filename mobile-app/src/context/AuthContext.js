import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setToken } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        if (t) {
          setToken(t);
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        }
      } catch (e) {
        setToken(null);
        await AsyncStorage.removeItem('token');
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const saveSession = async (data) => {
    setToken(data.token);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const login = async (email, password) => saveSession((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) =>
    saveSession((await api.post('/auth/register', { name, email, password })).data);
  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, booting, login, register, logout }}>{children}</AuthContext.Provider>;
}
