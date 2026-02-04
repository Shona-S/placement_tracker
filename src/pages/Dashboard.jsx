import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { getUserApplications } from '../services/firestore';
import { Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = getUserApplications(currentUser.uid, (data) => {
                setApplications(data);
                setLoading(false);
            });
            return unsubscribe;
        }
    }, [currentUser]);

    const stats = {
        total: applications.length,
        selected: applications.filter(app => app.status === 'Selected').length,
        rejected: applications.filter(app => app.status === 'Rejected').length,
        inProgress: applications.filter(app => ['Applied', 'Shortlisted', 'Interviewed'].includes(app.status)).length,
    };

    const recentApps = applications.slice(0, 3); // Top 3 recent

    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Overview of your placement activity</p>
            </div>

            {loading ? (
                <p>Loading stats...</p>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <StatCard
                            title="Total Applications"
                            value={stats.total}
                            icon={<Briefcase size={24} />}
                            color="var(--accent-primary)"
                            description="Keep applying!"
                        />
                        <StatCard
                            title="Offers"
                            value={stats.selected}
                            icon={<CheckCircle size={24} />}
                            color="var(--success)"
                            description="Congratulations!"
                        />
                        <StatCard
                            title="In Progress"
                            value={stats.inProgress}
                            icon={<Clock size={24} />}
                            color="var(--warning)"
                            description="Awaiting updates"
                        />
                        <StatCard
                            title="Rejected"
                            value={stats.rejected}
                            icon={<XCircle size={24} />}
                            color="var(--error)"
                            description="Don't give up"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Recent Activity</h2>
                            <Link to="/applications" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>View All</Link>
                        </div>

                        {recentApps.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {recentApps.map(app => (
                                    <div key={app.id} className="card" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem'
                                    }}>
                                        <div>
                                            <h4 style={{ fontWeight: '600' }}>{app.companyName}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.role}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '99px',
                                                backgroundColor: 'var(--bg-tertiary)',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {app.status}
                                            </span>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{app.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>No applications yet. Start by adding one!</p>
                                <Link to="/applications" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                                    Add Application
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}
