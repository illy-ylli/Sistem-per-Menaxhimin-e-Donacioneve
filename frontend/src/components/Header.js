import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate(); // per navigim
    const [isMenuOpen, setIsMenuOpen] = useState(false); // gjendja e menuse mobile
    const user = authService.getCurrentUser(); // merr perdoruesin aktual
    
    // funksioni per shkycje
    const handleLogout = async () => {
        await authService.logout();
        toast.success('Jeni shkyçur me sukses');
        navigate('/login');
    };
    
    // ndrron menune mobile
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
                    alignItems: 'center'
                }}>
                    {/* Logo */}
                    <div className="logo" style={{ flex: '1', textAlign: 'left' }}>
                        <a href="#">
                            <img 
                                src="/img/logo.png" 
                                alt="Logo" 
                                style={{ height: '30px' }}
                            />
                        </a>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '25px',
                        margin: '0 auto'
                    }}>
                        <nav style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '25px'
                        }}>
                            <a href="#dashboard" style={{ 
                                color: '#333', 
                                textDecoration: 'none',
                                lineHeight: '1',
                                padding: '8px 0'
                            }}>Dashboard</a>
                            <a href="#campaigns" style={{ 
                                color: '#333', 
                                textDecoration: 'none',
                                lineHeight: '1',
                                padding: '8px 0'
                            }}>Fushata</a>
                            <a href="#donors" style={{ 
                                color: '#333', 
                                textDecoration: 'none',
                                lineHeight: '1',
                                padding: '8px 0'
                            }}>Donatorë</a>
                            <a href="#donations" style={{ 
                                color: '#333', 
                                textDecoration: 'none',
                                lineHeight: '1',
                                padding: '8px 0'
                            }}>Donacionet</a>
                            </nav>
                            <div style={{ flex: '1', textAlign: 'right' }}></div>
                            {/* Butoni i shkycjes */}
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
                        marginTop: '15px'
                    }}>
                        <a href="#dashboard" style={{ color: '#333', textDecoration: 'none' }}>Dashboard</a>
                        <a href="#campaigns" style={{ color: '#333', textDecoration: 'none' }}>Fushata</a>
                        <a href="#donors" style={{ color: '#333', textDecoration: 'none' }}>Donatorë</a>
                        <a href="#donations" style={{ color: '#333', textDecoration: 'none' }}>Donacionet</a>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '25px',
                                cursor: 'pointer'
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