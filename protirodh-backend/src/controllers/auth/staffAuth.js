import { Staff } from '../../models/Staff.model.js';
import jwt from 'jsonwebtoken';

// Staff Login
export const staffLogin = async (req, res) => {
  try {
    const { staffId, password } = req.body;

    // Validate input
    if (!staffId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Staff ID and password are required'
      });
    }

    // Find staff by staffId
    const staff = await Staff.findOne({ staffId });
    
    if (!staff) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials'
      });
    }

    // Check if staff is active
    if (staff.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Staff account is not active. Please contact your center administrator.'
      });
    }

    // Verify password
    if (staff.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials'
      });
    }

    // Update last login
    staff.lastLogin = new Date();
    await staff.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        staffId: staff._id,
        staffIdNumber: staff.staffId,
        name: staff.name,
        centerId: staff.centerId,
        role: 'staff'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Staff login successful',
      token,
      user: {
        id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        role: staff.role,
        centerId: staff.centerId
      }
    });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Verify Staff Token
export const verifyStaffToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Staff Logout
export const staffLogout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Staff logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};
