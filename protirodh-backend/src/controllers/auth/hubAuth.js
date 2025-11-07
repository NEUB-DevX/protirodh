import jwt from 'jsonwebtoken';

// Hub Admin Login
export const hubLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check against environment variables (admin credentials stored manually)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username,
        role: 'hub'
      },
      process.env.JWT_SECRET || 'test',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Hub admin login successful',
      data: {
        token,
      user: {
        username,
        role: 'hub'
      }
      }
    });
  } catch (error) {
    console.error('Hub login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Verify Hub Token
export const verifyHubToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role !== 'hub') {
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

// Hub Logout
export const hubLogout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Hub admin logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};
