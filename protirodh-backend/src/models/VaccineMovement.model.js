import mongoose from 'mongoose';

const vaccineMovementSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  vaccineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  vaccineName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  expectedDelivery: {
    type: Date,
    default: null
  },
  actualDelivery: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure virtual fields are serialized
vaccineMovementSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Index for faster queries
vaccineMovementSchema.index({ centerId: 1 });
vaccineMovementSchema.index({ status: 1 });
vaccineMovementSchema.index({ createdAt: -1 });
vaccineMovementSchema.index({ trackingNumber: 1 });

export const VaccineMovement = mongoose.model('VaccineMovement', vaccineMovementSchema);