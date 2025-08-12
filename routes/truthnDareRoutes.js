const express = require("express");
const auth = require("../middlewares/authMiddleWare");
const { getTruthOrDareTemplate, createTruthnDareGame, getListOfMygames, getGameResponses, playGame, getGameDetailsByGameCode } = require("../controllers/truthnDareController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Truth n Dare
 *     description: API endpoints for truth n dare features
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
 * /api/truth-n-dare/get-templates:
 *   get:
 *     summary: Get truth n dare templates
 *     description: Returns a list of truth n dare templates
 *     tags:
 *       - Truth n Dare
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: truth and dare template fetched successfully
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
 *                   example: truth and dare template fetched successfully
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
 */
router.get("/get-templates", auth, getTruthOrDareTemplate);

/**
 * @swagger
 * /api/truth-n-dare/create-game:
 *   post:
 *     summary: Create a new truth n dare game
 *     description: Creates a new truth n dare game
 *     tags:
 *       - Truth n Dare
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
 *                 example: "My Truth or Dare Game"
 *     responses:
 *       200:
 *         description: Game created successfully
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
 *                   example: Game created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     gameLink:
 *                       type: string
 *                       example: "quiz_1633036800000_123"
 */
router.post("/create-game", auth, createTruthnDareGame);

/**
 * @swagger
 * /api/truth-n-dare/my-games:
 *   get:
 *     summary: Get list of my games
 *     description: Returns a list of games created by the authenticated user
 *     tags:
 *       - Truth n Dare
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of games retrieved successfully
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
 *                   example: List of games retrieved successfully
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
 *                         example: "My Truth or Dare Game"
 *                       game_link:
 *                         type: string
 *                         example: "quiz_1633036800000_123"
 *                       no_of_responses:
 *                         type: integer
 *                         example: 5
 */
router.get("/my-games", auth, getListOfMygames);

/**
 * @swagger
 * /api/truth-n-dare/game-responses/{gameId}:
 *   get:
 *     summary: Get responses for a specific game
 *     description: Returns a list of responses for the specified truth n dare game
 *     tags:
 *       - Truth n Dare
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: The ID of the game to retrieve responses for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of responses retrieved successfully
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
 *                   example: List of responses retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user:
 *                         type: string
 *                         example: "User123"
 *                       response:
 *                         type: string
 *                         example: "I dare you to sing a song!"
 *                       created:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-01T12:00:00Z"
 */
router.get("/game-responses/:gameId", auth, getGameResponses);

/**
 * @swagger
 * /api/truth-n-dare/play-game:
 *   post:
 *     summary: Play a truth n dare game
 *     description: Submits a response for a specific truth n dare game
 *     tags:
 *       - Truth n Dare
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: integer
 *                 example: 1
 *               user:
 *                 type: string
 *                 example: "User123"
 *               response:
 *                 type: string
 *                 example: "I dare you to sing a song!"
 *     responses:
 *       200:
 *         description: Game played successfully
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
 *                   example: "Game played successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     played:
 *                       type: boolean
 *                       example: true
 */
router.post("/play-game", auth, playGame);

/**
 * @swagger
 * /api/truth-n-dare/game-details/{gameCode}:
 *   get:
 *     summary: Get details for a specific game
 *     description: Returns details for the specified truth n dare game
 *     tags:
 *       - Truth n Dare
 *     parameters:
 *       - in: path
 *         name: gameCode
 *         required: true
 *         description: The code of the game to retrieve details for
 *         schema:
 *           type: string
 *           example: "quiz_1633036800000_123"
 *     responses:
 *       200:
 *         description: Game details retrieved successfully
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
 *                   example: "Game details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "My Truth or Dare Game"
 *                     game_link:
 *                       type: string
 *                       example: "quiz_1633036800000_123"
 *                     no_of_responses:
 *                       type: integer
 *                       example: 5
 */
router.get("/game-details/:gameCode", getGameDetailsByGameCode);

module.exports = router;