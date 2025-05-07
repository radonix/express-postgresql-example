import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js"

const register = async (req, res) => {
    console.log("Registering User", req.body);
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "name, email and password are required" });
    }
    const { name, email, password } = req.body;

    // Check if name meets the minimum length requirement
    const nameRegex = /^.{3,}$/; // Name must be at least 3 characters long
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Name must be at least 3 characters long" });
    }
    // Check if email is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if password meets the minimum size and contains special characters
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one special character" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const savedUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log("Saved user:", savedUser);
        return res.status(200).json({ message: 'user registered successfully:', user: savedUser });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Error saving user", error: error.message });
    }
};

const login = async (req, res) => {
    console.log("Logging in user:", req.body);
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const { email, password } = req.body;

    // Check if email is not null
    if (!email) {
        return res.status(400).json({ message: "Email cannot be null" });
    }
        // Check if email is not null
    if (!password) {
        return res.status(400).json({ message: "Password cannot be null" });
    }

    // Check if email is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if password meets the minimum size and contains special characters
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one special character" });
   }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("User logged in successfully:", user.email);
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ message: "Internal server error: Missing JWT_SECRET" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: `Error logging in user: ${error}` });
    }
};

export default {register,login};