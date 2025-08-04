const jwt = require('jsonwebtoken');
const SECRETKEY = process.env.JWT_SECRET || 'yourSecretKey';
const User = require("../models/userModel");
const authMiddleware = async (req, res, next) => {
    try {

        
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        
        const token = req.headers.authorization?.split(" ")[1];
        
        const decoded = jwt.verify(token, SECRETKEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        
        req.ID = decoded.userId;
        
        // Fetch user details
        // console.log(token)
        // console.log(decoded)
        // console.log(decoded.userId)
        const user = await User.findById(req.ID);
        if (!user) return errorResponse(res, "User not found", 404);
        
        req.userInfo = user
        
        next();
        // console.log('fhhf')
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

module.exports = authMiddleware;