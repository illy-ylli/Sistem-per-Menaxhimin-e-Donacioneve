import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const user = authService.getCurrentUser();
    
    const handleLogout = async () => {
        await authService.logout();
        toast.success('Jeni shkyçur me sukses');
        navigate('/login');
    };
    
    const handleNavigation = (path) => {
        navigate(path);
    };
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <header style={{
            backgroundColor: 'white',
            padding: '15px 0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    {/* Logo */}
                    <div className="logo">
                        <div onClick={() => handleNavigation('/dashboard')} style={{ cursor: 'pointer' }}>
                            {!imgError ? (
                                <img 
                                    src="/img/logo.png" 
                                    alt="Logo" 
                                    style={{ height: '30px' }}
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f41665' }}>
                                    Charity
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '25px'
                    }}>
                        <nav style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '25px'
                        }}>
                            <span 
                                onClick={() => handleNavigation('/dashboard')}
                                style={{ 
                                    color: '#333', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >DASHBOARD</span>
                            
                            <span 
                                onClick={() => handleNavigation('/campaign-categories')}
                                style={{ 
                                    color: '#333', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >FUSHATA</span>
                            
                            <span 
                                onClick={() => handleNavigation('/donors')}
                                style={{ 
                                    color: '#333', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >DONATORË</span>
                            
                            <span 
                                onClick={() => handleNavigation('/donations')}
                                style={{ 
                                    color: '#333', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >DONACIONET</span>
                        </nav>
                        
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'linear-gradient(0deg, #dc3545 0%, #ff6b6b 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 5px 15px rgba(220,53,69,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Shkyçu
                        </button>
                    </div>
                    
                    {/* Butoni per menune mobile */}
                    <button
                        onClick={toggleMenu}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ☰
                    </button>
                </div>
                
                {/* Menuja mobile */}
                {isMenuOpen && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        padding: '20px',
                        backgroundColor: 'white',
                        marginTop: '15px',
                        borderTop: '1px solid #eee'
                    }}>
                        <span 
                            onClick={() => {
                                handleNavigation('/dashboard');
                                setIsMenuOpen(false);
                            }}
                            style={{ color: '#333', cursor: 'pointer', fontWeight: '500' }}
                        >DASHBOARD</span>
                        <span 
                            onClick={() => {
                                handleNavigation('/campaign-categories');
                                setIsMenuOpen(false);
                            }}
                            style={{ color: '#333', cursor: 'pointer', fontWeight: '500' }}
                        >FUSHATA</span>
                        <span 
                            onClick={() => {
                                handleNavigation('/donors');
                                setIsMenuOpen(false);
                            }}
                            style={{ color: '#333', cursor: 'pointer', fontWeight: '500' }}
                        >DONATORË</span>
                        <span 
                            onClick={() => {
                                handleNavigation('/donations');
                                setIsMenuOpen(false);
                            }}
                            style={{ color: '#333', cursor: 'pointer', fontWeight: '500' }}
                        >DONACIONET</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Shkyçu
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;