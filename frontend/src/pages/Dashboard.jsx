import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Register = () => {
    // gjendja e te dhenave te formes
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'user'
    });
    // gjendja e ngarkimit
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // per ridrejtim
    
    // ndryshimi i inputeve
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // dorzimi i formes
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // verifikimi i fushave te zbrazeta
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            toast.error('Ju lutem plotësoni të gjitha fushat');
            return;
        }
        
        // verifikimi i fjalekalimeve
        if (formData.password !== formData.confirmPassword) {
            toast.error('Fjalëkalimet nuk përputhen');
            return;
        }
        
        // verifikimi i gjatesise se fjalekalimit
        if (formData.password.length < 6) {
            toast.error('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // heq konfirmimin para regjistrimit
            const { confirmPassword, ...registerData } = formData;
            const result = await authService.register(registerData);
            toast.success(`Mirë se vini, ${result.user.firstName}!`);
            navigate('/dashboard'); // shko ne dashboard
        } catch (error) {
            toast.error(error.message || 'Regjistrimi dështoi. Email-i mund të jetë në përdorim.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="donate-area relative section-gap" style={{minHeight: '100vh'}}>
            <div className="overlay overlay-bg"></div>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-6 col-sm-12 pb-80 header-text">
                        <h1>Regjistrohu</h1>
                        <p style={{color: 'white'}}>
                            Krijo një llogari të re për të filluar dhurimin dhe për të ndihmuar të tjerët.
                        </p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-8 contact-right">
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 d-flex flex-column">
                                    <input 
                                        name="firstName" 
                                        placeholder="Emri" 
                                        onFocus={(e) => e.target.placeholder = ''} 
                                        onBlur={(e) => e.target.placeholder = 'Emri'} 
                                        className="form-control mt-20" 
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-lg-6 d-flex flex-column">
                                    <input 
                                        name="lastName" 
                                        placeholder="Mbiemri" 
                                        onFocus={(e) => e.target.placeholder = ''} 
                                        onBlur={(e) => e.target.placeholder = 'Mbiemri'} 
                                        className="form-control mt-20" 
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-lg-12 d-flex flex-column">
                                    <input 
                                        name="email" 
                                        placeholder="Email adresa" 
                                        onFocus={(e) => e.target.placeholder = ''} 
                                        onBlur={(e) => e.target.placeholder = 'Email adresa'} 
                                        className="form-control mt-20" 
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-lg-6 d-flex flex-column">
                                    <input 
                                        name="password" 
                                        placeholder="Fjalëkalimi" 
                                        onFocus={(e) => e.target.placeholder = ''} 
                                        onBlur={(e) => e.target.placeholder = 'Fjalëkalimi'} 
                                        className="form-control mt-20" 
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-lg-6 d-flex flex-column">
                                    <input 
                                        name="confirmPassword" 
                                        placeholder="Konfirmo fjalëkalimin" 
                                        onFocus={(e) => e.target.placeholder = ''} 
                                        onBlur={(e) => e.target.placeholder = 'Konfirmo fjalëkalimin'} 
                                        className="form-control mt-20" 
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-lg-12 d-flex justify-content-end send-btn">
                                    <button 
                                        type="submit" 
                                        className="submit-btn primary-btn mt-20 text-uppercase"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Duke u regjistruar...' : 'Regjistrohu'}
                                        <span className="lnr lnr-arrow-right"></span>
                                    </button>
                                </div>
                                <div className="col-lg-12 text-center mt-20">
                                    <p className="payment-method">
                                        Keni llogari? <Link to="/login">Hyni këtu</Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;