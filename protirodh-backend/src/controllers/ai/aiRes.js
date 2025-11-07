import User from "../../models/User.model.js";
import getOpenAiChatCompletion from "../../configs/openAiAgent.js";
import createProtirodhPrompts from "../../prompts/protirodh_ai/responsePrompt.js";

export const handleAiRes = async (req, res) => {
  try {

    const { message, id, type } = req.body;

    if (!id || !message || !type) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    // // Check if user exists in DB
    let user;

    if (type === "nid") {
      user = await User.findOne({
        nid: id,
      });
    }
      if (type === "bid") {
        user = await User.findOne({
            b_id: id,
          });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        data: {
          message: "User is not in DB",
        },
      });
    }

    const vaccines = user.vaccines || [];
    const { sysPrompt, usrPrompt } = createProtirodhPrompts(vaccines, message);

    //make prompts by making a function

    const data = await getOpenAiChatCompletion(sysPrompt, usrPrompt);

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        message: "AI response generated successfully",
        text: data,
      },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      success: false,
      data: {
        message: "Error generating AI Response",
        error: error.message,
      },
    });
  }
};
