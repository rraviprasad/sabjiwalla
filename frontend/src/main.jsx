import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'


import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';


// Configure Axios Base URL
// In production, VITE_API_URL should be set to your deployed backend URL.
// In development, it falls back to '/api' which is proxied by Vite.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'; 



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID"}>
                <AuthProvider>
                    <CartProvider>
                        <App />
                        <Toaster
                            position="bottom-center"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    padding: '16px',
                                },
                            }}
                        />
                    </CartProvider>
                </AuthProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
