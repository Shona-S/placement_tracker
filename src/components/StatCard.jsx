export default function StatCard({ title, value, icon, color, description }) {
    return (
        <div className="card" style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
                    <h3 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</h3>
                </div>
                <div style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    {icon}
                </div>
            </div>
            {description && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{description}</p>
            )}
        </div>
    );
}
