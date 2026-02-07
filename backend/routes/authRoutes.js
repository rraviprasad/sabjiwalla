import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/send-verification-otp
// @desc    Send OTP for pre-registration verification
// @access  Public
router.post('/send-verification-otp', async (req, res) => {
    try {
        let { email } = req.body;
        email = email.trim().toLowerCase();

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists using this email' });
        }

        // Generate 6 digit random number
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if a verification record exists
        let verification = await EmailVerification.findOne({ email });

        if (verification) {
            verification.otp = otp;
            verification.isVerified = false;
        } else {
            verification = new EmailVerification({ email, otp });
        }
        await verification.save();

        const message = `
            <h1>Account Verification</h1>
            <p>Your verification code is:</p>
            <h2>${otp}</h2>
            <p>This code will expire in 15 minutes.</p>
        `;

        try {
            await sendEmail({
                email,
                subject: 'Sabjiwala - Verify your email',
                message,
            });

            res.status(200).json({ success: true, message: 'OTP sent to your email' });
        } catch (error) {
            await EmailVerification.deleteOne({ email });
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/verify-email-pre
// @desc    Verify OTP before registration
// @access  Public
router.post('/verify-email-pre', async (req, res) => {
    try {
        let { email, otp } = req.body;

        email = email.trim().toLowerCase();
        otp = otp.trim();

        console.log(`Verifying OTP for: ${email}, Input OTP: ${otp}`);

        const verification = await EmailVerification.findOne({ email });

        if (!verification) {
            console.log('No verification record found for this email');
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        console.log(`Stored OTP: ${verification.otp}`);

        if (verification.otp !== otp) {
            console.log('OTP Mismatch');
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        verification.isVerified = true;
        await verification.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/google
// @desc    Login/Register with Google
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        user = await User.create({
            name,
            email,
            password,
            isVerified: true
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google Auth Failed' });
    }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Check if email is verified
        const verification = await EmailVerification.findOne({ email });
        if (!verification || !verification.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Create user (set isVerified to true since we checked it)
        const user = await User.create({
            name,
            email,
            password,
            phone,
            isVerified: true
        });

        // Clean up verification record
        await EmailVerification.deleteOne({ email });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            savedAddresses: user.savedAddresses,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        /*
        if (!user.isVerified) {
             return res.status(401).json({ message: 'Please verify your email first' });
        }
        */

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            savedAddresses: user.savedAddresses,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot Password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'No user with that email' });
        }

        const resetOTP = user.getResetPasswordOTP();
        await user.save({ validateBeforeSave: false });

        const message = `
            <h1>Password Reset</h1>
            <p>Your password reset code is:</p>
            <h2>${resetOTP}</h2>
            <p>This code will expire in 10 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Sabjiwala - Password Reset OTP',
                message,
            });

            res.status(200).json({ success: true, message: 'OTP sent to email' });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify Reset Password OTP (Step 2 of Forgot Password)
// @access  Public
router.post('/verify-reset-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;
        email = email.trim().toLowerCase();
        otp = otp.trim();

        const resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ success: true, message: 'OTP Verified' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset Password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated success',
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/save-address
// @desc    Add a new address to saved addresses
// @access  Private
router.post('/save-address', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const newAddress = {
                name: req.body.name,
                phone: req.body.phone,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                country: req.body.country || 'India',
                isDefault: req.body.isDefault || false
            };

            // If new address is default, unset other defaults
            if (newAddress.isDefault) {
                user.savedAddresses.forEach(addr => addr.isDefault = false);
            }

            user.savedAddresses.push(newAddress);
            const updatedUser = await user.save();

            res.json(updatedUser.savedAddresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
