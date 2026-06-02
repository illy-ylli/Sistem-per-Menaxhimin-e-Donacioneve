import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminCampaignVolunteers = () => {
    const [assignments, setAssignments] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        campaign_id: '',
        volunteer_id: ''
    });

    const token = Cookies.get('accessToken');
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [assignRes, campaignsRes, volunteersRes] = await Promise.all([
                api.get('/campaign-volunteers'),
                api.get('/campaigns'),
                api.get('/volunteers')
            ]);
            setAssignments(assignRes.data.data || []);
            setCampaigns(campaignsRes.data.data || []);
            setVolunteers(volunteersRes.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Gabim gjatë ngarkimit të të dhënave');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.campaign_id || !formData.volunteer_id) {
            toast.error('Ju lutem zgjidhni një fushatë dhe një vullnetar');
            return;
        }
        try {
            await api.post('/campaign-volunteers', formData);
            toast.success('Vullnetari u caktua në fushatë me sukses');
            setFormData({ campaign_id: '', volunteer_id: '' });
            setShowForm(false);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gabim gjatë caktimit');
        }
    };

    const handleDelete = async (id, campaignTitle, volunteerName) => {
        if (window.confirm(`A jeni i sigurt që doni të hiqni caktimin e "${volunteerName}" nga fushata "${campaignTitle}"?`)) {
            try {
                await api.delete(`/campaign-volunteers/${id}`);
                toast.success('Caktimi u fshi me sukses');
                loadData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes');
            }
        }
    };

    // helper to get campaign title by id
    const getCampaignTitle = (id) => {
        const campaign = campaigns.find(c => c.id === id);
        return campaign ? campaign.titulli : '?';
    };

    // helper to get volunteer name by id
    const getVolunteerName = (id) => {
        const volunteer = volunteers.find(v => v.id === id);
        return volunteer ? `${volunteer.emri} ${volunteer.mbiemri}` : '?';
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Duke ngarkuar...</span></div></div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Caktimi i Vullnetarëve në Fushata</h1>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Anulo' : '+ Cakto Vullnetar'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Cakto Vullnetar në Fushatë</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fushata *</label>
                                            <select name="campaign_id" className="form-control" value={formData.campaign_id} onChange={handleChange} required>
                                                <option value="">Zgjidh një fushatë</option>
                                                {campaigns.map(c => (
                                                    <option key={c.id} value={c.id}>{c.titulli}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Vullnetari *</label>
                                            <select name="volunteer_id" className="form-control" value={formData.volunteer_id} onChange={handleChange} required>
                                                <option value="">Zgjidh një vullnetar</option>
                                                {volunteers.map(v => (
                                                    <option key={v.id} value={v.id}>{v.emri} {v.mbiemri}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success">Cakto</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {assignments.length === 0 ? (
                        <div className="alert alert-info">Nuk ka asnjë caktim të vullnetarëve. Kliko "+ Cakto Vullnetar" për të shtuar.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fushata</th>
                                        <th>Vullnetari</th>
                                        <th>Veprimet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(assign => (
                                        <tr key={assign.id}>
                                            <td>{assign.id}</td>
                                            <td>{getCampaignTitle(assign.campaign_id)}</td>
                                            <td>{getVolunteerName(assign.volunteer_id)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(assign.id, getCampaignTitle(assign.campaign_id), getVolunteerName(assign.volunteer_id))}>
                                                    🗑️
                                                </button>
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

export default AdminCampaignVolunteers;