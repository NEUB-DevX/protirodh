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
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    },
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccine',
      required: true
    },
    dose: {
      type: Number,
      required: true,
      min: 1,
      max: 3
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'no-show', 'cancelled'],
      default: 'pending'
    },
    completedAt: {
      type: Date
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    },
    notes: {
      type: String
    },
    vaccineBatch: {
      type: String
    },
    sideEffects: {
      type: String
    }
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
