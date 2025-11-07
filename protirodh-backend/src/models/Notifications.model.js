import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
  });
export
    
    const Notification = mongoose.model('Notification', notificationSchema);