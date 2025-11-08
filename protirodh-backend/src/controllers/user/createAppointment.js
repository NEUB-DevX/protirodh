import { Appointment } from '../../models/Appointment.model.js';
import { TimeSlot } from '../../models/TimeSlot.model.js';
import { DateSlot } from '../../models/DateSlot.model.js';
import UserModel from '../../models/User.model.js';
import { Vaccine } from '../../models/Vaccine.model.js';
import { Center } from '../../models/Center.model.js';

/**
 * Create a new appointment
 * Automatically selects an available timeslot
 */
export const handleCreateAppointment = async (req, res) => {
  try {
    const { userId, vaccineId, centerId, dateSlotId, notes } = req.body;

    // Validate required fields
    if (!userId || !vaccineId || !centerId || !dateSlotId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, vaccineId, centerId, dateSlotId'
      });
    }

    // Verify that the user exists (using uid instead of _id)
    const user = await UserModel.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify that the vaccine exists
    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccine not found'
      });
    }

    // Verify that the center exists
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    // Verify that the date slot exists and is available
    const dateSlot = await DateSlot.findById(dateSlotId);
    if (!dateSlot) {
      return res.status(404).json({
        success: false,
        message: 'Date slot not found'
      });
    }

    if (dateSlot.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected date slot is not available'
      });
    }

    if (dateSlot.booked >= dateSlot.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Selected date slot is fully booked'
      });
    }

    // Find an available time slot for this date
    let availableTimeSlot = await TimeSlot.findOne({
      dateSlotId: dateSlotId,
      centerId: centerId,
      $expr: { $lt: ['$booked', '$capacity'] } // Not fully booked
    }).sort({ startTime: 1 }); // Get the earliest available time slot

    // If no timeslots exist, create default ones
    if (!availableTimeSlot) {
      // Check if any timeslots exist for this date
      const existingSlots = await TimeSlot.countDocuments({ dateSlotId, centerId });
      
      if (existingSlots === 0) {
        // Create default time slots (9 AM to 5 PM, hourly)
        const defaultTimeSlots = [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '12:00', endTime: '13:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '16:00', endTime: '17:00' }
        ];

        const timeSlotPromises = defaultTimeSlots.map(slot => {
          const timeSlot = new TimeSlot({
            centerId,
            dateSlotId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            capacity: 50,
            booked: 0
          });
          return timeSlot.save();
        });

        await Promise.all(timeSlotPromises);
        console.log(`Created ${defaultTimeSlots.length} default time slots for date slot ${dateSlotId}`);

        // Now try to find an available slot again
        availableTimeSlot = await TimeSlot.findOne({
          dateSlotId: dateSlotId,
          centerId: centerId,
          $expr: { $lt: ['$booked', '$capacity'] }
        }).sort({ startTime: 1 });
      }

      if (!availableTimeSlot) {
        return res.status(400).json({
          success: false,
          message: 'No available time slots for the selected date. All slots are fully booked.'
        });
      }
    }

    // Create the appointment (use user's MongoDB _id for the appointment)
    const appointment = new Appointment({
      userId: user._id,
      centerId,
      dateSlotId,
      timeSlotId: availableTimeSlot._id,
      vaccineId,
      date: dateSlot.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      startTime: availableTimeSlot.startTime,
      endTime: availableTimeSlot.endTime,
      status: 'pending',
      notes: notes || ''
    });

    await appointment.save();

    // Update the booked counts
    dateSlot.booked += 1;
    await dateSlot.save();

    availableTimeSlot.booked += 1;
    await availableTimeSlot.save();

    // Populate the appointment with details for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email phone')
      .populate('centerId', 'name address')
      .populate('vaccineId', 'name manufacturer')
      .populate('dateSlotId', 'date capacity booked')
      .populate('timeSlotId', 'startTime endTime capacity booked');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        appointment: populatedAppointment,
        timeSlot: {
          startTime: availableTimeSlot.startTime,
          endTime: availableTimeSlot.endTime
        }
      }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

/**
 * Get appointments for a user
 */
export const handleGetUserAppointments = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const appointments = await Appointment.find({ userId })
      .populate('centerId', 'name address')
      .populate('vaccineId', 'name manufacturer')
      .populate('dateSlotId', 'date')
      .populate('timeSlotId', 'startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        appointments,
        count: appointments.length
      }
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};
