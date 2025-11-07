import mongoose from 'mongoose';


const VerificationCodeSchema = new mongoose.Schema({
    nid: {
        type: String,
        required: true,
        index: true // index for faster lookups
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // TTL: 300 seconds = 5 minutes
    }
});

 
const VerificationCodeModel = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);

export default VerificationCodeModel;