import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: "User already exists !" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long !!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = await genToken(user._id);
        res.cookie("token", token, { 
            httpOnly: true,
            maxAge : 7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        });
        return res.status(201).json({ message: "User created successfully", user, token });
    } catch (error) {
        console.error(`Error occurred while signing up: ${error.message}`);
        res.status(500).json({ message: "Error occurred while signing up" });
    }
}


export const Login = async (req, res) => {
    try {
        const {email, password } = req.body;
        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found !" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password !" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, { 
            httpOnly: true,
            maxAge : 7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        });
        return res.status(201).json({ message: "User logged in successfully", user, token });
    } catch (error) {
        console.error(`Error occurred while logging in: ${error.message}`);
        res.status(500).json({ message: "Error occurred while logging in" });
    }
}

export const Logout = async (req, res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(`Error occurred while logging out: ${error.message}`);
        res.status(500).json({ message: "Error occurred while logging out" });
    }
}