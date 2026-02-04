import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const navigate = useNavigate();
    const { register, sendVerificationOtp, verifyEmailPre, googleLogin } = useAuth();

    const [loading, setLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [timer, setTimer] = useState(0);
    const [resendingOtp, setResendingOtp] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    }); 

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            toast.success('Welcome! 🎉');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google Login Failed');
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error('Please enter your email first');
            return;
        }
        setLoading(true);
        try {
            await sendVerificationOtp(formData.email);
            setOtpSent(true);
            setTimer(30); // Start cooldown
            toast.success('OTP sent to your email!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendingOtp(true);
        try {
            await sendVerificationOtp(formData.email);
            setTimer(30);
            toast.success('OTP Resent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }
        setVerifyingOtp(true);
        try {
            await verifyEmailPre(formData.email, otp);
            setEmailVerified(true);
            setOtpSent(false); // Hide OTP field
            toast.success('Email verified successfully! 🎉');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            toast.error('Please verify your email address first');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.phone);
            toast.success('Account created successfully! 🎉');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                    <h1>Create Account</h1>
                    <p>Join Sabjiwala for fresh produce</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="text"
                                name="name"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

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
                                style={{ paddingLeft: '48px', paddingRight: '100px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                disabled={emailVerified || otpSent}
                            />

                            {!emailVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading || otpSent || !formData.email}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '4px 12px',
                                        fontSize: '0.8rem',
                                        borderRadius: '4px',
                                        background: otpSent ? '#94a3b8' : 'var(--primary)',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {loading ? 'Sending...' : otpSent ? 'Sent' : 'Verify'}
                                </button>
                            )}

                            {emailVerified && (
                                <FiCheckCircle style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#10b981',
                                    fontSize: '20px'
                                }} />
                            )}
                        </div>
                        {emailVerified && <small style={{ color: '#10b981', marginLeft: '4px' }}>Email Verified</small>}
                    </div>

                    {otpSent && !emailVerified && (
                        <div className="input-group" style={{
                            background: '#f8fafc',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginTop: '-10px',
                            marginBottom: '16px'
                        }}>
                            <label style={{ fontSize: '0.9rem' }}>Enter Verification Code</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="6-digit code"
                                    className="input"
                                    style={{ textAlign: 'center', letterSpacing: '2px' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    className="btn btn-primary"
                                    disabled={verifyingOtp}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {verifyingOtp ? '...' : 'Confirm'}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {timer > 0 ? (
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Resend in {timer}s</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                            disabled={resendingOtp}
                                        >
                                            {resendingOtp ? 'Resending...' : 'Resend OTP'}
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <FiPhone style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="tel"
                                name="phone"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
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
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
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
                                name="confirmPassword"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={!emailVerified || loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
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
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
