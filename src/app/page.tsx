export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">
          <span className="page-header-emoji">🏠</span>대시보드
        </h2>
      </div>
      <div className="page-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: '활성 에이전트', value: '4', color: '#10b981', emoji: '👥' },
            { label: '예정된 회의', value: '0', color: '#3b82f6', emoji: '📅' },
            { label: '진행 중인 회의', value: '0', color: '#ef4444', emoji: '🔴' },
            { label: '총 회의 수', value: '0', color: '#8b5cf6', emoji: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.emoji}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            Yootopia에 오신 것을 환영합니다
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            좌측 메뉴에서 직원을 관리하거나, 새 회의를 생성하여 AI 에이전트와 함께 회의를 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
