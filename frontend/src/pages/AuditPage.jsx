import { useEffect, useState } from 'react';
import client from '../api/client';

export default function AuditPage() {
  const [list, setList] = useState([]);
  useEffect(() => { client.get('/audit-logs').then((r) => setList(r.data.list)); }, []);
  return <div className="card"><h2>审计日志</h2><ul>{list.map((a) => <li key={a.id}>{a.action} - {a.detail} - {a.created_at}</li>)}</ul></div>;
}
