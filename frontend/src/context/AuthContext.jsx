import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('sabjiwala_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setLoading(false);
    }, []); 

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('sabjiwala_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (name, email, password, phone) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password, phone });

        // Only log in if token is returned (backward compatibility/if verification disabled)
        if (data.token) {
            setUser(data);
            localStorage.setItem('sabjiwala_user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        return data;
    };

    const sendVerificationOtp = async (email) => {
        const { data } = await axios.post('/api/auth/send-verification-otp', { email });
        return data;
    };

    const verifyEmailPre = async (email, otp) => {
        const { data } = await axios.post('/api/auth/verify-email-pre', { email, otp });
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sabjiwala_user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (profileData) => {
        const { data } = await axios.put('/api/auth/profile', profileData);
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('sabjiwala_user', JSON.stringify(updatedUser));
        return data;
    };

    const googleLogin = async (token) => {
        const { data } = await axios.post('/api/auth/google', { token });
        setUser(data);
        localStorage.setItem('sabjiwala_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const value = {
        user,
        loading,
        login,
        register,
        sendVerificationOtp,
        verifyEmailPre,
        logout,
        updateProfile,
        googleLogin,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
