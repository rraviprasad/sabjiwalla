import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    }); 

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            toast.success('Welcome back! 👋');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google Login Failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back! 👋');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>
                        🥬
                    </Link>
                    <h1>Welcome Back!</h1>
                    <p>Sign in to continue shopping</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="email"
                                name="email"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="password"
                                name="password"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider" style={{ margin: '20px 0', textAlign: 'center', color: '#64748b' }}>OR</div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', width: '100%' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            toast.error('Google Login Failed');
                        }}
                        useOneTap
                        width="100%"
                    />
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
