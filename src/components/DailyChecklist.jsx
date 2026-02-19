import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';

export default function DailyChecklist({ date, initialData, onUpdate, readOnly }) {
    const [tasks, setTasks] = useState({
        aptitude: false,
        coding: false,
        communication: false,
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setTasks({
                aptitude: initialData.aptitude || false,
                coding: initialData.coding || false,
                communication: initialData.communication || false,
                notes: initialData.notes || ''
            });
        } else {
            // Reset if no data for this date
            setTasks({
                aptitude: false,
                coding: false,
                communication: false,
                notes: ''
            });
        }
    }, [initialData, date]);

    const handleToggle = (task) => {
        if (readOnly) return;
        const newTasks = { ...tasks, [task]: !tasks[task] };
        setTasks(newTasks);
        onUpdate(newTasks);
    };

    const handleNotesChange = (e) => {
        setTasks(prev => ({ ...prev, notes: e.target.value }));
    };

    const handleNotesBlur = () => {
        // Auto-save notes on blur
        if (!readOnly) {
            onUpdate(tasks);
        }
    };

    const calculateScore = () => {
        let score = 0;
        if (tasks.aptitude) score++;
        if (tasks.coding) score++;
        if (tasks.communication) score++;
        return score;
    };

    const score = calculateScore();
    const progressColor = score === 3 ? 'var(--success)' : score === 2 ? 'var(--info)' : score === 1 ? 'var(--warning)' : 'var(--text-muted)';
    const progressText = score === 3 ? 'Great Progress!' : score === 2 ? 'Good Job!' : score === 1 ? 'Keep Going!' : 'Start Your Day!';

    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            {readOnly && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottomLeftRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                }}>
                    <Lock size={12} />
                    Past Progress (Read-only)
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daily Goals</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{new Date(date).toDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: progressColor }}>{score}/3</span>
                    <p style={{ fontSize: '0.875rem', color: progressColor, fontWeight: '500' }}>{progressText}</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <TaskItem
                    label="Aptitude (45 mins)"
                    checked={tasks.aptitude}
                    onClick={() => handleToggle('aptitude')}
                    disabled={readOnly}
                />
                <TaskItem
                    label="Coding (1 hour)"
                    checked={tasks.coding}
                    onClick={() => handleToggle('coding')}
                    disabled={readOnly}
                />
                <TaskItem
                    label="Communication (15 mins)"
                    checked={tasks.communication}
                    onClick={() => handleToggle('communication')}
                    disabled={readOnly}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Daily Notes</label>
                <textarea
                    className="input-field notes-text"
                    rows={4}
                    value={tasks.notes}
                    onChange={handleNotesChange}
                    onBlur={handleNotesBlur}
                    placeholder={readOnly ? "No notes for this day." : "What did you learn today?"}
                    readOnly={readOnly}
                    style={{ resize: 'vertical', opacity: readOnly ? 0.7 : 1, cursor: readOnly ? 'default' : 'text' }}
                />
                {!readOnly && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                        Auto-saving...
                    </p>
                )}
            </div>
        </div>
    );
}

function TaskItem({ label, checked, onClick, disabled }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: checked ? 'rgba(52, 211, 153, 0.1)' : 'var(--bg-primary)',
                border: `1px solid ${checked ? '#34D399' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: disabled ? 'default' : 'pointer',
                transition: 'all 0.2s',
                opacity: disabled ? 0.8 : 1
            }}
        >
            {checked ? (
                <CheckCircle size={24} color="#34D399" fill="rgba(52, 211, 153, 0.2)" />
            ) : (
                <Circle size={24} color="var(--text-muted)" />
            )}
            <span style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                opacity: checked ? 1 : 1
            }}>
                {label}
            </span>
        </div>
    );
}
