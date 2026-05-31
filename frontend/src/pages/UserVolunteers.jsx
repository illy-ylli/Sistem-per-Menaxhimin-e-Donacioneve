import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token = Cookies.get('accessToken');
                const response = await axios.get('http://localhost:5000/api/volunteers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVolunteers(response.data.data);
            } catch (error) {
                console.error('Failed to fetch volunteers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, []);

    if (loading) return <><Header /><div style={{ textAlign: 'center', padding: '2rem' }}>Loading volunteers...</div></>;

    return (
        <>
            <Header />
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Vullnetarët</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Emri</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Mbiemri</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Telefoni</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Statusi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map(v => (
                            <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{v.id}</td>
                                <td style={{ padding: '12px' }}>{v.emri}</td>
                                <td style={{ padding: '12px' }}>{v.mbiemri}</td>
                                <td style={{ padding: '12px' }}>{v.email}</td>
                                <td style={{ padding: '12px' }}>{v.telefoni || '-'}</td>
                                <td style={{ padding: '12px' }}>{v.statusi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserVolunteers;