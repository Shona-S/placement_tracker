import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ApplicationForm({ initialData, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        location: '',
        mode: 'On-site',
        status: 'Applied',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Ensure date is formatted for input type="date"
                date: initialData.date || new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Company Name</label>
                <input
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Google"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Role</label>
                    <input
                        required
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. SDE Intern"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date Applied</label>
                    <input
                        required
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                        style={{ appearance: 'none' }} // Custom arrow if I had time, standard for now
                    >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Work Mode</label>
                    <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Bangalore"
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field"
                    rows={3}
                    placeholder="Experience, OA questions, etc."
                    style={{ resize: 'vertical' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)'
                    }}
                >
                    Cancel
                </button>
                <button
                    disabled={loading}
                    type="submit"
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} />
                    Save Application
                </button>
            </div>
        </form>
    );
}
