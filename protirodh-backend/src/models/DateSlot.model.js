import mongoose from 'mongoose';

const dateSlotSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Center',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      default: 500
    },
    booked: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
dateSlotSchema.index({ centerId: 1, date: 1 }, { unique: true });
dateSlotSchema.index({ centerId: 1, status: 1 });

export const DateSlot = mongoose.model('DateSlot', dateSlotSchema);
