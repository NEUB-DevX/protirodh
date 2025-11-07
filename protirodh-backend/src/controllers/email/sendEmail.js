
import sendVerificationEmail, { sendCustomEmail } from '../../configs/emailConfig.js';
import { buildSuccessEmail } from '../../emails/successTemplate.js';
import User from '../../models/User.model.js';
export const handleSendEmail = async (req, res) => {
    try {
        const uid = req.uid;

        const { email, type } = req.body;
        // console.log(uid);

        if (!uid || !email || !type) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        // Check if user exists in DB
        const user = await User.findOne({ 
            uid
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                data: {
                    message : "User is not in DB",
                }
            });
        }
        let finalSubject, finalHtml;
        if (type === "1") {
            const { subject, html } = buildSuccessEmail({
                recipientName: user.name,
                action: "Test",
                details: `Your requested ${"Test"} has been processed successfully.`,
            });
            finalHtml = html;
            finalSubject = subject;
            
        }

         await sendCustomEmail(
            email,
            finalSubject,
            finalHtml
         );
        


        // Send response
        return res.status(200).json({
            success: true,
            data: {
                message: 'Email sent successfully',

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

