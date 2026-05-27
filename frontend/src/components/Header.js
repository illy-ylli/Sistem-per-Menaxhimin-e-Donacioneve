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
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
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
    // Only ONE declaration for fushataPath (points to admin campaigns page)
    const fushataPath = isAdmin ? '/admin/campaigns' : '/user-campaigns';
    const donorsPath = isAdmin ? '/admin/donors' : '/user-donors';

    const logoSrc = '/img/logo.png';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            flexWrap: 'wrap'
        }}>
            {/* Logo */}
            <div onClick={() => handleNavigation('/dashboard')} style={{ cursor: 'pointer' }}>
                {!imgError ? (
                    <img src={logoSrc} alt="Logo" onError={() => setImgError(true)} style={{ height: '40px' }} />
                ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Charity</span>
                )}
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
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

            {/* Mobile menu button (hidden on desktop, can be made responsive later) */}
            <button onClick={toggleMenu} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}>
                ☰
            </button>

            {/* Mobile menu dropdown (visible only when toggled) */}
            {isMenuOpen && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
                    <span onClick={() => handleNavigation('/dashboard')}>DASHBOARD</span>
                    <span onClick={() => handleNavigation(fushataPath)}>FUSHATA</span>
                    <span onClick={() => handleNavigation(donorsPath)}>DONATORË</span>
                    <span onClick={() => handleNavigation('/donations')}>DONACIONET</span>
                    <button onClick={handleLogout}>Shkyçu</button>
                </div>
            )}
        </div>
    );
};

export default Header;