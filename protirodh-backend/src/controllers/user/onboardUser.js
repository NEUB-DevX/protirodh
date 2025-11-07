import User from "../../models/User.model.js";

export const handleOnBoardUser = async (req, res) => {
  try {
    const {
      uid,
      nid,
      b_group,
      gender,
      name,
      dob,
      f_name,
      m_name,
      division,
      zila,
      upzila,
      village,
      house,
    } = req.body;

    if (!uid || !nid || !b_group || !dob || !gender|| !division || !zila || !upzila || !village || !house || !name || !f_name || !m_name) {
      return res.status(400).json({
        success: false,
        data: {
          message: "Data is required",
        },
      });
    }

    // Find user by uid
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: {
          message: "User not found",
        },
      });
    }
      
      user.nid = nid;
      user.b_group = b_group;
      user.gender = gender;
      user.name = name;
      user.dob = dob;
      user.f_name = f_name;
      user.m_name = m_name;
      user.contact = {
        division,
        zila,
        upzila,
        village,
        house,
      };

    await user.save();

    return res.status(200).json({
        success: true,
        data: {
            
            message: "User onboarded successfully",
        }
    });
  } catch (error) {
    console.error("Post Onboard Error:", error);
    return res.status(500).json({
      success: false,
      data: {
        message: "Error Onboarding User",
        error: error.message,
      },
    });
  }
};
