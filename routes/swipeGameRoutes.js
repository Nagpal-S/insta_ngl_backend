const express = require("express");
const auth = require("../middlewares/authMiddleWare");
const { getSwipeGameQuestions, setSwipeGameQuestion, getGameByCode, playSwipeGame, getListOfMyGames, getMyGameDetails } = require("../controllers/swipeGameController");
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



/** * @swagger
 * /api/swipe-game/get-questions:
 *   get:
 *     summary: Get swipe game questions
 *     description: Returns a list of swipe game questions
 *     tags:
 *       - Swipe Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Swipe game questions fetched successfully
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
 *                   example: Swipe game questions fetched successfully
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
 *                         example: "What is your favorite color?"
 *                       icon:
 *                         type: string
 *                         example: "🎨"
 */
router.get("/get-questions", auth, getSwipeGameQuestions);

/** * @swagger
 * /api/swipe-game/set-questions:
 *   post:
 *     summary: Set swipe game questions
 *     description: Sets the swipe game questions for a user
 *     tags:
 *       - Swipe Game
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
 *                 example: "Fun Quiz"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "What is your favorite color?"
 *     responses:
 *       200:
 *         description: Swipe game questions set successfully
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
 *                   example: Swipe game questions set successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     gameId:
 *                       type: integer
 *                       example: 1
 *                     gameCode:
 *                       type: string
 *                       example: "quiz_1633036800000_123"
 */
router.post("/set-questions", auth, setSwipeGameQuestion);

/** * @swagger
 * /api/swipe-game/get-game/{gameCode}:
 *   get:
 *     summary: Get swipe game by code
 *     description: Returns the swipe game details by game code
 *     tags:
 *       - Swipe Game
 *     parameters:
 *       - in: path
 *         name: gameCode
 *         required: true
 *         description: The code of the game to retrieve
 *         schema:
 *           type: string
 *           example: "quiz_1633036800000_123"
 *     responses:
 *       200:
 *         description: Swipe game fetched successfully
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
 *                   example: Swipe game fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     game:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         user_id:
 *                           type: integer
 *                           example: 1
 *                         active:
 *                           type: string
 *                           example: "1"
 *                         no_of_responses:
 *                           type: integer
 *                           example: 0
 *                         game_code:
 *                           type: string
 *                           example: "quiz_1633036800000_123"
 *                     gameQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           question:
 *                             type: string
 *                             example: "What is your favorite color?"
 */
router.get("/get-game/:gameCode", getGameByCode);

/** * @swagger
 * /api/swipe-game/play:
 *   post:
 *     summary: Play swipe game
 *     description: Process swipe actions for the game
 *     tags:
 *       - Swipe Game
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameCode:
 *                 type: string
 *                 example: "quiz_1633036800000_123"
 *               user:
 *                 type: string
 *                 example: "SN"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 1
 *                     swipeDirection:
 *                       type: string
 *                       enum: [left, right]
 *                       example: left
 *     responses:
 *       200:
 *         description: Swipe actions processed successfully
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
 *                   example: Swipe actions processed successfully
 *       500:
 *         description: Error processing swipe actions
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
 *                   example: Error processing swipe actions
 */
router.post("/play", playSwipeGame);

/** * @swagger
 * /api/swipe-game/my-games:
 *   get:
 *     summary: Get list of my games
 *     description: Fetch all games created by the authenticated user
 *     tags:
 *       - Swipe Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of games fetched successfully
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
 *                   example: Games fetched successfully
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
 *                         example: "Fun Quiz"
 *                       game_code:
 *                         type: string
 *                         example: "quiz_1633036800000_123"
 *                       no_of_responses:
 *                         type: integer
 *                         example: 0
 *                       created:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-01T12:00:00Z"
 */
router.get("/my-games", auth, getListOfMyGames);


/**
 * @swagger
 * /api/swipe-game/my-game-details/{gameId}:
 *   get:
 *     summary: Get my game details
 *     description: Fetch details of a specific game created by the authenticated user
 *     tags:
 *       - Swipe Game
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID of the game to fetch details for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Game details fetched successfully
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
 *                   example: Game details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     game:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         question:
 *                           type: string
 *                           example: "Dance with me?"
 *                         left_swipe_count:
 *                           type: integer
 *                           example: 2
 *                         right_swipe_count:
 *                           type: integer
 *                           example: 0
 *                     topRightSwipe:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             example: "SdN"
 *                           total_left:
 *                             type: integer
 *                             example: 1
 *                           total_right:
 *                             type: integer
 *                             example: 1
 *       404:
 *         description: Game not found
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
 *                   example: Game not found
 */

router.get("/my-game-details/:gameId", auth, getMyGameDetails);

module.exports = router;