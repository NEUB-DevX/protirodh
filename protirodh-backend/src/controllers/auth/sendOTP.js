import sendVerificationEmail from '../../configs/emailConfig.js';
import nidModel from '../../models/NID.model.js';
import VerificationCodeModel from '../../models/VerificationCode.model.js';

export const handleSendEmail = async (req, res) => {
  try {
      const { type, id  } = req.body;
      console.log(req.body)

    if (!type || !id ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Request: NID/BID is required',
      });
    }

    // Check if user exists
    let user;
    
    if (type === "nid") { user = await nidModel.findOne({ nid: id }); }
    if (type === "bid") { user = await nidModel.findOne({ b_id: id }); }

    if (!user) {
      return res.status(404).json({
        success: false,
        data: { message: 'User is not in DB' },
      });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to verification model
    await VerificationCodeModel.create({
      nid: user.nid,
      code,
    });

    // Send verification email
    await sendVerificationEmail(user.email, code);

    return res.status(200).json({
      success: true,
      data: { message: 'Verification email sent successfully' , email: user.email  },
    });
      
      
  } catch (error) {
    console.error('Email Sending Error:', error);
    return res.status(500).json({
      success: false,
      data: { message: 'Error Sending Email', error: error.message },
    });
  }
};
