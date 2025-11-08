import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    timeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true
    },
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccine',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      default: '09:00'
    },
    endTime: {
      type: String,
      default: '10:00'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'no-show', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date
    },
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
appointmentSchema.index({ centerId: 1, date: 1, status: 1 });
appointmentSchema.index({ staffId: 1, date: 1, status: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ timeSlotId: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
