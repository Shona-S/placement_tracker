import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DailyChecklist from '../components/DailyChecklist';
import CalendarHeatmap from '../components/CalendarHeatmap';
import { useAuth } from '../context/AuthContext';
import { getDailyProgress, updateDailyProgress, getAllProgress, getDateString } from '../services/progressService';
import { Flame } from 'lucide-react';

export default function ProgressTracker() {
    const { currentUser } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [progressData, setProgressData] = useState({}); // Map: "YYYY-MM-DD" -> data
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]); // Load all data initially to populate heatmap/streak

    const loadData = async () => {
        setLoading(true);
        try {
            const allData = await getAllProgress(currentUser.uid);
            const dataMap = {};
            allData.forEach(item => {
                dataMap[item.date] = item;
            });
            setProgressData(dataMap);
            calculateStreak(dataMap);
        } catch (error) {
            console.error("Failed to load progress data", error);
        }
        setLoading(false);
    };

    const calculateStreak = (dataMap) => {
        let currentStreak = 0;
        const today = new Date();
        // Check yesterday first, or today if completed
        // Simplification: Check backwards from today. 
        // If today has activity (score > 0), count it. 
        // Then check yesterday, etc.

        let checkDate = new Date();
        while (true) {
            const dateKey = getDateKey(checkDate);
            const dayData = dataMap[dateKey];

            if (dayData && dayData.score > 0) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // If today is 0, don't break streak yet unless yesterday is also 0?
                // Standard logic: Streak is consecutive days. 
                // If I haven't done today yet, my streak is from yesterday.
                if (getDateKey(checkDate) === getDateKey(new Date())) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }
        setStreak(currentStreak);
    }

    // Helper to get formatted date string for lookup matches service
    const getDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleUpdate = async (newData) => {
        const dateKey = getDateKey(currentDate);

        // Optimistic update
        const updatedEntry = { ...newData, date: dateKey };
        const newProgressData = { ...progressData, [dateKey]: updatedEntry };

        // Recalculate score for heatmap immediate update
        let score = 0;
        if (newData.aptitude) score++;
        if (newData.coding) score++;
        if (newData.communication) score++;
        updatedEntry.score = score;

        setProgressData(newProgressData);
        calculateStreak(newProgressData);

        try {
            console.log("Saving progress for:", dateKey, newData);
            await updateDailyProgress(currentUser.uid, dateKey, newData);
            console.log("Save successful");
        } catch (error) {
            console.error("Failed to save progress:", error);
            alert("Failed to save progress. Please check your connection or permissions.");
        }
    };

    const dateKey = getDateKey(currentDate);
    const todayData = progressData[dateKey];

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isFuture = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    };

    // Read-only if it's not today. Future is blocked by CalendarHeatmap anyway, 
    // but good to be safe. Past is read-only.
    const isReadOnly = !isToday(currentDate);

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Progress Tracker</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Consistency is key!</p>
                </div>
                <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--accent-primary)', backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                    <Flame color="var(--accent-primary)" fill="var(--accent-primary)" />
                    <div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--accent-primary)' }}>{streak}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day Streak</p>
                    </div>
                </div>
            </div>

            <div className="progress-grid">
                <div className="calendar-section">
                    <CalendarHeatmap
                        currentDate={currentDate}
                        progressData={progressData}
                        onDateSelect={setCurrentDate}
                    />
                </div>
                <div className="checklist-section">
                    <DailyChecklist
                        date={currentDate}
                        initialData={todayData}
                        onUpdate={handleUpdate}
                        readOnly={isReadOnly}
                    />
                </div>
            </div>

            <style>{`
                .progress-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    align-items: start;
                }
                
                @media (max-width: 768px) {
                    .progress-grid {
                        grid-template-columns: 1fr;
                    }
                    .calendar-section {
                        order: 1;
                    }
                     .checklist-section {
                        order: 2;
                    }
                }
            `}</style>
        </Layout>
    );
}
