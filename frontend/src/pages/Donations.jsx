import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DonationCheckout from '../components/DonationCheckout';
import donationService from '../services/donationService';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { handleError, showSuccess, showWarning } from '../utils/errorHandler';

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [campaignId, setCampaignId] = useState('');
    const [donorId, setDonorId] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [metodaPageses, setMetodaPageses] = useState('karte_krediti');
    const [filterCampaign, setFilterCampaign] = useState('');
    const [filterDonor, setFilterDonor] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [statusFormData, setStatusFormData] = useState({ statusi: '' });
    
    const user = authService.getCurrentUser();
    
    // Ngarko donacionet kur faqja hapet
    useEffect(() => {
        loadDonations();
    }, []);
    
    const loadDonations = async () => {
    setIsLoading(true);
    try {
        const response = await donationService.getAll();
        setDonations(response.data);
    } catch (error) {
        handleError(error, 'Gabim gjate ngarkimit te donacioneve');
    } finally {
        setIsLoading(false);
    }
};
    
    const handleDonationSuccess = async () => {
        setShowCheckout(false);
        setDonationAmount('');
        setCampaignId('');
        setDonorId('');
        setMessage('');
        setIsAnonymous(false);
        
        // Ringarko donacionet pas pagese se suksesshme
        await loadDonations();
    };
    
    const handleEditStatus = (donation) => {
        setEditingId(donation.id);
        setStatusFormData({ statusi: donation.statusi });
    };
    
    const handleUpdateStatus = async () => {
    try {
        await donationService.updateStatus(editingId, statusFormData.statusi);
        showSuccess('Statusi i donacionit u përditësua');
        setEditingId(null);
        loadDonations();
    } catch (error) {
        handleError(error, 'Gabim gjatë përditësimit të statusit');
    }
};

const handleDelete = async (id) => {
    if (window.confirm('A jeni i sigurt që doni të fshini këtë donacion?')) {
        try {
            await donationService.delete(id);
            showSuccess('Donacioni u fshi me sukses');
            loadDonations();
        } catch (error) {
            handleError(error, 'Gabim gjatë fshirjes së donacionit');
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
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Menaxhimi i Donacioneve</h1>
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
                    
                    {/* Formulari për donacion të ri me Stripe */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">
                                {showCheckout ? 'Pagesa me Kartë Krediti' : 'Regjistro Donacion të Ri'}
                            </h5>
                            
                            {!showCheckout ? (
                                // Formulari për të dhënat e donacionit
                                <form>
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">ID e Fushatës *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="ID e fushatës"
                                                value={campaignId}
                                                onChange={(e) => setCampaignId(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">ID e Donatorit *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="ID e donatorit"
                                                value={donorId}
                                                onChange={(e) => setDonorId(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label className="form-label">Shuma (€) *</label>
                                            <input
                                                type="number"
                                                step="10"
                                                className="form-control"
                                                placeholder="Shuma"
                                                value={donationAmount}
                                                onChange={(e) => setDonationAmount(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Metoda e Pagesës</label>
                                            <select
                                                className="form-select"
                                                value={metodaPageses}
                                                onChange={(e) => setMetodaPageses(e.target.value)}
                                            >
                                                <option value="karte_krediti">Kartë Krediti (Stripe)</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank_transfer">Transfertë Bankare</option>
                                                <option value="cash">Cash</option>
                                                <option value="other">Tjetër</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Mesazhi</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                placeholder="Mesazhi juaj (opsional)"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={isAnonymous}
                                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                                />
                                                <label className="form-check-label">
                                                    Donacion Anonim (nuk shfaqet emri im publikisht)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button 
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (!campaignId || !donorId || !donationAmount) {
                                                        toast.error('Ju lutem plotësoni të gjitha fushat e detyrueshme');
                                                        return;
                                                    }
                                                    if (parseFloat(donationAmount) <= 0) {
                                                        toast.error('Shuma duhet të jetë më e madhe se 0');
                                                        return;
                                                    }
                                                    if (parseFloat(donationAmount) < 1) {
                                                        toast.error('Shuma minimale e donacionit është 1€');
                                                        return;
                                                    }
                                                    setShowCheckout(true);
                                                }}
                                            >
                                                Vazhdo te Pagesa
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                // Formulari i pagesës me Stripe
                                <DonationCheckout 
                                    amount={parseFloat(donationAmount)}
                                    campaignId={campaignId}
                                    donorName={user ? `${user.firstName} ${user.lastName}` : 'Donator'}
                                    donorEmail={user?.email || ''}
                                    onSuccess={handleDonationSuccess}
                                    onClose={() => setShowCheckout(false)}
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Lista e donacioneve */}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Duke ngarkuar...</span>
                            </div>
                        </div>
                    ) : donations.length === 0 ? (
                        <div className="alert alert-info">
                            Nuk ka donacione të regjistruara.
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
                                                {editingId === donation.id ? (
                                                    <div className="d-flex" style={{ gap: '5px' }}>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={statusFormData.statusi}
                                                            onChange={(e) => setStatusFormData({ statusi: e.target.value })}
                                                            style={{ width: '120px' }}
                                                        >
                                                            <option value="pending">Në pritje</option>
                                                            <option value="completed">I përfunduar</option>
                                                            <option value="failed">Dështoi</option>
                                                            <option value="refunded">Rimbursuar</option>
                                                        </select>
                                                        <button 
                                                            className="btn btn-sm btn-success"
                                                            onClick={handleUpdateStatus}
                                                        >
                                                            Ruaj
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Anulo
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {(user?.role === 'admin' || user?.role === 'manager') && (
                                                            <button 
                                                                className="btn btn-sm btn-warning me-2"
                                                                onClick={() => handleEditStatus(donation)}
                                                            >
                                                                Statusi
                                                            </button>
                                                        )}
                                                        {(user?.role === 'admin' || user?.role === 'manager') && (
                                                            <button 
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(donation.id)}
                                                            >
                                                                Fshi
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
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

export default Donations;