import { Staff } from '../../models/Staff.model.js';

// Get all staff members for the center
export const getCenterStaff = async (req, res) => {
  try {
    const centerId = await req.center.id;
    console.log(req.center)

    const staff = await Staff.find({ centerId })
      .sort({ createdAt: -1 });
    
    console.log(staff)

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Get center staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff members',
      error: error.message
    });
  }
};

// Create new staff member
export const createStaff = async (req, res) => {
  try {
    const centerId = req.center.id;
    const { staffId, name, email, phone, role, password } = req.body;

    // Check if staffId already exists
    const existingStaff = await Staff.findOne({ staffId });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Staff ID already exists'
      });
    }

    const staff = new Staff({
      staffId,
      name,
      email,
      phone,
      role,
      password,
      centerId,
      status: 'active'
    });

    await staff.save();

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staff
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create staff member',
      error: error.message
    });
  }
};

// Update staff member
export const updateStaff = async (req, res) => {
  try {
    const centerId = req.center.id;
    const { id } = req.params;
    const updates = req.body;

    const staff = await Staff.findOne({ _id: id, centerId });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        staff[key] = updates[key];
      }
    });

    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staff member',
      error: error.message
    });
  }
};

// Delete staff member (soft delete)
export const deleteStaff = async (req, res) => {
  try {
    const centerId = req.center.id;
    const { id } = req.params;

    const staff = await Staff.findOne({ _id: id, centerId });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    staff.status = 'deleted';
    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete staff member',
      error: error.message
    });
  }
};
