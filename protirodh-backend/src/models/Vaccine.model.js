import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  doses: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  temperature: {
    type: String,
    required: true,
    trim: true
  },
  efficacy: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure virtual fields are serialized
vaccineSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Index for faster queries
vaccineSchema.index({ name: 1 });
vaccineSchema.index({ isActive: 1 });

export const Vaccine = mongoose.model('Vaccine', vaccineSchema);