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
        e.preventDefault();
        
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
        <div className="donate-area relative section-gap" style={{minHeight: '100vh'}}>
            <div className="overlay overlay-bg"></div>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-6 col-sm-12 pb-80 header-text">
                        <h1 style={{color: 'white'}}>Hyni në Llogari</h1>
                        <p style={{color: 'white'}}>
                            Kyçu për të menaxhuar donacionet tuaja dhe për të ndjekur fushatat bamirëse.
                        </p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-6 contact-right">
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="row">
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
                                <div className="col-lg-12 d-flex flex-column">
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
                                <div className="col-lg-12 d-flex justify-content-end send-btn">
                                    <button 
                                        type="submit" 
                                        className="submit-btn primary-btn mt-20 text-uppercase"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Duke u kyçur...' : 'Kyçu'}
                                        <span className="lnr lnr-arrow-right"></span>
                                    </button>
                                </div>
                                <div className="col-lg-12 text-center mt-20">
                                    <p className="payment-method">
                                        Nuk keni llogari? <Link to="/register" >Regjistrohu këtu</Link>
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

export default Login;