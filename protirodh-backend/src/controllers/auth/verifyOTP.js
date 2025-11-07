import nidModel from "../../models/NID.model.js";
import UserModel from "../../models/User.model.js";
import VerificationCodeModel from "../../models/VerificationCode.model.js";
import jwt from "jsonwebtoken";

export const handleVerifyCode = async (req, res) => {
  try {
    const { type, id, code } = req.body;

    if (!type || !id || !code) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request: NID /BIDand code are required",
      });
    }

    // Check if user exists in NID DB
    let user;

    if (type === "nid") {
      user = await nidModel.findOne({ nid:id });
    }
    if (type === "bid") {
      user = await nidModel.findOne({ b_id: id });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        data: { message: "User not found" },
      });
    }

    // Get the latest verification entry
    const verificationEntry = await VerificationCodeModel.findOne({
      $or: [{ nid: user.nid }, { b_id: user.b_id }],
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!verificationEntry || verificationEntry.code !== code) {
      return res.status(400).json({
        success: false,
        data: { message: "Invalid or expired verification code" },
      });
    }

    // Delete verification code after successful verification
    // await VerificationCodeModel.deleteOne({ _id: verificationEntry._id });

    // Check if user already exists in main User DB
    let userExists = await UserModel.findOne({
      $or: [{ nid: user.nid }, { b_id: user.b_id }],
    });
    let newUser = null;

    if (!userExists) {
      newUser = await UserModel.create({
        nid: user.nid,
        email: user.email,
        b_group: user.blood_group,
        b_id: user.b_id,
        gender: user.gender,
        name: user.name,
        dob: user.dob,
        f_name: user.father_name,
        m_name: user.mother_name,
        phone_number: user.phone_number,
        contact: {
          division: user.address.division,
          zila: user.address.zila,
          upzila: user.address.upazila,
          village: user.address.village,
          house: user.address.birth_place + user.address.holding_number,
        },
      });

      await newUser.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uid: userExists ? userExists.uid : newUser.uid,
        nid: user.nid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set cookie (for browsers)
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Also attach token in header manually
    res.setHeader("Set-Cookie", `token=${token}; Max-Age=${30 * 24 * 60 * 60}`);

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        message: "Token generated successfully",
        token,
        user: userExists ? userExists : newUser,
      },
    });
  } catch (error) {
    console.error("Code Verification Error:", error);
    return res.status(500).json({
      success: false,
      data: { message: "Error verifying code", error: error.message },
    });
  }
};
