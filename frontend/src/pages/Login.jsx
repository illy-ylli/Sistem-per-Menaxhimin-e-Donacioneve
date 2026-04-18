import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
    // State per te ruajtur te dhenat a formularit
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    // State per treguesin e ngarkimit(loading)
    const [isLoading, setIsLoading] = useState(false);
    
    // Hook per mu navigu permes faqeve
    const navigate = useNavigate();
    
    // Trajton ndryshimet ne inpute
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // Trajton dergimin e formularit
    const handleSubmit = async (e) => {
        e.preventDefault();  // Parandalon rifreskimin e faqes
        
        // Validimi
        if (!formData.email || !formData.password) {
            toast.error('Ju lutem plotësoni të gjitha fushat');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Thirr API per identifikim
            const result = await authService.login(formData);
            
            // Shfaq mesazh suksesi
            toast.success(`Mirë se vini, ${result.user.firstName}!`);
            
            // Ridrejto ne dashboard
            navigate('/dashboard');
            
        } catch (error) {
            // Shfaq mesazh gabimi
            toast.error(error.message || 'Login dështoi. Kontrolloni email dhe fjalëkalimin.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Sistem për Menaxhim të Donacioneve</h2>
                            <h4 className="text-center text-muted mb-4">Hyni në llogari</h4>
                            
                            <form onSubmit={handleSubmit}>
                                {/* Fusha Email */}
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Fusha Fjalkalim */}
                                <div className="mb-3">
                                    <label className="form-label">Fjalëkalim</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Butoni i Dergimit */}
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Duke u kyçur...' : 'Kyçu'}
                                </button>
                                
                                {/* Lidhja per Regjistrim */}
                                <div className="text-center mt-3">
                                    <Link to="/register" className="text-decoration-none">
                                        Nuk keni llogari? Regjistrohu
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;