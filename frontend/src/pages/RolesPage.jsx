import { useEffect, useState } from 'react';
import client from '../api/client';

export default function RolesPage() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => client.get('/roles').then((r) => setList(r.data.list));
  useEffect(() => { load(); }, []);

  const togglePerm = (role, code, checked) => {
    setList((prev) => prev.map((item) => {
      if (item.role !== role) return item;
      const next = checked
        ? [...item.permissions, { code, name: code }]
        : item.permissions.filter((p) => p.code !== code);
      return { ...item, permissions: next };
    }));
  };

  const save = async (role, perms) => {
    await client.put(`/roles/${role}/permissions`, { permissionCodes: perms.map((p) => p.code) });
    setMsg(`角色 ${role} 权限已更新`);
    load();
  };

  const allCodes = ['dashboard:view', 'user:view', 'role:view', 'audit:view'];

  return (
    <div className="card">
      <h2>角色权限</h2>
      {msg && <p>{msg}</p>}
      {list.map((r) => (
        <div key={r.role} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
          <h4>{r.role}</h4>
          {allCodes.map((code) => {
            const checked = r.permissions.some((p) => p.code === code);
            return (
              <label key={code} style={{ display: 'inline-block', marginRight: 12 }}>
                <input type="checkbox" checked={checked} onChange={(e) => togglePerm(r.role, code, e.target.checked)} /> {code}
              </label>
            );
          })}
          <div><button onClick={() => save(r.role, r.permissions)}>保存</button></div>
        </div>
      ))}
    </div>
  );
}
