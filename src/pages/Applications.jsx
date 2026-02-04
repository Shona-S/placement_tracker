import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getUserApplications, addApplication, updateApplication, deleteApplication } from '../services/firestore';
import { Plus, Search, MapPin, Calendar, Edit2, Trash2, Filter } from 'lucide-react';

export default function Applications() {
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const listCallback = (data) => {
                setApplications(data);
                setFilteredApps(data);
            };

            listCallback.onError = (error) => {
                console.error("Subscription error:", error);
                if (error.code === 'failed-precondition' && error.message.includes('index')) {
                    alert("Missing Index: check console for the link to create it!");
                }
            };

            const unsubscribe = getUserApplications(currentUser.uid, listCallback);
            return unsubscribe;
        }
    }, [currentUser]);

    useEffect(() => {
        let result = applications;

        if (searchTerm) {
            result = result.filter(app =>
                app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(app => app.status === statusFilter);
        }

        setFilteredApps(result);
    }, [searchTerm, statusFilter, applications]);

    const handleAdd = async (formData) => {
        setLoading(true);
        try {
            await addApplication(currentUser.uid, formData);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding app:", error);
            alert("Failed to add application");
        }
        setLoading(false);
    };

    const handleEdit = async (formData) => {
        setLoading(true);
        try {
            await updateApplication(editingApp.id, formData);
            setIsModalOpen(false);
            setEditingApp(null);
        } catch (error) {
            console.error("Error updating app:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            try {
                await deleteApplication(id);
            } catch (error) {
                console.error("Error deleting app:", error);
            }
        }
    };

    const openAddModal = () => {
        setEditingApp(null);
        setIsModalOpen(true);
    };

    const openEditModal = (app) => {
        setEditingApp(app);
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Applications</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your placement journey</p>
                </div>
                <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Add Application
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ position: 'relative', minWidth: '150px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <select
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {filteredApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                    <p>No applications found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredApps.map(app => (
                        <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{app.companyName}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.role}</p>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} />
                                    {app.location} ({app.mode})
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} />
                                    Applied: {app.date}
                                </div>
                            </div>

                            {/* Notes section if exists */}
                            {app.notes && (
                                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{app.notes}"</p>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                                <button
                                    onClick={() => openEditModal(app)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
                                    className="hover-bg-primary"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(app.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--error)', padding: '0.5rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
                                    className="hover-bg-primary"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingApp ? "Edit Application" : "New Application"}
            >
                <ApplicationForm
                    initialData={editingApp}
                    onSubmit={editingApp ? handleEdit : handleAdd}
                    onCancel={() => setIsModalOpen(false)}
                    loading={loading}
                />
            </Modal>

            <style>{`
        .hover-bg-primary:hover {
          background-color: var(--bg-tertiary) !important;
        }
      `}</style>
        </Layout>
    );
}
