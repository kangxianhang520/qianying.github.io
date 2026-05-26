export default function DashboardPage({ user }) {
  return <div className="card"><h2>仪表盘</h2><p>欢迎你，{user.username}（{user.role}）</p></div>;
}
