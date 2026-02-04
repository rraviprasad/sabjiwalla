import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    }, 
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // Document automatically deletes after 15 minutes (900 seconds)
    }
});

const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);
export default EmailVerification;
