import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './custom.css';

// Import Bootstrap CSS for styling
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);