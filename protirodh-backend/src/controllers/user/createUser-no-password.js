import User from '../../models/User.model.js';

export const handleCreateUserNoPassword = async (req, res) => {
    try {
        const { uid, email, name } = req.body;
        // console.log(uid, email, nickName);

        // Validate required fields
        if (!uid || !email || !name) {
            return res.status(400).json({
                success: false,
                data: {
                    message: "Missing required fields",
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ uid }, { email }] 
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                data: {
                    message: "User already exists"
                }
            });
        }

        // Create new user
        const newUser = new User({
            uid,
            email,
            name,
        });

        await newUser.save();
        

        return res.status(201).json({
            success: true,
            data: {
                message: "User created successfully",
                user: {
                    uid: newUser.uid,
                    email: newUser.email,
                    name: newUser.name
                }
            }
        });

    } catch (error) {
        console.error('Create User Error:', error);
        return res.status(500).json({
            success: false,
            data: {
                message: "Error creating user",
                error: error.message
            }
        });
    }
};
