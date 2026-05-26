import { useEffect, useState } from 'react';
import client from '../api/client';

export default function UsersPage() {
  const [list, setList] = useState([]);
  useEffect(() => { client.get('/users').then((r) => setList(r.data.list)); }, []);
  return <div className="card"><h2>用户管理</h2><ul>{list.map((u) => <li key={u.id}>{u.username} - {u.role}</li>)}</ul></div>;
}
