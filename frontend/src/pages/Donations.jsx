import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DonationCheckout from '../components/DonationCheckout';
import donationService from '../services/donationService';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { handleError, showSuccess } from '../utils/errorHandler';

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [campaignId, setCampaignId] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [metodaPageses, setMetodaPageses] = useState('karte_krediti');
    const [filterCampaign, setFilterCampaign] = useState('');
    const [filterDonor, setFilterDonor] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [statusFormData, setStatusFormData] = useState({ statusi: '' });
    
    const user = authService.getCurrentUser();
    const isAdmin = user?.role === 'admin' || user?.role === 'manager';
    
    useEffect(() => {
        loadDonations();
    }, []);
    
    const loadDonations = async () => {
        setIsLoading(true);
        try {
            const response = await donationService.getAll();
            setDonations(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            handleError(error, 'Gabim gjate ngarkimit te donacioneve');
            setDonations([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDonationSuccess = async () => {
        setShowCheckout(false);
        setDonationAmount('');
        setCampaignId('');
        setMessage('');
        setIsAnonymous(false);
        await loadDonations();
    };
    
    const handleEditStatus = (donation) => {
        setEditingId(donation.id);
        setStatusFormData({ statusi: donation.statusi });
    };
    
    const handleUpdateStatus = async () => {
        try {
            await donationService.updateStatus(editingId, statusFormData.statusi);
            showSuccess('Statusi i donacionit u perditesua');
            setEditingId(null);
            loadDonations();
        } catch (error) {
            handleError(error, 'Gabim gjate perditesimit te statusit');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni i sigurt qe doni te fshini kete donacion?')) {
            try {
                await donationService.delete(id);
                showSuccess('Donacioni u fshi me sukses');
                loadDonations();
            } catch (error) {
                handleError(error, 'Gabim gjate fshirjes se donacionit');
            }
        }
    };
    
    const getStatusBadge = (statusi) => {
        const statuses = {
            'pending': { text: 'Ne pritje', class: 'bg-warning' },
            'completed': { text: 'I perfunduar', class: 'bg-success' },
            'failed': { text: 'Deshtoi', class: 'bg-danger' },
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
                    <h1 className="mb-4">Menaxhimi i Donacioneve</h1>
                    
                    {isAdmin && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-5">
                                        <label className="form-label">Filtro sipas Fushatës (ID)</label>
                                        <input type="number" className="form-control" placeholder="ID e fushatës" value={filterCampaign} onChange={(e) => setFilterCampaign(e.target.value)} />
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label">Filtro sipas Donatorit (ID)</label>
                                        <input type="number" className="form-control" placeholder="ID e donatorit" value={filterDonor} onChange={(e) => setFilterDonor(e.target.value)} />
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button className="btn btn-secondary w-100" onClick={loadDonations}>Filtro</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{showCheckout ? 'Pagesa me Kartë Krediti' : 'Bëni Donacion'}</h5>
                            
                            {!showCheckout ? (
                                <form>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">ID e Fushatës *</label>
                                            <input type="number" className="form-control" placeholder="ID e fushatës" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} required />
                                            <small className="text-muted">Shkruani ID-në e fushatës ku doni të dhuroni</small>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Shuma (€) *</label>
                                            <input type="number" step="10" className="form-control" placeholder="Shuma" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} required min="1" />
                                        </div>
                                        <div className="col-md-5 mb-3">
                                            <label className="form-label">Metoda e Pagesës</label>
                                            <select className="form-select" value={metodaPageses} onChange={(e) => setMetodaPageses(e.target.value)}>
                                                <option value="karte_krediti">Karte Krediti (Stripe)</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank_transfer">Transferte Bankare</option>
                                                <option value="cash">Cash</option>
                                                <option value="other">Tjeter</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Mesazhi (Opsional)</label>
                                            <textarea className="form-control" rows="2" placeholder="Faleminderit per punen tuaj..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                                                <label className="form-check-label">Donacion Anonim (nuk shfaqet emri im publikisht)</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="button" className="btn btn-primary" onClick={() => {
                                                if (!campaignId || !donationAmount) {
                                                    toast.error('Ju lutem plotesoni fushat e detyrueshme');
                                                    return;
                                                }
                                                if (parseFloat(donationAmount) <= 0 || parseFloat(donationAmount) < 1) {
                                                    toast.error('Shuma minimale e donacionit eshte 1€');
                                                    return;
                                                }
                                                setShowCheckout(true);
                                            }}>
                                                Vazhdo te Pagesa
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <DonationCheckout 
                                    amount={parseFloat(donationAmount)}
                                    campaignId={campaignId}
                                    donorName={user ? `${user.firstName} ${user.lastName}` : 'Donator'}
                                    donorEmail={user?.email || ''}
                                    isAnonymous={isAnonymous}
                                    onSuccess={handleDonationSuccess}
                                    onClose={() => setShowCheckout(false)}
                                />
                            )}
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Duke ngarkuar...</span></div></div>
                    ) : donations.length === 0 ? (
                        <div className="alert alert-info">Nuk keni bere asnje donacion ende. Perdorni formularin me lart per te dhuruar!</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr><th>ID</th><th>Fushata</th><th>Shuma</th><th>Data</th><th>Metoda</th><th>Statusi</th><th>Mesazhi</th>{isAdmin && <th>Donatori ID</th>}{isAdmin && <th>Veprimet</th>}</tr>
                                </thead>
                                <tbody>
                                    {donations.map((donation) => (
                                        <tr key={donation.id}>
                                            <td>{donation.id}</td><td>{donation.campaign_id}</td>
                                            <td><strong>€{parseFloat(donation.shuma).toFixed(2)}</strong></td>
                                            <td>{new Date(donation.createdAt).toLocaleDateString('sq-AL')}</td>
                                            <td>{donation.metoda_pageses}</td>
                                            <td>{getStatusBadge(donation.statusi)}</td>
                                            <td>{donation.mesazhi || '-'}</td>
                                            {isAdmin && <td>{donation.donor_id}</td>}
                                            {isAdmin && (
                                                <td>
                                                    {editingId === donation.id ? (
                                                        <div className="d-flex" style={{ gap: '5px' }}>
                                                            <select className="form-select form-select-sm" value={statusFormData.statusi} onChange={(e) => setStatusFormData({ statusi: e.target.value })} style={{ width: '120px' }}>
                                                                <option value="pending">Ne pritje</option>
                                                                <option value="completed">I perfunduar</option>
                                                                <option value="failed">Deshtoi</option>
                                                                <option value="refunded">Rimbursuar</option>
                                                            </select>
                                                            <button className="btn btn-sm btn-success" onClick={handleUpdateStatus}>Ruaj</button>
                                                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Anulo</button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditStatus(donation)}>Statusi</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(donation.id)}>Fshi</button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
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