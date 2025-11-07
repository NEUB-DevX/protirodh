import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Center',
      required: true
    },
    dateSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DateSlot',
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      default: 50
    },
    booked: {
      type: Number,
      default: 0
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
timeSlotSchema.index({ centerId: 1, dateSlotId: 1 });
timeSlotSchema.index({ assignedStaffId: 1 });

export const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
