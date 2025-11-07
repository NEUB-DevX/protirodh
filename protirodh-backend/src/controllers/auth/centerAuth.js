import { Center } from '../../models/Center.model.js';
import jwt from 'jsonwebtoken';

// Center Login
export const centerLogin = async (req, res) => {
  try {
    const { centerId, password } = req.body;

    // Validate input
    if (!centerId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Center ID and password are required'
      });
    }

    // Find center by ID
    const center = await Center.findById(centerId);
    
    if (!center) {
      return res.status(401).json({
        success: false,
        message: 'Invalid center credentials'
      });
    }

    // Check if center is active
    if (center.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Center is not active. Please contact administrator.'
      });
    }

    // Check if center is locked due to failed attempts
    if (center.lockUntil && center.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: 'Center account is temporarily locked. Please try again later.'
      });
    }

    // Verify password (plain text comparison for now, can be enhanced with bcrypt)
    if (center.password !== password) {
      // Increment login attempts
      center.loginAttempts = (center.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (center.loginAttempts >= 5) {
        center.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await center.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid center credentials'
      });
    }

    // Reset login attempts on successful login
    center.loginAttempts = 0;
    center.lockUntil = null;
    center.lastLogin = new Date();
    await center.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        centerId: center._id,
        centerName: center.name,
        role: 'center'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        center: {
          id: center._id,
          name: center.name,
          address: center.address,
          division: center.division,
          capacity: center.capacity,
          staff: center.staff,
          status: center.status,
          lastLogin: center.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Center login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify Center Token
export const verifyCenterToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (decoded.role !== 'center') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const center = await Center.findById(decoded.centerId);
    
    if (!center || center.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Center not found or inactive'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        center: {
          id: center._id,
          name: center.name,
          address: center.address,
          division: center.division,
          capacity: center.capacity,
          staff: center.staff,
          status: center.status
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Center Logout
export const centerLogout = async (req, res) => {
  try {
    // Since we're using JWT tokens (stateless), logout is handled on the client side
    // by removing the token from localStorage
    // This endpoint can be used for logging or tracking purposes
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        console.log(`Center ${decoded.centerName} logged out at ${new Date().toISOString()}`);
      } catch {
        // Token might be invalid or expired, but that's okay for logout
        console.log('Logout attempted with invalid token');
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};