import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Header from '../components/Header';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    
    return (
        <>
            {/* Header costum me SHKYQU buton */}
            <Header />
            
            {/* vendosja e padding ne fillim so permbajtja e dashboard nuk mshefet perfundi header */}
            <div style={{ paddingTop: '80px' }}>
                {/* Mire se vini Banner */}
                <section className="banner-area relative" id="dashboard">
                    <div className="overlay overlay-bg"></div>
                    <div className="container">
                        <div className="row fullscreen align-items-center justify-content-start" style={{ height: '400px' }}>
                            <div className="banner-content col-lg-9 col-md-12">
                                <h1>
                                    Mirë se vini, <br />
                                    {user?.firstName} {user?.lastName}!
                                </h1>
                                <p className="text-white">
                                    Email: {user?.email} | Roli: {user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Menaxher' : 'Përdorues'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistikat Sektori*/}
                <section className="callto-area relative">
                    <div className="container">
                        <div className="row d-flex callto-wrap justify-content-between pt-40 pb-40">
                            <h3 className="text-white">Statistikat e Sistemit</h3>
                            <div className="row w-100 mt-4">
                                <div className="col-md-4 text-center">
                                    <h2 className="text-white">0</h2>
                                    <p className="text-white">Donacione Totale</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h2 className="text-white">0</h2>
                                    <p className="text-white">Fushata Aktive</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h2 className="text-white">0</h2>
                                    <p className="text-white">Donatorë</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon Sektori */}
                <section className="project-area section-gap">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8 pb-80 header-text">
                                <h1>Funksionalitetet në Zhvillim</h1>
                                <p>
                                    Menaxhimi i fushatave, donatorëve, donacioneve dhe shpenzimeve do të jenë të disponueshme në Java 2.
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="single-project">
                                    <div className="content">
                                        <div className="content-overlay"></div>
                                        <div className="content-details fadeIn-bottom">
                                            <h4 className="text-white">Fushata</h4>
                                        </div>
                                    </div>
                                    <div className="details text-center mt-3">
                                        <h5>Menaxhimi i Fushatave</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="single-project">
                                    <div className="content">
                                        <div className="content-overlay"></div>
                                        <div className="content-details fadeIn-bottom">
                                            <h4 className="text-white">Donatorët</h4>
                                        </div>
                                    </div>
                                    <div className="details text-center mt-3">
                                        <h5>Menaxhimi i Donatorëve</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="single-project">
                                    <div className="content">
                                        <div className="content-overlay"></div>
                                        <div className="content-details fadeIn-bottom">
                                            <h4 className="text-white">Donacionet</h4>
                                        </div>
                                    </div>
                                    <div className="details text-center mt-3">
                                        <h5>Gjurmimi i Donacioneve</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="single-project">
                                    <div className="content">
                                        <div className="content-overlay"></div>
                                        <div className="content-details fadeIn-bottom">
                                            <h4 className="text-white">Raportet</h4>
                                        </div>
                                    </div>
                                    <div className="details text-center mt-3">
                                        <h5>Raporte Financiare</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;