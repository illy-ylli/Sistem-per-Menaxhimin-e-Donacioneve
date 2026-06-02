import React, { useState, useEffect } from 'react';
import Header from '../components/Header';  // Shto këtë import
import campaignCategoryService from '../services/campaignCategoryService';
import toast from 'react-hot-toast';
import { handleError, showSuccess, showWarning } from '../utils/errorHandler';

const CampaignCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        emertimi: '',
        pershkrimi: '',
        ikona: '🎯',
        ngjyra: '#26a69a'
    });
    
    useEffect(() => {
        loadCategories();
    }, []);
    
    const loadCategories = async () => {
    setIsLoading(true);
    try {
        const response = await campaignCategoryService.getAll();
        setCategories(response.data);
    } catch (error) {
        handleError(error, 'Gabim gjate ngarkimit te kategorive');
    } finally {
        setIsLoading(false);
    }
};
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.emertimi.trim()) {
        toast.error('Emri i kategorise eshte i detyrueshem');
        return;
    }
    
    setIsLoading(true);
    
    try {
        if (editingId) {
            await campaignCategoryService.update(editingId, formData);
            showSuccess('Kategoria u perditesua me sukses!');
        } else {
            await campaignCategoryService.create(formData);
            showSuccess('Kategoria u krijua me sukses!');
        }
        
        setFormData({ emertimi: '', pershkrimi: '', ikona: '🎯', ngjyra: '#26a69a' });
        setEditingId(null);
        setShowForm(false);
        await loadCategories();
        
    } catch (error) {
        handleError(error, 'Gabim gjate ruajtjes se kategorise');
    } finally {
        setIsLoading(false);
    }
};
    
    const handleEdit = (category) => {
        setFormData({
            emertimi: category.emertimi,
            pershkrimi: category.pershkrimi || '',
            ikona: category.ikona || '🎯',
            ngjyra: category.ngjyra || '#26a69a'
        });
        setEditingId(category.id);
        setShowForm(true);
    };
    
    const handleDelete = async (id, emertimi) => {
    if (window.confirm(`A jeni i sigurt qe doni te fshini kategorine "${emertimi}"?`)) {
        setIsLoading(true);
        try {
            await campaignCategoryService.delete(id);
            showSuccess(`Kategoria "${emertimi}" u fshi me sukses!`);
            await loadCategories();
        } catch (error) {
            handleError(error, `Gabim gjate fshirjes se kategorise "${emertimi}"`);
        } finally {
            setIsLoading(false);
        }
    }
};
    
    return (
        <>
            <Header />  {}
            <div style={{ paddingTop: '80px' }}>  {}
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Menaxhimi i Kategorive të Fushatave</h1>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setFormData({ emertimi: '', pershkrimi: '', ikona: '🎯', ngjyra: '#26a69a' });
                                setEditingId(null);
                                setShowForm(!showForm);
                            }}
                        >
                            {showForm ? 'Anulo' : '+ Shto Kategori'}
                        </button>
                    </div>
                    
                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {editingId ? 'Përditëso Kategorinë' : 'Krijo Kategori të Re'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Emri i Kategorisë *</label>
                                            <input
                                                type="text"
                                                name="emertimi"
                                                className="form-control"
                                                value={formData.emertimi}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Ikona (Emoji)</label>
                                            <input
                                                type="text"
                                                name="ikona"
                                                className="form-control"
                                                value={formData.ikona}
                                                onChange={handleChange}
                                                placeholder="🎯"
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Ngjyra</label>
                                            <input
                                                type="color"
                                                name="ngjyra"
                                                className="form-control"
                                                value={formData.ngjyra}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Përshkrimi</label>
                                            <textarea
                                                name="pershkrimi"
                                                className="form-control"
                                                rows="3"
                                                value={formData.pershkrimi}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success">
                                                {editingId ? 'Përditëso' : 'Krijo'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Duke ngarkuar...</span>
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="alert alert-info">
                            Nuk ka kategori të regjistruara. Kliko "+ Shto Kategori" për të krijuar një të re.
                        </div>
                    ) : (
                        <div className="row">
                            {categories.map((category) => (
                                <div className="col-md-4 mb-3" key={category.id}>
                                    <div className="card h-100" style={{ borderTop: `4px solid ${category.ngjyra}` }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <span style={{ fontSize: '2rem' }}>{category.ikona}</span>
                                                    <h5 className="card-title mt-2">{category.emertimi}</h5>
                                                </div>
                                                <div>
                                                    <button 
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(category.id, category.emertimi)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            {category.pershkrimi && (
                                                <p className="card-text text-muted mt-2">{category.pershkrimi}</p>
                                            )}
                                            <small className="text-muted">
                                                ID: {category.id} | Krijuar: {new Date(category.createdAt).toLocaleDateString('sq-AL')}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CampaignCategories;