import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';

export const handleGenerateJWTToken = async (req, res) => {
    try {
        const { uid, email } = req.body;
        // console.log(uid,email);

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        // Check if user exists in DB
        const user = await User.findOne({ 
            $or: [{ uid }, { email }] 
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                data: {
                    message : "User is not in DB",
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                uid: user.uid,
            },
            process.env.JWT_SECRET,
            { expiresIn: '21d' }
        );
        // console.log(token);
        // Set token in cookie
        res.cookie('jwt_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 21 * 24 * 60 * 60 * 1000 // 21 days
        });     

    

        // Send response
        return res.status(200).json({
            success: true,
            data: {
                message: 'Token generated successfully',
                token,
                uid: user.uid,
                email: user.email,
                name: user.name,

            }
        });

    } catch (error) {
        console.error('JWT Generation Error:', error);
        return res.status(500).json({
            success: false,
            data: {
                message: 'Error generating token',
                error: error.message
            }
        });
    }
};

