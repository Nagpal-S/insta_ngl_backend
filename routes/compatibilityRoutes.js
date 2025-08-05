const express = require("express");
const auth = require("../middlewares/authMiddleWare");
const { getCompatibilityTemplates, getCompatibilityQuestionsCategories, getCompatibilityQuestions, createCompatibilityQuestions, getQuizByCode, submitQuizAnswers, getQuizList, myQuizResults, getResultByUser } = require("../controllers/compatibilityController");
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
 * /api/compatibility/get-templates:
 *   get:
 *     summary: Get compatibility templates
 *     description: Returns a list of compatibility templates
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compatibility templates fetched successfully
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
 *                         example: How compatible are we?
 *                       description:
 *                         type: string
 *                         example: ""
 *                       icon:
 *                         type: string
 *                         example: 🔥
 */
router.get("/get-templates", auth, getCompatibilityTemplates);

/**
 * @swagger
 * /api/compatibility/get-questions-categories:
 *   get:
 *     summary: Get compatibility question categories
 *     description: Returns a list of compatibility question categories
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compatibility questions categories fetched successfully
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
 *                   example: Compatibility questions categories fetched successfully
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
 *                         example: Personal
 */
router.get("/get-questions-categories", auth, getCompatibilityQuestionsCategories);

/**
 * @swagger
 * /api/compatibility/get-questions:
 *   get:
 *     summary: Get compatibility questions
 *     description: Returns a list of compatibility questions with options
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compatibility questions fetched successfully
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
 *                   example: Compatibility questions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       question:
 *                         type: string
 *                         example: How do I handle stress?
 *                       category_id:
 *                         type: integer
 *                         example: 1
 *                       category_title:
 *                         type: string
 *                         example: Personal
 *                       answer_a:
 *                         type: string
 *                         example: Exercise
 *                       answer_b:
 *                         type: string
 *                         example: Music
 *                       answer_c:
 *                         type: string
 *                         example: Talk to friends?
 *                       answer_d:
 *                         type: string
 *                         example: Alone Time
 */
router.get("/get-questions", auth, getCompatibilityQuestions);

/**
 * @swagger
 * /api/compatibility/create-question:
 *   post:
 *     summary: Create compatibility questions
 *     description: Creates one or more compatibility questions
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Stress Management
 *               description:
 *                 type: string
 *                 example: This question is about how you handle stress.
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: How do I handle stress?
 *                     category_id:
 *                       type: integer
 *                       example: 1
 *                     answer_a:
 *                       type: string
 *                       example: Exercise
 *                     answer_b:
 *                       type: string
 *                       example: Music
 *                     answer_c:
 *                       type: string
 *                       example: Talk to friends?
 *                     answer_d:
 *                       type: string
 *                       example: Alone Time
 *                     correct_option:
 *                       type: string
 *                       example: answer_a
 *     responses:
 *       201:
 *         description: Compatibility questions created successfully
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
 *                   example: Compatibility questions created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       quiz_code:
 *                         type: string
 *                         example: quiz_1633036800000_123
 */
router.post("/create-question", auth, createCompatibilityQuestions);

/**
 * @swagger
 * /api/compatibility/get-quiz/{quizCode}:
 *   get:
 *     summary: Get compatibility quiz by code
 *     description: Returns compatibility quiz details by quiz code
 *     tags:
 *       - Compatibility
 *     parameters:
 *       - name: quizCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: quiz_1633036800000_123
 *     responses:
 *       200:
 *         description: Compatibility quiz fetched successfully
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
 *                   example: Compatibility quiz fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: How compatible are we?
 *                     description:
 *                       type: string
 *                       example: ""
 *                     quiz_code:
 *                       type: string
 *                       example: quiz_1633036800000_123
 *                     active:
 *                       type: string
 *                       example: "1"
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           question:
 *                             type: string
 *                             example: How do I handle stress?
 *                           category_id:
 *                             type: integer
 *                             example: 1
 *                           category_title:
 *                             type: string
 *                             example: Personal
 *                           answer_a:
 *                             type: string
 *                             example: Exercise
 *                           answer_b:
 *                             type: string
 *                             example: Music
 *                           answer_c:
 *                             type: string
 *                             example: Talk to friends?
 *                           answer_d:
 *                             type: string
 *                             example: Alone Time
 *                           correct_option:
 *                             type: string
 *                             example: answer_a
 */
router.get("/get-quiz/:quizCode", getQuizByCode);

/**
 * @swagger
 * /api/compatibility/submit-quiz:
 *   post:
 *     summary: Submit compatibility quiz answers
 *     description: Submits the answers for a compatibility quiz
 *     tags:
 *       - Compatibility
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quiz_code:
 *                 type: string
 *                 example: quiz_1633036800000_123
 *               user:
 *                 type: string
 *                 example: user_12345
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 1
 *                     selected_option:
 *                       type: string
 *                       example: answer_a
 *     responses:
 *       200:
 *         description: Quiz answers submitted successfully
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
 *                   example: Quiz answers submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                       example: 3
 */
router.post("/submit-quiz", submitQuizAnswers);

/**
 * @swagger
 * /api/compatibility/get-quiz-list:
 *   get:
 *     summary: Get quiz list
 *     description: Fetches the list of quizzes for the authenticated user
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz list fetched successfully
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
 *                   example: Quiz list fetched successfully
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
 *                         example: How compatible are we?
 *                       description:
 *                         type: string
 *                         example: ""
 *                       quiz_code:
 *                         type: string
 *                         example: quiz_1633036800000_123
 *                       created:
 *                         type: string
 *                         example: "2023-10-01T12:00:00Z"
 *                       no_of_responses:
 *                         type: integer
 *                         example: 10
 */
router.get("/get-quiz-list", auth, getQuizList);

/**
 * @swagger
 * /api/compatibility/my-quiz-result/{quizCode}:
 *   get:
 *     summary: Get my quiz results
 *     description: Fetches the quiz results for the authenticated user
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: quiz_1633036800000_123
 *     responses:
 *       200:
 *         description: Quiz results fetched successfully
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
 *                   example: Quiz results fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     quiz:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         title:
 *                           type: string
 *                           example: How compatible are we?
 *                         description:
 *                           type: string
 *                           example: ""
 *                         quiz_code:
 *                           type: string
 *                           example: quiz_1633036800000_123
 *                         created:
 *                           type: string
 *                           example: "2023-10-01T12:00:00Z"
 *                         no_of_responses:
 *                           type: integer
 *                           example: 10
 *                     topResult:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           example: user_12345
 *                         score:
 *                           type: integer
 *                           example: 5
 *                     allResult:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             example: user_12345
 *                           score:
 *                             type: integer
 *                             example: 3
 */
router.get("/my-quiz-result/:quizCode", auth, myQuizResults);

/**
 * @swagger
 * /api/compatibility/my-quiz-response/{quizCode}/{userName}:
 *   get:
 *     summary: Get my quiz responses
 *     description: Fetches the quiz responses for the authenticated user
 *     tags:
 *       - Compatibility
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: quiz_1633036800000_123
 *       - name: userName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: user_12345
 *     responses:
 *       200:
 *         description: Quiz responses fetched successfully
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
 *                   example: Quiz responses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question_id:
 *                         type: integer
 *                         example: 1
 *                       answer:
 *                         type: string
 *                         example: "A"
 *                       correct_answer:
 *                         type: string
 *                         example: "B"
 *                       answer_type:
 *                         type: string
 *                         example: "CORRECT"
 */
router.get("/my-quiz-response/:quizCode/:userName", auth, getResultByUser);

module.exports = router;