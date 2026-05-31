import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        telefoni: '',
        statusi: 'aktiv'
    });

    const token = Cookies.get('accessToken');
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadVolunteers();
    }, []);

    const loadVolunteers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/volunteers');
            setVolunteers(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Gabim gjatë ngarkimit të vullnetarëve');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.emri || !formData.mbiemri || !formData.email) {
            toast.error('Ju lutem plotësoni të gjitha fushat e detyrueshme');
            return;
        }
        try {
            if (editingId) {
                await api.put(`/volunteers/${editingId}`, formData);
                toast.success('Vullnetari u përditësua me sukses');
            } else {
                await api.post('/volunteers', formData);
                toast.success('Vullnetari u krijua me sukses');
            }
            resetForm();
            loadVolunteers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gabim gjatë ruajtjes');
        }
    };

    const handleEdit = (volunteer) => {
        setFormData({
            emri: volunteer.emri,
            mbiemri: volunteer.mbiemri,
            email: volunteer.email,
            telefoni: volunteer.telefoni || '',
            statusi: volunteer.statusi || 'aktiv'
        });
        setEditingId(volunteer.id);
        setShowForm(true);
    };

    const handleDelete = async (id, emri) => {
        if (window.confirm(`A jeni i sigurt që doni të fshini vullnetarin "${emri}"?`)) {
            try {
                await api.delete(`/volunteers/${id}`);
                toast.success('Vullnetari u fshi me sukses');
                loadVolunteers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri: '', mbiemri: '', email: '', telefoni: '', statusi: 'aktiv' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Menaxhimi i Vullnetarëve</h1>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Anulo' : '+ Shto Vullnetar'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{editingId ? 'Përditëso Vullnetarin' : 'Regjistro Vullnetar të Ri'}</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Emri *</label>
                                            <input type="text" name="emri" className="form-control" value={formData.emri} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Mbiemri *</label>
                                            <input type="text" name="mbiemri" className="form-control" value={formData.mbiemri} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Email *</label>
                                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Telefoni</label>
                                            <input type="text" name="telefoni" className="form-control" value={formData.telefoni} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Statusi</label>
                                            <select name="statusi" className="form-control" value={formData.statusi} onChange={handleChange}>
                                                <option value="aktiv">Aktiv</option>
                                                <option value="joaktiv">Joaktiv</option>
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
                    ) : volunteers.length === 0 ? (
                        <div className="alert alert-info">Nuk ka vullnetarë të regjistruar. Kliko "+ Shto Vullnetar" për të regjistruar një të ri.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Emri</th><th>Mbiemri</th><th>Email</th><th>Telefoni</th><th>Statusi</th><th>Veprimet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {volunteers.map(v => (
                                        <tr key={v.id}>
                                            <td>{v.id}</td>
                                            <td>{v.emri}</td>
                                            <td>{v.mbiemri}</td>
                                            <td>{v.email}</td>
                                            <td>{v.telefoni || '-'}</td>
                                            <td>{v.statusi}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(v)}>✏️</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.id, v.emri)}>🗑️</button>
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

export default AdminVolunteers;