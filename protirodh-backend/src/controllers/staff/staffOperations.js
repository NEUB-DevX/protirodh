import { Appointment } from '../../models/Appointment.model.js';
import { TimeSlot } from '../../models/TimeSlot.model.js';
import { DateSlot } from '../../models/DateSlot.model.js';

// Get staff profile
export const getStaffProfile = async (req, res) => {
  try {
    const staff = await req.staff;

    await staff.populate('centerId', 'name address');

    res.status(200).json({
      success: true,
      data: {
        id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        status: staff.status,
        center: staff.centerId,
        lastLogin: staff.lastLogin
      }
    });
  } catch (error) {
    console.error('Get staff profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff profile',
      error: error.message
    });
  }
};

// Get staff dashboard stats
export const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments assigned to this staff
    const todayAppointments = await Appointment.find({
      staffId: staffId,
      date: today
    });

    const stats = {
      total: todayAppointments.length,
      completed: todayAppointments.filter(a => a.status === 'completed').length,
      pending: todayAppointments.filter(a => a.status === 'pending').length,
      noShow: todayAppointments.filter(a => a.status === 'no-show').length
    };

    // Get this week's completed vaccinations
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyCompleted = await Appointment.countDocuments({
      staffId: staffId,
      status: 'completed',
      completedAt: { $gte: weekStart }
    });

    res.status(200).json({
      success: true,
      data: {
        today: stats,
        weeklyCompleted,
        date: today
      }
    });
  } catch (error) {
    console.error('Get staff dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Get appointments assigned to staff
export const getStaffAppointments = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const { date, status, search } = req.query;

    // Build query
    const query = { staffId };

    if (date) {
      query.date = date;
    } else {
      // Default to today
      query.date = new Date().toISOString().split('T')[0];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Get appointments with populated user and vaccine data
    let appointments = await Appointment.find(query)
      .populate('userId', 'nid name contact')
      .populate('vaccineId', 'name manufacturer')
      .populate('timeSlotId', 'time')
      .sort({ time: 1 });

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      appointments = appointments.filter(apt => {
        const userName = apt.userId?.name?.toLowerCase() || '';
        const nid = apt.userId?.nid || '';
        const contact = apt.userId?.contact || '';
        return userName.includes(searchLower) || 
               nid.includes(search) || 
               contact.includes(search);
      });
    }

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get staff appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get appointment details by ID
export const getAppointmentById = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, staffId })
      .populate('userId', 'nid name contact dob gender b_group')
      .populate('vaccineId', 'name manufacturer doses temperature description')
      .populate('timeSlotId', 'time capacity')
      .populate('dateSlotId', 'date')
      .populate('completedBy', 'name staffId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment details',
      error: error.message
    });
  }
};

// Mark appointment as completed
export const completeAppointment = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const { id } = req.params;
    const { notes, vaccineBatch, sideEffects } = req.body;

    const appointment = await Appointment.findOne({ _id: id, staffId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not assigned to you'
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already completed'
      });
    }

    // Update appointment
    appointment.status = 'completed';
    appointment.completedAt = new Date();
    appointment.completedBy = staffId;
    if (notes) appointment.notes = notes;
    if (vaccineBatch) appointment.vaccineBatch = vaccineBatch;
    if (sideEffects) appointment.sideEffects = sideEffects;

    await appointment.save();

    // Populate before sending response
    await appointment.populate('userId', 'name nid');
    await appointment.populate('vaccineId', 'name');

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment',
      error: error.message
    });
  }
};

// Mark appointment as no-show
export const markAsNoShow = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findOne({ _id: id, staffId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not assigned to you'
      });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending appointments can be marked as no-show'
      });
    }

    // Update appointment
    appointment.status = 'no-show';
    appointment.completedBy = staffId;
    appointment.completedAt = new Date();
    if (notes) appointment.notes = notes;

    await appointment.save();

    // Update time slot capacity
    await TimeSlot.findByIdAndUpdate(appointment.timeSlotId, {
      $inc: { booked: -1 }
    });

    // Update date slot capacity
    await DateSlot.findByIdAndUpdate(appointment.dateSlotId, {
      $inc: { booked: -1 }
    });

    await appointment.populate('userId', 'name nid');
    await appointment.populate('vaccineId', 'name');

    res.status(200).json({
      success: true,
      message: 'Appointment marked as no-show successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Mark as no-show error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark appointment as no-show',
      error: error.message
    });
  }
};

// Update appointment notes
export const updateAppointmentNotes = async (req, res) => {
  try {
    const staffId = req.staff.id;
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findOne({ _id: id, staffId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not assigned to you'
      });
    }

    appointment.notes = notes;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notes',
      error: error.message
    });
  }
};
