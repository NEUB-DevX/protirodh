import { DateSlot } from '../../models/DateSlot.model.js';
import { TimeSlot } from '../../models/TimeSlot.model.js';

// Get all date slots for the center
export const getDateSlots = async (req, res) => {
  try {
    const centerId = req.center.centerId;

    const dateSlots = await DateSlot.find({ centerId })
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: dateSlots
    });
  } catch (error) {
    console.error('Get date slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch date slots',
      error: error.message
    });
  }
};

// Create new date slot
export const createDateSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { date, capacity, status } = req.body;

    // Check if date slot already exists
    const existing = await DateSlot.findOne({ centerId, date });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Date slot already exists for this date'
      });
    }

    const dateSlot = new DateSlot({
      centerId,
      date,
      capacity: capacity || 500,
      status: status || 'active',
      booked: 0
    });

    await dateSlot.save();

    res.status(201).json({
      success: true,
      message: 'Date slot created successfully',
      data: dateSlot
    });
  } catch (error) {
    console.error('Create date slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create date slot',
      error: error.message
    });
  }
};

// Update date slot
export const updateDateSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { id } = req.params;
    const updates = req.body;

    const dateSlot = await DateSlot.findOne({ _id: id, centerId });

    if (!dateSlot) {
      return res.status(404).json({
        success: false,
        message: 'Date slot not found'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'booked') {
        dateSlot[key] = updates[key];
      }
    });

    await dateSlot.save();

    res.status(200).json({
      success: true,
      message: 'Date slot updated successfully',
      data: dateSlot
    });
  } catch (error) {
    console.error('Update date slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update date slot',
      error: error.message
    });
  }
};

// Delete date slot
export const deleteDateSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { id } = req.params;

    const dateSlot = await DateSlot.findOne({ _id: id, centerId });

    if (!dateSlot) {
      return res.status(404).json({
        success: false,
        message: 'Date slot not found'
      });
    }

    // Delete associated time slots
    await TimeSlot.deleteMany({ dateSlotId: id });

    await dateSlot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Date slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete date slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete date slot',
      error: error.message
    });
  }
};

// Get time slots for a specific date
export const getTimeSlots = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { dateSlotId } = req.params;

    const timeSlots = await TimeSlot.find({ centerId, dateSlotId })
      .populate('assignedStaffId', 'name staffId role')
      .sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time slots',
      error: error.message
    });
  }
};

// Create new time slot
export const createTimeSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { dateSlotId, time, capacity, assignedStaffId } = req.body;

    // Verify date slot exists and belongs to center
    const dateSlot = await DateSlot.findOne({ _id: dateSlotId, centerId });
    if (!dateSlot) {
      return res.status(404).json({
        success: false,
        message: 'Date slot not found'
      });
    }

    const timeSlot = new TimeSlot({
      centerId,
      dateSlotId,
      time,
      capacity: capacity || 50,
      booked: 0,
      assignedStaffId: assignedStaffId || null
    });

    await timeSlot.save();

    const populatedTimeSlot = await TimeSlot.findById(timeSlot._id)
      .populate('assignedStaffId', 'name staffId role');

    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: populatedTimeSlot
    });
  } catch (error) {
    console.error('Create time slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create time slot',
      error: error.message
    });
  }
};

// Update time slot
export const updateTimeSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { id } = req.params;
    const updates = req.body;

    const timeSlot = await TimeSlot.findOne({ _id: id, centerId });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'booked') {
        timeSlot[key] = updates[key];
      }
    });

    await timeSlot.save();

    const populatedTimeSlot = await TimeSlot.findById(timeSlot._id)
      .populate('assignedStaffId', 'name staffId role');

    res.status(200).json({
      success: true,
      message: 'Time slot updated successfully',
      data: populatedTimeSlot
    });
  } catch (error) {
    console.error('Update time slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update time slot',
      error: error.message
    });
  }
};

// Delete time slot
export const deleteTimeSlot = async (req, res) => {
  try {
    const centerId = req.center.centerId;
    const { id } = req.params;

    const timeSlot = await TimeSlot.findOne({ _id: id, centerId });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    await timeSlot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Time slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete time slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete time slot',
      error: error.message
    });
  }
};
