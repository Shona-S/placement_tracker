import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarHeatmap({ currentDate, progressData, onDateSelect }) {
    // Generate calendar days for the current month
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

        const days = [];

        // Pad empty days at start
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Fill days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push(date);
        }

        return days;
    }, [currentDate]);

    // Helper to get formatted date string for lookup
    const getDateKey = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getIntensityColor = (date) => {
        if (!date) return 'transparent';
        const dateKey = getDateKey(date);
        const dayProgress = progressData[dateKey];

        const score = dayProgress ? dayProgress.score : 0;

        switch (score) {
            case 3: return '#4c1d95'; // Violet-900 (Very Dark)
            case 2: return '#8b5cf6'; // Violet-500 (Medium)
            case 1: return '#a78bfa'; // Violet-400 (Distinct but lighter than medium)
            default: return 'var(--bg-tertiary)'; // Empty
        }
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!date) return false;
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    const isFuture = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    };

    const handleDateClick = (date) => {
        if (!date || isFuture(date)) return;
        onDateSelect(date);
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Handlers for month navigation (just changing current date to +/- 1 month)
    const prevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onDateSelect(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onDateSelect(newDate);
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{monthName}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} className="hover-bg-primary" style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="hover-bg-primary" style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{day}</div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {calendarDays.map((date, index) => {
                    const future = isFuture(date);
                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(date)}
                            style={{
                                aspectRatio: '1',
                                backgroundColor: getIntensityColor(date),
                                borderRadius: 'var(--radius-sm)',
                                border: isToday(date) ? '2px solid var(--accent-primary)' : isSelected(date) ? '2px solid white' : 'none',
                                cursor: date ? (future ? 'not-allowed' : 'pointer') : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                color: date && (getIntensityColor(date) === '#4c1d95' || getIntensityColor(date) === '#8b5cf6') ? 'white' : 'var(--text-muted)',
                                opacity: future ? 0.5 : 1,
                                transition: 'transform 0.1s'
                            }}
                        >
                            {date ? date.getDate() : ''}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: 'var(--bg-tertiary)' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#a78bfa' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#8b5cf6' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#4c1d95' }}></div>
                </div>
                <span>More</span>
            </div>

            <style>{`
                .hover-bg-primary:hover {
                    background-color: var(--bg-tertiary) !important;
                }
            `}</style>
        </div>
    );
}
