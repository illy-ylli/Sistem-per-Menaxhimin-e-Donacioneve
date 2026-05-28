import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
            } catch (err) {
                console.error('Invalid token');
            }
        }
    }, []);

    const handleLogout = () => {
        // Revoko refresh token-in (pastrim i plotë)
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            // Thirr API për të revokuar refresh token-in në backend
            fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                },
                body: JSON.stringify({ refreshToken })
            }).catch(err => console.error('Logout API error:', err));
        }
        
        // Pastro të gjitha të dhënat lokale
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        sessionStorage.removeItem('user');
        
        toast.success('Jeni shkyçur me sukses');
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isAdmin = userRole === 'admin' || userRole === 'manager';
    
    // Rrugët bazuar në rol
    const fushataPath = isAdmin ? '/admin/campaigns' : '/user-campaigns';
    const donorsPath = isAdmin ? '/admin/donors' : '/user-donors';
    const volunteersPath = isAdmin ? '/admin/volunteers' : '/volunteers';
    const reportsPath = isAdmin ? '/admin/reports' : '/reports';

    const logoSrc = '/img/logo.png';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            flexWrap: 'wrap',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Logo */}
            <div onClick={() => handleNavigation('/dashboard')} style={{ cursor: 'pointer' }}>
                {!imgError ? (
                    <img src={logoSrc} alt="Logo" onError={() => setImgError(true)} style={{ height: '40px' }} />
                ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f40f68' }}>Charity</span>
                )}
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span onClick={() => handleNavigation('/dashboard')} style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                    DASHBOARD
                </span>
                <span onClick={() => handleNavigation(fushataPath)} style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                    FUSHATA
                </span>
                <span onClick={() => handleNavigation(donorsPath)} style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                    DONATORË
                </span>
                <span onClick={() => handleNavigation('/donations')} style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                    DONACIONET
                </span>
                
                {/* Linket vetëm për Admin/Manager */}
                {isAdmin && (
                    <>
                        <span onClick={() => handleNavigation(volunteersPath)} style={{ color: '#dc3545', fontWeight: '500', cursor: 'pointer' }}>
                            🤝 VULLNETARËT
                        </span>
                        <span onClick={() => handleNavigation('/admin/campaign-categories')} style={{ color: '#dc3545', fontWeight: '500', cursor: 'pointer' }}>
                            📁 KATEGORITË
                        </span>
                        <span onClick={() => handleNavigation(reportsPath)} style={{ color: '#dc3545', fontWeight: '500', cursor: 'pointer' }}>
                            📊 RAPORTET
                        </span>
                    </>
                )}
                
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1.2rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: '500'
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

            {/* Mobile menu button */}
            <button 
                onClick={toggleMenu} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.5rem', 
                    cursor: 'pointer', 
                    display: 'none' 
                }}
            >
                ☰
            </button>

            {/* Mobile menu dropdown */}
            {isMenuOpen && (
                <div style={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    marginTop: '1rem', 
                    gap: '0.8rem',
                    padding: '1rem 0',
                    borderTop: '1px solid #eee'
                }}>
                    <span onClick={() => handleNavigation('/dashboard')} style={{ cursor: 'pointer' }}>DASHBOARD</span>
                    <span onClick={() => handleNavigation(fushataPath)} style={{ cursor: 'pointer' }}>FUSHATA</span>
                    <span onClick={() => handleNavigation(donorsPath)} style={{ cursor: 'pointer' }}>DONATORË</span>
                    <span onClick={() => handleNavigation('/donations')} style={{ cursor: 'pointer' }}>DONACIONET</span>
                    {isAdmin && (
                        <>
                            <span onClick={() => handleNavigation(volunteersPath)} style={{ cursor: 'pointer', color: '#dc3545' }}>VULLNETARËT</span>
                            <span onClick={() => handleNavigation('/admin/campaign-categories')} style={{ cursor: 'pointer', color: '#dc3545' }}>KATEGORITË</span>
                            <span onClick={() => handleNavigation(reportsPath)} style={{ cursor: 'pointer', color: '#dc3545' }}>RAPORTET</span>
                        </>
                    )}
                    <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.3rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
                        Shkyçu
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;