import jwt from 'jsonwebtoken';
import { Staff } from '../models/Staff.model.js';

export const authenticateStaffToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff credentials required.'
      });
    }

    // Get staff from database
    const staff = await Staff.findById(decoded.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    if (staff.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Staff account is not active'
      });
    }

    // Attach staff to request
    req.staff = staff;
    next();
  } catch (error) {
    console.error('Staff authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
