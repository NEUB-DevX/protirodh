import jwt from 'jsonwebtoken';
import { Center } from '../models/Center.model.js';

// Middleware to authenticate center tokens
export const authenticateCenterToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Check if token is for center role
    if (decoded.role !== 'center') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Verify center still exists and is active
    const center = await Center.findById(decoded.centerId);
    
    if (!center) {
      return res.status(401).json({
        success: false,
        message: 'Center not found'
      });
    }

    if (center.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Center is not active'
      });
    }

    // Add center info to request object
    req.center = {
      id: center._id,
      name: center.name,
      division: center.division
    };

    next();
  } catch (error) {
    console.error('Center auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

// Middleware to authenticate admin tokens (for hub operations)
export const authenticateAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Check if token is for admin role (you can implement admin user model later)
    if (decoded.role !== 'admin' && decoded.role !== 'hub') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Add admin info to request object
    req.admin = {
      id: decoded.adminId || decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};