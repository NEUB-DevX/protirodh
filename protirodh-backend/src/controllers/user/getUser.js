import UserModel from '../../models/User.model.js';
import jwt from 'jsonwebtoken';

export const handleGetUser = async (req, res) => { 
    try {
      const { token } = req.body; 

        if (!token) {
            return res.status(401).json({
              success: false,
              data: {
                message: 'Access denied. No authentication token provided.'
              }
            });
          }
      
          // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            
            // Optionally fetch full user details from database
      const user = await UserModel.findOne({ uid: decoded.uid });
      
      
            
            if (!user) {
              return res.status(404).json({
                success: false,
                data: {
                  message: 'User associated with token not found'
                }
              });
            }
    

        return res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error('Get User Error:', error);
        return res.status(500).json({
            success: false,
            data: {
                message: "Error fetching user",
                error: error.message
            }
        });
    }
};
