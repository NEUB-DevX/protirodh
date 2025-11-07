import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  division: {
    type: String,
    required: true,
    enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  staff: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Virtual for center ID with zero padding
centerSchema.virtual('centerId').get(function() {
  return this._id.toString().slice(-4).padStart(4, '0');
});

// Ensure virtual fields are serialized
centerSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Index for faster queries
centerSchema.index({ status: 1 });
centerSchema.index({ division: 1 });

export const Center = mongoose.model('Center', centerSchema);