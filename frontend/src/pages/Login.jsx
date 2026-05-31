import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { handleError, showSuccess } from '../utils/errorHandler';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Fshije errorin kur fillon me shkru
        if (error) setError('');
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
        toast.error('Ju lutem plotesoni te gjitha fushat');
        return;
    }
    
    setIsLoading(true);
    
    try {
        const result = await authService.login(formData);
        showSuccess(`Mire se vini, ${result.user.firstName}!`);
        navigate('/dashboard');
    } catch (error) {
        handleError(error, 'Login deshtoi. Kontrolloni email dhe fjalekalimin.');
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
                        <h1 style={{ color: 'white' }}>Hyni në Llogari</h1>
                        <p style={{ color: 'white' }}>
                            Kyçu për të menaxhuar donacionet tuaja dhe për të ndjekur fushatat bamirëse.
                        </p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-6 contact-right">
                        
                        {/* Error Popup - shfaqet kur login  deshton */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{
                                backgroundColor: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                borderRadius: '10px',
                                padding: '15px',
                                marginBottom: '20px',
                                color: '#721c24'
                            }}>
                                <strong>Gabim!</strong> {error}
                                <button 
                                    type="button" 
                                    className="close" 
                                    onClick={() => setError('')}
                                    style={{
                                        float: 'right',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: '#721c24'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        
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
                                        style={{
                                            opacity: isLoading ? '0.7' : '1',
                                            cursor: isLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isLoading ? 'Duke u kyçur...' : 'Kyçu'}
                                        <span className="lnr lnr-arrow-right"></span>
                                    </button>
                                </div>
                                <div className="col-lg-12 text-center mt-20">
                                    <p className="payment-method" style={{ color: 'white' }}>
                                        Nuk keni llogari? <Link to="/register" style={{ color: '#fb115f' }}>Regjistrohu këtu</Link>
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