import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserDonors = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const token = Cookies.get('accessToken');
                const response = await axios.get('http://localhost:5000/api/donors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDonors(response.data.data);
            } catch (error) {
                console.error('Failed to fetch donors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonors();
    }, []);

    if (loading) return (
        <>
            <Header />
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading donors...</div>
        </>
    );

    return (
        <>
            <Header />
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Donatorët</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Emri</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Mbiemri</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Telefoni</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Adresa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.map(donor => (
                            <tr key={donor.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{donor.id}</td>
                                <td style={{ padding: '12px' }}>{donor.emri}</td>
                                <td style={{ padding: '12px' }}>{donor.mbiemri}</td>
                                <td style={{ padding: '12px' }}>{donor.email}</td>
                                <td style={{ padding: '12px' }}>{donor.telefoni || '-'}</td>
                                <td style={{ padding: '12px' }}>{donor.adresa || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserDonors;