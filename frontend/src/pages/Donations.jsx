import React, { useState, useEffect } from 'react';
import donationService from '../services/donationService';
import toast from 'react-hot-toast';

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCampaign, setFilterCampaign] = useState('');
    const [filterDonor, setFilterDonor] = useState('');
    const [formData, setFormData] = useState({
        campaign_id: '',
        donor_id: '',
        shuma: '',
        metoda_pageses: 'other',
        mesazhi: '',
        is_anonymous: false
    });
    
    // Ngarko donacionet kur faqja hapet
    useEffect(() => {
        loadDonations();
    }, []);
    
    const loadDonations = async () => {
        setIsLoading(true);
        try {
            let response;
            if (filterCampaign) {
                response = await donationService.getByCampaign(filterCampaign);
            } else if (filterDonor) {
                response = await donationService.getByDonor(filterDonor);
            } else {
                response = await donationService.getAll();
            }
            setDonations(response.data);
        } catch (error) {
            toast.error('Gabim gjatë ngarkimit të donacioneve');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.campaign_id || !formData.donor_id || !formData.shuma) {
            toast.error('Ju lutem plotësoni të gjitha fushat e detyrueshme');
            return;
        }
        
        if (parseFloat(formData.shuma) <= 0) {
            toast.error('Shuma duhet të jetë më e madhe se 0');
            return;
        }
        
        try {
            if (editingId) {
                await donationService.updateStatus(editingId, formData.statusi);
                toast.success('Statusi i donacionit u përditësua');
            } else {
                await donationService.create(formData);
                toast.success('Donacioni u regjistrua me sukses! Faleminderit!');
            }
            
            setFormData({
                campaign_id: '',
                donor_id: '',
                shuma: '',
                metoda_pageses: 'other',
                mesazhi: '',
                is_anonymous: false
            });
            setEditingId(null);
            setShowForm(false);
            loadDonations();
            
        } catch (error) {
            toast.error(error.message || 'Gabim gjatë ruajtjes');
        }
    };
    
    const handleEditStatus = (donation) => {
        setFormData({
            campaign_id: donation.campaign_id,
            donor_id: donation.donor_id,
            shuma: donation.shuma,
            metoda_pageses: donation.metoda_pageses,
            mesazhi: donation.mesazhi || '',
            is_anonymous: donation.is_anonymous,
            statusi: donation.statusi
        });
        setEditingId(donation.id);
        setShowForm(true);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('A jeni i sigurt që doni të fshini këtë donacion?')) {
            try {
                await donationService.delete(id);
                toast.success('Donacioni u fshi me sukses');
                loadDonations();
            } catch (error) {
                toast.error(error.message || 'Gabim gjatë fshirjes');
            }
        }
    };
    
    const getStatusBadge = (statusi) => {
        const statuses = {
            'pending': { text: 'Në pritje', class: 'bg-warning' },
            'completed': { text: 'I përfunduar', class: 'bg-success' },
            'failed': { text: 'Dështoi', class: 'bg-danger' },
            'refunded': { text: 'Rimbursuar', class: 'bg-info' }
        };
        const s = statuses[statusi] || { text: statusi, class: 'bg-secondary' };
        return <span className={`badge ${s.class}`}>{s.text}</span>;
    };
    
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Menaxhimi i Donacioneve</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setFormData({
                            campaign_id: '',
                            donor_id: '',
                            shuma: '',
                            metoda_pageses: 'other',
                            mesazhi: '',
                            is_anonymous: false
                        });
                        setEditingId(null);
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? 'Anulo' : '+ Donacion i Ri'}
                </button>
            </div>
            
            {/* Filtruesit */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-5">
                            <label className="form-label">Filtro sipas Fushatës (ID)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ID e fushatës"
                                value={filterCampaign}
                                onChange={(e) => setFilterCampaign(e.target.value)}
                            />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">Filtro sipas Donatorit (ID)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ID e donatorit"
                                value={filterDonor}
                                onChange={(e) => setFilterDonor(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-secondary w-100" onClick={loadDonations}>
                                Filtro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Formulari për donacion të ri */}
            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            {editingId ? 'Përditëso Statusin e Donacionit' : 'Regjistro Donacion të Ri'}
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {!editingId && (
                                    <>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">ID e Fushatës *</label>
                                            <input
                                                type="number"
                                                name="campaign_id"
                                                className="form-control"
                                                value={formData.campaign_id}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">ID e Donatorit *</label>
                                            <input
                                                type="number"
                                                name="donor_id"
                                                className="form-control"
                                                value={formData.donor_id}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label className="form-label">Shuma (€) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="shuma"
                                                className="form-control"
                                                value={formData.shuma}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Metoda e Pagesës</label>
                                            <select
                                                name="metoda_pageses"
                                                className="form-select"
                                                value={formData.metoda_pageses}
                                                onChange={handleChange}
                                            >
                                                <option value="karte_krediti">Kartë Krediti</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank_transfer">Transfertë Bankare</option>
                                                <option value="cash">Cash</option>
                                                <option value="other">Tjetër</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Mesazhi</label>
                                            <textarea
                                                name="mesazhi"
                                                className="form-control"
                                                rows="2"
                                                value={formData.mesazhi}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="is_anonymous"
                                                    className="form-check-input"
                                                    checked={formData.is_anonymous}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Donacion Anonim (nuk shfaqet emri im publikisht)
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {editingId && (
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Statusi i Donacionit</label>
                                        <select
                                            name="statusi"
                                            className="form-select"
                                            value={formData.statusi}
                                            onChange={handleChange}
                                        >
                                            <option value="pending">Në pritje</option>
                                            <option value="completed">I përfunduar</option>
                                            <option value="failed">Dështoi</option>
                                            <option value="refunded">Rimbursuar</option>
                                        </select>
                                    </div>
                                )}
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success">
                                        {editingId ? 'Përditëso Statusin' : 'Regjistro Donacionin'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Lista e donacioneve */}
            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Duke ngarkuar...</span>
                    </div>
                </div>
            ) : donations.length === 0 ? (
                <div className="alert alert-info">
                    Nuk ka donacione të regjistruara. Kliko "+ Donacion i Ri" për të regjistruar një donacion.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fushata ID</th>
                                <th>Donatori ID</th>
                                <th>Shuma</th>
                                <th>Data</th>
                                <th>Metoda</th>
                                <th>Statusi</th>
                                <th>Anonim</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id}>
                                    <td>{donation.id}</td>
                                    <td>{donation.campaign_id}</td>
                                    <td>{donation.donor_id}</td>
                                    <td><strong>€{parseFloat(donation.shuma).toFixed(2)}</strong></td>
                                    <td>{new Date(donation.data).toLocaleDateString('sq-AL')}</td>
                                    <td>{donation.metoda_pageses}</td>
                                    <td>{getStatusBadge(donation.statusi)}</td>
                                    <td>{donation.is_anonymous ? '✅ Po' : '❌ Jo'}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEditStatus(donation)}
                                        >
                                            Statusi
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(donation.id)}
                                        >
                                            Fshi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Donations;