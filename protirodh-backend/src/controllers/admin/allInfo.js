
import User from '../../models/User.model.js';
export const handleStatHub = async (req, res) => {
    try {
      

        const usersCount = await User.countDocuments();
        const totalStock = 1200;
        const wastageRate = 10;
        const coverageRate = 20;
        


        // Send response
        return res.status(200).json({
            success: true,
            data: {
                usersCount,
                totalStock,
                wastageRate,
                coverageRate
                

            }
        });

    } catch (error) {
        console.error('Email Sending Error:', error);
        return res.status(500).json({
            success: false,
            data: {
                message: 'Error Sending Email',
                error: error.message
            }
        });
    }
};

