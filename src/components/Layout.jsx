import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, LogOut, User } from 'lucide-react';

export default function Layout({ children }) {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    }

    const navItems = [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { label: 'Applications', path: '/applications', icon: <Briefcase size={20} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container" style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link to="/" style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span className="text-gradient">PlacementTracker</span>
                    </Link>

                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    transition: 'color 0.2s',
                                    fontWeight: location.pathname === item.path ? '500' : '400'
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={16} />
                                {currentUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
}
