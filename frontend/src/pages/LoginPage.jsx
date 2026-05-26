import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err?.response?.data?.message || '登录失败');
    }
  };

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h2>登录后台</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="用户名" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="密码" />
        {error && <p className="err">{error}</p>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
}
