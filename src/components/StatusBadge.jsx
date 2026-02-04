export default function StatusBadge({ status }) {
    const styles = {
        Applied: { bg: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
        Shortlisted: { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.2)' },
        Interviewed: { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' },
        Selected: { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)' },
        Rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
    };

    const currentStyle = styles[status] || styles.Applied;

    return (
        <span style={{
            backgroundColor: currentStyle.bg,
            color: currentStyle.color,
            border: `1px solid ${currentStyle.border}`,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {status}
        </span>
    );
}
