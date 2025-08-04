const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { login, uploadImage, register } = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users Auth
 *     description: API endpoints for user auth
 */



/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user by Email and password. Returns a JWT token if successful.
 *     tags: [Users Auth]  # Category of API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "sn@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1Mzk2OTM3MiwiZXhwIjoxNzU2NTk3MzcyfQ.omOEnSQRshmeQwsJJJHqC27PCQ6BbOYOiBqgImPhhOg"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: "Shivam Nagpal"
 *                         email:
 *                           type: string
 *                           example: "sn@gmail.com"
 *                         created_date:
 *                           type: string
 *                           example: "2025-07-31T13:42:52.000Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Invalid phone or OTP"
 *       401:
 *         description: Unauthorized - Incorrect credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Invalid phone number or password"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Error logging in"
 */
router.post("/login", login);


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




/**
 * @swagger
 * /api/users/upload-image:
 *   post:
 *     summary: Upload an Image
 *     description: Uploads an image and returns the URL of the uploaded image.
 *     tags: [Users Auth]
 *     consumes:
 *       - multipart/form-data  # Indicating that the request body will be form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded.
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 data:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/1738260807958.png"
 *       400:
 *         description: Invalid input or missing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Error uploading image"
 */
router.post("/upload-image", upload, uploadImage);

/**
 * @swagger
 * /api/users/register-user:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns the user data and JWT token.
 *     tags:
 *       - Users Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "newuser@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1Mzk2OTM3MiwiZXhwIjoxNzU2NTk3MzcyfQ.omOEnSQRshmeQwsJJJHqC27PCQ6BbOYOiBqgImPhhOg"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: "Shivam Nagpal"
 *                         email:
 *                           type: string
 *                           example: "sn@gmail.com"
 *                         created_date:
 *                           type: string
 *                           example: "2025-07-31T13:42:52.000Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Invalid registration data"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
router.post("/register-user", register);

module.exports = router;