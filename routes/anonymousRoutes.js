const express = require("express");
const auth = require("../middlewares/authMiddleWare");
const { getAnonymousTemplates, createAnonymousQuiz, sendAnonymousMessage, getMyAnonymousQuizzes, getMyAnonymousQuizResponse } = require("../controllers/anonymousController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Compatibility
 *     description: API endpoints for compatibility features
 */

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
 * /api/anonymous/get-templates:
 *   get:
 *     summary: Get anonymous templates
 *     description: Returns a list of anonymous templates
 *     tags:
 *       - Anonymous
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anonymous templates fetched successfully
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
 *                   example: Compatibility templates fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Cosmic Crush
 *                       sub_title:
 *                         type: string
 *                         example: Dreamy and mysterious vibes
 *                       description:
 *                         type: string
 *                         example: "A cosmic journey through the stars"
 *                       sub_description:
 *                         type: string
 *                         example: "Explore the mysteries of the universe"
 *                       icon:
 *                         type: string
 *                         example: 🔥
 */
router.get("/get-templates", auth, getAnonymousTemplates);

/** * @swagger
 * /api/anonymous/create-quiz:
 *   post:
 *     summary: Create an anonymous quiz
 *     description: Creates a new anonymous quiz
 *     tags:
 *       - Anonymous
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Anonymous quiz created successfully
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
 *                   example: Anonymous quiz created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     message_code:
 *                       type: string
 *                       example: quiz_1633036800000_123
 */
router.post("/create-quiz", auth, createAnonymousQuiz);

/**
 * @swagger
 * /api/anonymous/send-message:
 *   post:
 *     summary: Send an anonymous message
 *     description: Sends a message to an anonymous quiz
 *     tags:
 *       - Anonymous
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_code:
 *                 type: string
 *                 example: quiz_1633036800000_123
 *               message:
 *                 type: string
 *                 example: "This is an anonymous message"
 *               user:
 *                 type: string
 *                 example: "User123"
 *     responses:
 *       201:
 *         description: Anonymous message sent successfully
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
 *                   example: Anonymous message sent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "This is an anonymous message"
 */
router.post("/send-message", sendAnonymousMessage);

/**
 * @swagger
 * /api/anonymous/get-my-quizzes:
 *   get:
 *     summary: Get my anonymous quizzes
 *     description: Fetches all anonymous quizzes created by the authenticated user
 *     tags:
 *       - Anonymous
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anonymous quizzes fetched successfully
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
 *                   example: Anonymous quizzes fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       message_code:
 *                         type: string
 *                         example: quiz_1633036800000_123
 *                       template_id:
 *                         type: integer
 *                         example: 1
 *                       active:
 *                         type: string
 *                         example: "1"
 *                       no_of_responses:
 *                         type: integer
 *                         example: 0
 *                       title:
 *                         type: string
 *                         example: Dreamy and mysterious vibes
 *                       description:
 *                         type: string
 *                         example: "A cosmic journey through the stars"
 *                       sub_description:
 *                         type: string
 *                         example: "Explore the mysteries of the universe"
 *                       icon:
 *                         type: string
 *                         example: 🔥
 */
router.get("/get-my-quizzes", auth, getMyAnonymousQuizzes);

/**
 * @swagger
 * /api/anonymous/get-my-quiz-responses/{message_code}:
 *   get:
 *     summary: Get my anonymous quiz responses
 *     description: Fetches all responses for a specific anonymous quiz
 *     tags:
 *       - Anonymous
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_code
 *         required: true
 *         description: The unique code of the anonymous quiz
 *         schema:
 *           type: string
 *           example: quiz_1633036800000_123
 *     responses:
 *       200:
 *         description: Anonymous quiz responses fetched successfully
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
 *                   example: Anonymous quiz responses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       message:
 *                         type: string
 *                         example: "This is an anonymous response"
 *                       user:
 *                         type: string
 *                         example: "User123"
 *                       created:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-01T12:00:00Z"
 */
router.get("/get-my-quiz-responses/:message_code", auth, getMyAnonymousQuizResponse);

module.exports = router;