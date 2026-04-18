import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Register = () => {
    // State per te ruajtur te dhenat e formularit
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'user'  // Roli i paracaktuar
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validimi
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            toast.error('Ju lutem plotësoni të gjitha fushat');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Fjalëkalimet nuk përputhen');
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Hiq confirmPassword para se te dergohet te API
            const { confirmPassword, ...registerData } = formData;
            
            // Thirr API per regjistrim
            const result = await authService.register(registerData);
            
            // Shfaq mesazh suksesi
            toast.success(`Mirë se vini, ${result.user.firstName}!`);
            
            // Dergo ne dashboard
            navigate('/dashboard');
            
        } catch (error) {
            toast.error(error.message || 'Regjistrimi dështoi. Email-i mund të jetë në përdorim.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Regjistrohu</h2>
                            
                            <form onSubmit={handleSubmit}>
                                {/* Emri */}
                                <div className="mb-3">
                                    <label className="form-label">Emri</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-control"
                                        placeholder="Emri juaj"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Mbiemri */}
                                <div className="mb-3">
                                    <label className="form-label">Mbiemri</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-control"
                                        placeholder="Mbiemri juaj"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Email */}
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
                                
                                {/* Fjalkalim */}
                                <div className="mb-3">
                                    <label className="form-label">Fjalëkalim</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Të paktën 6 karaktere"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Konfirmo Fjalkalimin */}
                                <div className="mb-3">
                                    <label className="form-label">Konfirmo Fjalëkalimin</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Shkruani përsëri fjalëkalimin"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                
                                {/* Roli (i fshehur nga perdoruesit normal) */}
                                <input type="hidden" name="role" value={formData.role} />
                                
                                {/* Butoni i Dergimit */}
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Duke u regjistruar...' : 'Regjistrohu'}
                                </button>
                                
                                {/* Lidhja per Kyçje */}
                                <div className="text-center mt-3">
                                    <Link to="/login" className="text-decoration-none">
                                        Keni llogari? Hyni
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

export default Register;