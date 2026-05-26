import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from './api/client';
import { useAuth } from './auth/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import AuditPage from './pages/AuditPage';

export default function App() {
  const { user, login, logout } = useAuth();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    if (!user) return;
    client.get('/menus').then((r) => setMenus(r.data.menus));
  }, [user]);

  if (!user) return <LoginPage onLogin={login} />;

  return (
    <div className="layout">
      <aside>
        <h3>管理后台</h3>
        {menus.map((m) => <Link key={m.key} to={m.path}>{m.title}</Link>)}
        <button onClick={logout}>退出</button>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage user={user} />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
