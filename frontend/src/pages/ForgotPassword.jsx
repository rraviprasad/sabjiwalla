import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(0);

    const [otpVerified, setOtpVerified] = useState(false); 

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password', { email });
            setOtpSent(true);
            setTimer(30);
            toast.success('OTP sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'User not found');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP");

        setLoading(true);
        try {
            await axios.post('/api/auth/verify-reset-otp', { email, otp });
            setOtpVerified(true);
            toast.success('OTP Verified Successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/auth/reset-password', { email, otp, password });
            toast.success('Password reset successfully! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    let title = 'Forgot Password? 🔒';
    let subtitle = "Enter your email and we'll send you a verification code.";

    if (otpSent && !otpVerified) {
        title = 'Verify OTP 📨';
        subtitle = `Enter the 6-digit code sent to ${email}`;
    } else if (otpVerified) {
        title = 'Reset Password 🔐';
        subtitle = "Create a new password that you won't forget.";
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">{title}</h1>
                <p className="auth-subtitle" style={{ wordBreak: 'break-all' }}>{subtitle}</p>

                {!otpSent && (
                    <form onSubmit={handleSendOtp} className="auth-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input"
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>
                )}

                {otpSent && !otpVerified && (
                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <div className="input-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="input"
                                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {timer > 0 ? (
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Resend in {timer}s</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setOtpSent(false); setOtp(''); }}
                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>
                )}

                {otpVerified && (
                    <form onSubmit={handleResetSubmit} className="auth-form">
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="input"
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="input"
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', textDecoration: 'none' }}>
                        <FiArrowLeft /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
