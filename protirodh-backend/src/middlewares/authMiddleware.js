import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log("AUthing")
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : req.cookies?.jwt;

    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        data: {
          message: 'Access denied. No authentication token provided.'
        }
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user info to request object
      req.user = decoded;
      
      // Optionally fetch full user details from database
      const user = await User.findOne({ uid: decoded.uid });
      
      if (!user || user.isBanned) {
        return res.status(404).json({
          success: false,
          data: {
            message: 'User associated with token not found'
          }
        });
      }

      // console.log("User Granted");
      
      // Add full user object to request
      req.uid = user.uid;
      
      next();
    } catch (error) {
      // Handle different JWT verification errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          data: {
            message: 'Session expired. Please login again.',
            error: 'TOKEN_EXPIRED'
          }
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          data: {
            message: 'Invalid token. Please login again.',
            error: 'INVALID_TOKEN'
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          data: {
            message: 'Token verification failed',
            error: error.message
          }
        });
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      data: {
        message: 'Internal server error during authentication',
        error: error.message
      }
    });
  }
};

/**
 * Role-based authorization middleware
 * Use after authenticateToken middleware
 * @param {Array} roles - Array of allowed roles
 */
export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: {
          message: 'Authentication required'
        }
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: {
          message: 'Access forbidden. Insufficient permissions.'
        }
      });
    }

    next();
  };
};

export default { authenticateToken, authorizeRoles }; 