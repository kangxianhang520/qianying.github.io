import { useEffect, useState } from 'react';
import client from '../api/client';

export default function AuditPage() {
  const [list, setList] = useState([]);
  const [action, setAction] = useState('');

  const load = (params = {}) => client.get('/audit-logs', { params: { page: 1, pageSize: 50, ...params } }).then((r) => setList(r.data.list));
  useEffect(() => { load(); }, []);

  return <div className="card"><h2>审计日志</h2>
    <div><input value={action} onChange={(e)=>setAction(e.target.value)} placeholder="按 action 筛选" />
    <button onClick={()=>load({action})}>筛选</button></div>
    <ul>{list.map((a) => <li key={a.id}>{a.action} - {a.detail} - {a.created_at}</li>)}</ul></div>;
}
