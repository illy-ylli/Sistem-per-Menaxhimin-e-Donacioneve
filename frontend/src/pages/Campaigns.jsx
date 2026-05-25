import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        titulli: '',
        pershkrimi: '',
        shuma_target: '',
        data_fillimit: '',
        data_perfundimit: '',
        category_id: '1'
    });

    const token = Cookies.get('accessToken');
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        const res = await api.get('/campaigns');
        setCampaigns(res.data.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await api.put(`/campaigns/${editing.id}`, form);
        } else {
            await api.post('/campaigns', form);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ titulli: '', pershkrimi: '', shuma_target: '', data_fillimit: '', data_perfundimit: '', category_id: '1' });
        loadCampaigns();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this campaign?')) {
            await api.delete(`/campaigns/${id}`);
            loadCampaigns();
        }
    };

    const handleEdit = (c) => {
        setEditing(c);
        setForm({
            titulli: c.titulli,
            pershkrimi: c.pershkrimi,
            shuma_target: c.shuma_target,
            data_fillimit: c.data_fillimit?.split('T')[0] || '',
            data_perfundimit: c.data_perfundimit?.split('T')[0] || '',
            category_id: c.category_id || '1'
        });
        setShowForm(true);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Campaigns</h1>
            <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ marginBottom: '20px', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
                + Add Campaign
            </button>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th>ID</th><th>Titulli</th><th>Target</th><th>Mbledhur</th><th>Status</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.titulli}</td>
                            <td>${c.shuma_target}</td>
                            <td>${c.shuma_mbledhur}</td>
                            <td>{c.statusi}</td>
                            <td>
                                <button onClick={() => handleEdit(c)} style={{ marginRight: '10px' }}>Edit</button>
                                <button onClick={() => handleDelete(c.id)} style={{ background: 'red', color: 'white' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '30px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', borderRadius: '10px', zIndex: 1000 }}>
                    <h2>{editing ? 'Edit Campaign' : 'New Campaign'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div><input type="text" placeholder="Titulli" value={form.titulli} onChange={e => setForm({...form, titulli: e.target.value})} required /></div>
                        <div><textarea placeholder="Pershkrimi" value={form.pershkrimi} onChange={e => setForm({...form, pershkrimi: e.target.value})} required /></div>
                        <div><input type="number" placeholder="Target Amount" value={form.shuma_target} onChange={e => setForm({...form, shuma_target: e.target.value})} required /></div>
                        <div><input type="date" value={form.data_fillimit} onChange={e => setForm({...form, data_fillimit: e.target.value})} required /></div>
                        <div><input type="date" value={form.data_perfundimit} onChange={e => setForm({...form, data_perfundimit: e.target.value})} required /></div>
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" style={{ background: 'green', color: 'white', padding: '8px 16px', marginRight: '10px' }}>Save</button>
                            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Campaigns;