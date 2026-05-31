import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulli: '',
        pershkrimi: '',
        shuma_target: '',
        data_fillimit: '',
        data_perfundimit: '',
        category_id: '',
        statusi: 'ne_progres'
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
        setIsLoading(true);
        try {
            const response = await api.get('/campaigns');
            setCampaigns(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Gabim gjatë ngarkimit të fushatave');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.titulli || !formData.pershkrimi || !formData.shuma_target || !formData.data_fillimit || !formData.data_perfundimit) {
            toast.error('Ju lutem plotësoni të gjitha fushat e detyrueshme');
            return;
        }
        // Check backend validation: description must be at least 10 characters
        if (formData.pershkrimi.length < 10) {
            toast.error('Përshkrimi duhet të ketë të paktën 10 karaktere');
            return;
        }
        // Prepare data: convert empty category_id to null
        const dataToSend = {
            ...formData,
            category_id: formData.category_id === '' ? null : parseInt(formData.category_id, 10)
        };
        try {
            if (editingId) {
                await api.put(`/campaigns/${editingId}`, dataToSend);
                toast.success('Fushata u përditësua me sukses');
            } else {
                await api.post('/campaigns', dataToSend);
                toast.success('Fushata u krijua me sukses');
            }
            resetForm();
            loadCampaigns();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gabim gjatë ruajtjes');
        }
    };

    const handleEdit = (campaign) => {
        setFormData({
            titulli: campaign.titulli || '',
            pershkrimi: campaign.pershkrimi || '',
            shuma_target: campaign.shuma_target || '',
            data_fillimit: campaign.data_fillimit ? campaign.data_fillimit.split('T')[0] : '',
            data_perfundimit: campaign.data_perfundimit ? campaign.data_perfundimit.split('T')[0] : '',
            category_id: campaign.category_id ?? '',
            statusi: campaign.statusi || 'ne_progres'
        });
        setEditingId(campaign.id);
        setShowForm(true);
    };

    const handleDelete = async (id, titulli) => {
        if (window.confirm(`A jeni i sigurt që doni të fshini fushatën "${titulli}"?`)) {
            try {
                await api.delete(`/campaigns/${id}`);
                toast.success('Fushata u fshi me sukses');
                loadCampaigns();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            titulli: '', pershkrimi: '', shuma_target: '', data_fillimit: '', data_perfundimit: '', category_id: '', statusi: 'ne_progres'
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Menaxhimi i Fushatave</h1>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Anulo' : '+ Shto Fushatë'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{editingId ? 'Përditëso Fushatën' : 'Regjistro Fushatë të Re'}</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Titulli *</label>
                                            <input type="text" name="titulli" className="form-control" value={formData.titulli} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Shuma Target (€) *</label>
                                            <input type="number" step="0.01" name="shuma_target" className="form-control" value={formData.shuma_target} onChange={handleChange} required />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Përshkrimi *</label>
                                            <textarea name="pershkrimi" className="form-control" rows="3" value={formData.pershkrimi} onChange={handleChange} required></textarea>
                                            <small className="text-muted">Minimumi 10 karaktere</small>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Data e fillimit *</label>
                                            <input type="date" name="data_fillimit" className="form-control" value={formData.data_fillimit} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Data e mbarimit *</label>
                                            <input type="date" name="data_perfundimit" className="form-control" value={formData.data_perfundimit} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Statusi</label>
                                            <select name="statusi" className="form-control" value={formData.statusi} onChange={handleChange}>
                                                <option value="ne_progres">Në progres</option>
                                                <option value="aktive">Aktive</option>
                                                <option value="perfunduar">E përfunduar</option>
                                                <option value="anuluar">Anuluar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success">{editingId ? 'Përditëso' : 'Krijo'}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Duke ngarkuar...</span></div></div>
                    ) : campaigns.length === 0 ? (
                        <div className="alert alert-info">Nuk ka fushata të regjistruara. Kliko "+ Shto Fushatë" për të regjistruar një të re.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Titulli</th><th>Target (€)</th><th>Mbledhur (€)</th><th>Statusi</th><th>Data e fillimit</th><th>Data e mbarimit</th><th>Veprimet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.titulli}</td>
                                            <td>{c.shuma_target}</td>
                                            <td>{c.shuma_mbledhur || 0}</td>
                                            <td>{c.statusi}</td>
                                            <td>{c.data_fillimit?.split('T')[0]}</td>
                                            <td>{c.data_perfundimit?.split('T')[0]}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(c)}>✏️</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id, c.titulli)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminCampaigns;