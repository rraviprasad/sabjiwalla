import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    savedAddresses: [{
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOTP: String,
    verificationOTPExpire: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate Password Reset OTP
userSchema.methods.getResetPasswordOTP = function () {
    // Generate 6 digit random number
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token and set to resetPasswordOTP field
    this.resetPasswordOTP = crypto
        .createHash('sha256')
        .update(resetOTP)
        .digest('hex');

    // Set expire
    this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetOTP;
};

const User = mongoose.model('User', userSchema);
export default User;
