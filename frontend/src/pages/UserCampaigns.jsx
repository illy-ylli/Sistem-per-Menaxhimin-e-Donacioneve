import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = Cookies.get('accessToken');
                const response = await axios.get('http://localhost:5000/api/campaigns', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCampaigns(response.data.data);
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('sq-AL');
    };

    if (loading) return (
        <>
            <Header />
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading campaigns...</div>
        </>
    );

    return (
        <>
            <Header />
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Fushata Donacionesh</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Titulli</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Target (€)</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Mbledhur (€)</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Statusi</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Data Fillimit</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Data Mbarimit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(campaign => (
                            <tr key={campaign.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{campaign.id}</td>
                                <td style={{ padding: '12px' }}>{campaign.titulli}</td>
                                <td style={{ padding: '12px' }}>{campaign.shuma_target}</td>
                                <td style={{ padding: '12px' }}>{campaign.shuma_mbledhur}</td>
                                <td style={{ padding: '12px' }}>{campaign.statusi}</td>
                                <td style={{ padding: '12px' }}>{formatDate(campaign.data_fillimit)}</td>
                                <td style={{ padding: '12px' }}>{formatDate(campaign.data_perfundimit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserCampaigns;