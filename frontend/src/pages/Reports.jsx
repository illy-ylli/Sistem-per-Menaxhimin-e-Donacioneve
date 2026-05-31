import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Reports = () => {
    const [donationsPerCampaign, setDonationsPerCampaign] = useState([]);
    const [topDonors, setTopDonors] = useState([]);
    const [expensesPerCampaign, setExpensesPerCampaign] = useState([]);
    const [campaignSummary, setCampaignSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('donations');

    const token = Cookies.get('accessToken');
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        fetchAllReports();
    }, []);

    const fetchAllReports = async () => {
        setLoading(true);
        try {
            const [donationsRes, donorsRes, expensesRes, summaryRes] = await Promise.all([
                api.get('/reports/donations-per-campaign'),
                api.get('/reports/top-donors'),
                api.get('/reports/expenses-per-campaign'),
                api.get('/reports/campaign-summary')
            ]);
            setDonationsPerCampaign(donationsRes.data.data || []);
            setTopDonors(donorsRes.data.data || []);
            setExpensesPerCampaign(expensesRes.data.data || []);
            setCampaignSummary(summaryRes.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Gabim gjatë ngarkimit të raporteve');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Duke ngarkuar...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <h1 className="mb-4">Raporte</h1>

                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
                                Donacionet për Fushatë
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'donors' ? 'active' : ''}`} onClick={() => setActiveTab('donors')}>
                                Donatorët Kryesorë
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
                                Shpenzimet për Fushatë
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
                                Përmbledhje e Fushatave
                            </button>
                        </li>
                    </ul>

                    {/* Tab content */}
                    <div className="tab-content">
                        {/* Donations per campaign */}
                        {activeTab === 'donations' && (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID Fushatë</th>
                                            <th>Titulli</th>
                                            <th>Target (€)</th>
                                            <th>Total i Dhuruar (€)</th>
                                            <th>Numri i Donacioneve</th>
                                            <th>Përqindja</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donationsPerCampaign.map(item => (
                                            <tr key={item.campaign_id}>
                                                <td>{item.campaign_id}</td>
                                                <td>{item.campaign?.titulli || '-'}</td>
                                                <td>{item.campaign?.shuma_target || 0}</td>
                                                <td><strong>{parseFloat(item.total_donated || 0).toFixed(2)}</strong></td>
                                                <td>{item.donation_count || 0}</td>
                                                <td>
                                                    {item.campaign?.shuma_target > 0 
                                                        ? ((item.total_donated / item.campaign.shuma_target) * 100).toFixed(1) + '%'
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                        {donationsPerCampaign.length === 0 && (
                                            <tr><td colSpan="6" className="text-center">Nuk ka donacione për asnjë fushatë.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Top donors */}
                        {activeTab === 'donors' && (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID Donatori</th>
                                            <th>Emri</th>
                                            <th>Mbiemri</th>
                                            <th>Email</th>
                                            <th>Total i Dhuruar (€)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topDonors.map(item => (
                                            <tr key={item.donor_id}>
                                                <td>{item.donor_id}</td>
                                                <td>{item.donor?.emri || '-'}</td>
                                                <td>{item.donor?.mbiemri || '-'}</td>
                                                <td>{item.donor?.email || '-'}</td>
                                                <td><strong>{parseFloat(item.total_donated || 0).toFixed(2)}</strong></td>
                                            </tr>
                                        ))}
                                        {topDonors.length === 0 && (
                                            <tr><td colSpan="5" className="text-center">Nuk ka donatorë të regjistruar.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Expenses per campaign */}
                        {activeTab === 'expenses' && (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID Fushatë</th>
                                            <th>Titulli</th>
                                            <th>Total Shpenzime (€)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expensesPerCampaign.map(item => (
                                            <tr key={item.campaign_id}>
                                                <td>{item.campaign_id}</td>
                                                <td>{item.expense_campaign?.titulli || '-'}</td>
                                                <td><strong>{parseFloat(item.total_expenses || 0).toFixed(2)}</strong></td>
                                            </tr>
                                        ))}
                                        {expensesPerCampaign.length === 0 && (
                                            <tr><td colSpan="3" className="text-center">Nuk ka shpenzime të regjistruara.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Campaign summary */}
                        {activeTab === 'summary' && (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Titulli</th>
                                            <th>Target (€)</th>
                                            <th>I Mbledhur (€)</th>
                                            <th>Shpenzime (€)</th>
                                            <th>Fondi Neto (€)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaignSummary.map(campaign => (
                                            <tr key={campaign.id}>
                                                <td>{campaign.id}</td>
                                                <td>{campaign.titulli}</td>
                                                <td>{campaign.shuma_target}</td>
                                                <td>{campaign.shuma_mbledhur}</td>
                                                <td>{campaign.total_expenses || 0}</td>
                                                <td>
                                                    <strong>{parseFloat(campaign.net_funds || 0).toFixed(2)}</strong>
                                                </td>
                                            </tr>
                                        ))}
                                        {campaignSummary.length === 0 && (
                                            <tr><td colSpan="6" className="text-center">Nuk ka fushata të regjistruara.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reports;