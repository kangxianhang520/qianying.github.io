import { useEffect, useState } from 'react';
import client from '../api/client';

export default function UsersPage() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const load = (p = page, k = keyword) => {
    client.get('/users', { params: { page: p, pageSize: 10, keyword: k } }).then((r) => {
      setList(r.data.list); setTotal(r.data.total); setPage(r.data.page);
    });
  };

  useEffect(() => { load(1, ''); }, []);

  return <div className="card"><h2>用户管理</h2>
    <div><input value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="搜索用户名/角色" />
    <button onClick={()=>load(1,keyword)}>搜索</button></div>
    <ul>{list.map((u) => <li key={u.id}>{u.username} - {u.role}</li>)}</ul>
    <div>总数: {total} <button disabled={page<=1} onClick={()=>load(page-1,keyword)}>上一页</button> <button onClick={()=>load(page+1,keyword)}>下一页</button></div>
  </div>;
}
