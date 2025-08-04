const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const md5 = require("md5");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return errorResponse(res, "Invalid Email ID", 200);

        const isPasswordValid = md5(password) === user.password;
        if (!isPasswordValid) return errorResponse(res, "Invalid Email or password", 200);
        delete user.password

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "730h" });

        successResponse(res, "Login successful", { token, user });

    } catch (err) {
        errorResponse(res, "Error logging in", 500, err.message);
    }
};



// Image Upload Controller
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {

            errorResponse(res, "No file uploaded", 400);
        }

        // Construct image URL
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        return successResponse(res, "Image uploaded successfully", imageUrl);

    } catch (err) {
        // return res.status(500).json({
        //     status: "0",
        //     message: "Error uploading image",
        //     error: error.message
        // });
        return errorResponse(res, "Error uploading image", 500, err.message);
    }
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) return errorResponse(res, "Email already registered", 200);
        
        // Hash the password
        const hashedPassword = md5(password);
        
        // Create new user
        const newUser = await User.create({ username, email, password: hashedPassword });
        const create = await User.findByEmail(email);

        delete create.password; // Remove password from response for security

        const token = jwt.sign({ userId: newUser }, process.env.JWT_SECRET, { expiresIn: "730h" });


        successResponse(res, "Registration successful", { token: token, user: create });

    } catch (err) {
        errorResponse(res, "Error registering user", 500, err.message);
    }
}

