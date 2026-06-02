import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dashboardService from '../services/dashboardService';
import Header from '../components/Header';
import { handleError } from '../utils/errorHandler';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [stats, setStats] = useState({
        totalCollected: 0,
        donationCount: 0,
        activeCampaigns: 0,
        donorCount: 0,
        totalExpenses: 0,
        netAmount: 0,
        recentDonations: []
    });
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        loadDashboardStats();
    }, []);
    
    const loadDashboardStats = async () => {
        setIsLoading(true);
        try {
            const response = await dashboardService.getStats();
            console.log('Dashboard stats response:', response);
            
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                console.error('No data in response:', response);
            }
        } catch (error) {
            console.error('Gabim:', error);
            handleError(error, 'Gabim gjate ngarkimit te statistikave');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                {}
                <section className="banner-area relative" id="dashboard">
                    <div className="overlay overlay-bg"></div>
                    <div className="container">
                        <div className="row fullscreen align-items-center justify-content-start" style={{ height: '300px' }}>
                            <div className="banner-content col-lg-9 col-md-12">
                                <h1>
                                    Mirë se vini, <br />
                                    {user?.firstName} {user?.lastName}!
                                </h1>
                                <p className="text-white">
                                    Email: {user?.email} | Roli: {user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Menaxher' : 'Përdorues'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {}
                <section className="callto-area relative">
                    <div className="container">
                        <div className="row d-flex callto-wrap justify-content-between pt-40 pb-40">
                            <h3 className="text-white">Statistikat e Sistemit</h3>
                            <div className="row w-100 mt-4">
                                <div className="col-md-3 text-center">
                                    <h2 className="text-white">
                                        {isLoading ? '...' : `€${stats.totalCollected.toFixed(2)}`}
                                    </h2>
                                    <p className="text-white">Fonde të Mbledhura</p>
                                </div>
                                <div className="col-md-3 text-center">
                                    <h2 className="text-white">
                                        {isLoading ? '...' : stats.donationCount}
                                    </h2>
                                    <p className="text-white">Donacione Totale</p>
                                </div>
                                <div className="col-md-3 text-center">
                                    <h2 className="text-white">
                                        {isLoading ? '...' : stats.activeCampaigns}
                                    </h2>
                                    <p className="text-white">Fushata Aktive</p>
                                </div>
                                <div className="col-md-3 text-center">
                                    <h2 className="text-white">
                                        {isLoading ? '...' : stats.donorCount}
                                    </h2>
                                    <p className="text-white">Donatorë</p>
                                </div>
                            </div>
                            <div className="row w-100 mt-3">
                                <div className="col-md-4 text-center">
                                    <h4 className="text-white">
                                        {isLoading ? '...' : `€${stats.totalExpenses.toFixed(2)}`}
                                    </h4>
                                    <p className="text-white">Shpenzime</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h4 className="text-white">
                                        {isLoading ? '...' : `€${stats.netAmount.toFixed(2)}`}
                                    </h4>
                                    <p className="text-white">Fondi Neto</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h4 className="text-white">
                                        {isLoading ? '...' : stats.recentDonations.length}
                                    </h4>
                                    <p className="text-white">Donacione të Fundit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {}
                <section className="project-area section-gap">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8 pb-40 header-text">
                                <h1>Donacionet e Fundit</h1>
                                <p>Donacionet më të reja të bëra në platformë</p>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Duke ngarkuar...</span>
                                </div>
                            </div>
                        ) : stats.recentDonations.length === 0 ? (
                            <div className="alert alert-info text-center">
                                Nuk ka donacione të regjistruara ende.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Donatori</th>
                                            <th>Fushata</th>
                                            <th>Shuma</th>
                                            <th>Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentDonations.map((donation) => (
                                            <tr key={donation.id}>
                                                <td>
                                                    {donation.is_anonymous 
                                                        ? 'Anonim' 
                                                        : donation.Donor 
                                                            ? `${donation.Donor.emri || ''} ${donation.Donor.mbiemri || ''}`.trim() || donation.Donor.email
                                                            : `ID: ${donation.donor_id}`}
                                                </td>
                                                <td>
                                                    {donation.Campaign?.titulli || `ID: ${donation.campaign_id}`}
                                                </td>
                                                <td><strong>€{parseFloat(donation.shuma).toFixed(2)}</strong></td>
                                                <td>{new Date(donation.createdAt).toLocaleDateString('sq-AL')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;