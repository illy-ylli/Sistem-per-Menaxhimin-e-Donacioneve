import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';
import toast from 'react-hot-toast';

const DonorsList = () => {
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        loadDonors();
    }, []);
    
    const loadDonors = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/donors');
            setDonors(response.data.data || []);
        } catch (error) {
            console.error('Gabim:', error);
            toast.error('Gabim gjate ngarkimit te donatoreve');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <div className="container mt-5">
                    <h1 className="mb-4">Donatoret</h1>
                    
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Duke ngarkuar...</span>
                            </div>
                        </div>
                    ) : donors.length === 0 ? (
                        <div className="alert alert-info">Nuk ka donatore te regjistruar.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Emri</th>
                                        <th>Mbiemri</th>
                                        <th>Email</th>
                                        <th>Total i Dhuruar</th>
                                        <th>Nr. Donacioneve</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.map((donor) => (
                                        <tr key={donor.id}>
                                            <td>{donor.id}</td>
                                            <td>{donor.emri}</td>
                                            <td>{donor.mbiemri}</td>
                                            <td>{donor.email}</td>
                                            <td>€{parseFloat(donor.total_dhuruar || 0).toFixed(2)}</td>
                                            <td>{donor.donation_count || 0}</td>
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

export default DonorsList;