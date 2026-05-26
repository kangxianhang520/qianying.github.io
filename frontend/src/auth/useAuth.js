import { useEffect, useState } from 'react';
import client from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    client.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => localStorage.removeItem('token'));
  }, []);

  const login = async (username, password) => {
    const { data } = await client.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout };
}
