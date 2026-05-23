import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const Donors = () => {
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        telefoni: '',
        total_dhuruar: 0,
        donation_count: 0
    });
    
    useEffect(() => {
        loadDonors();
    }, []);
    
    const loadDonors = async () => {
        setIsLoading(true);
        try {
            // TODO: Lidheni me backend-in kur ta krijoni
            // Për momentin përdorim të dhëna shembull
            setDonors([
                { id: 1, emri: 'John', mbiemri: 'Doe', email: 'john@example.com', total_dhuruar: 500, donation_count: 3 },
                { id: 2, emri: 'Jane', mbiemri: 'Smith', email: 'jane@example.com', total_dhuruar: 1200, donation_count: 5 },
            ]);
        } catch (error) {
            toast.error('Gabim gjatë ngarkimit të donatorëve');
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
        
        if (!formData.emri || !formData.mbiemri || !formData.email) {
            toast.error('Ju lutem plotësoni të gjitha fushat e detyrueshme');
            return;
        }
        
        try {
            if (editingId) {
                // TODO: Përditëso donatorin
                toast.success('Donatori u përditësua me sukses');
            } else {
                // TODO: Krijo donator të ri
                toast.success('Donatori u krijua me sukses');
            }
            
            setFormData({
                emri: '', mbiemri: '', email: '', telefoni: '',
                total_dhuruar: 0, donation_count: 0
            });
            setEditingId(null);
            setShowForm(false);
            loadDonors();
        } catch (error) {
            toast.error(error.message || 'Gabim gjatë ruajtjes');
        }
    };
    
    const handleEdit = (donor) => {
        setFormData(donor);
        setEditingId(donor.id);
        setShowForm(true);
    };
    
    const handleDelete = async (id, emri) => {
        if (window.confirm(`A jeni i sigurt që doni të fshini donatorin "${emri}"?`)) {
            try {
                // TODO: Fshij donatorin
                toast.success('Donatori u fshi me sukses');
                loadDonors();
            } catch (error) {
                toast.error(error.message || 'Gabim gjatë fshirjes');
            }
        }
    };
    
    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Menaxhimi i Donatorëve</h1>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setFormData({
                                    emri: '', mbiemri: '', email: '', telefoni: '',
                                    total_dhuruar: 0, donation_count: 0
                                });
                                setEditingId(null);
                                setShowForm(!showForm);
                            }}
                        >
                            {showForm ? 'Anulo' : '+ Shto Donator'}
                        </button>
                    </div>
                    
                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {editingId ? 'Përditëso Donatorin' : 'Regjistro Donator të Ri'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Emri *</label>
                                            <input
                                                type="text"
                                                name="emri"
                                                className="form-control"
                                                value={formData.emri}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Mbiemri *</label>
                                            <input
                                                type="text"
                                                name="mbiemri"
                                                className="form-control"
                                                value={formData.mbiemri}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Telefoni</label>
                                            <input
                                                type="text"
                                                name="telefoni"
                                                className="form-control"
                                                value={formData.telefoni}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success">
                                                {editingId ? 'Përditëso' : 'Krijo'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Duke ngarkuar...</span>
                            </div>
                        </div>
                    ) : donors.length === 0 ? (
                        <div className="alert alert-info">
                            Nuk ka donatorë të regjistruar. Kliko "+ Shto Donator" për të regjistruar një të ri.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Emri</th>
                                        <th>Mbiemri</th>
                                        <th>Email</th>
                                        <th>Telefoni</th>
                                        <th>Total i Dhuruar</th>
                                        <th>Nr. Donacioneve</th>
                                        <th>Veprimet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.map((donor) => (
                                        <tr key={donor.id}>
                                            <td>{donor.id}</td>
                                            <td>{donor.emri}</td>
                                            <td>{donor.mbiemri}</td>
                                            <td>{donor.email}</td>
                                            <td>{donor.telefoni || '-'}</td>
                                            <td>€{parseFloat(donor.total_dhuruar || 0).toFixed(2)}</td>
                                            <td>{donor.donation_count || 0}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(donor)}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(donor.id, donor.emri)}
                                                >
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

export default Donors;