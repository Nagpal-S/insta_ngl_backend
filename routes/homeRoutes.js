const express = require("express");
const auth = require("../middlewares/authMiddleWare");
const { userHomePageInfo, userActiveGamesInfo } = require("../controllers/homeController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Home Page
 *     description: API endpoints for home page features
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
 * /api/home-page/get-home-info:
 *   get:
 *     summary: Get user home page info
 *     description: Returns user home page info including game statistics
 *     tags:
 *       - Home Page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User home page info fetched successfully
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
 *                   example: User home page info fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     swipeGame:
 *                       type: object
 *                       properties:
 *                         totalGames:
 *                           type: integer
 *                           example: 5
 *                         totalResponses:
 *                           type: integer
 *                           example: 10
 *                         todaysActiveGames:
 *                           type: integer
 *                           example: 2
 *                     compatibility:
 *                       type: object
 *                       properties:
 *                         totalGames:
 *                           type: integer
 *                           example: 3
 *                         totalResponses:
 *                           type: integer
 *                           example: 7
 *                         todaysActiveGames:
 *                           type: integer
 *                           example: 1
 *                     truthDare:
 *                       type: object
 *                       properties:
 *                         totalGames:
 *                           type: integer
 *                           example: 4
 *                         totalResponses:
 *                           type: integer
 *                           example: 8
 *                         todaysActiveGames:
 *                           type: integer
 *                           example: 2
 */
router.get("/get-home-info", auth, userHomePageInfo);

/**
 * @swagger
 * /api/home-page/get-active-games-info:
 *   get:
 *     summary: Get user active games info
 *     description: Returns user active games info including game statistics
 *     tags:
 *       - Home Page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User active games info fetched successfully
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
 *                   example: User active games info fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     swipeGame:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         game_code:
 *                           type: string
 *                           example: "game_10"
 *                         title:
 *                           type: string
 *                           example: "Swipe Game"
 *                     compatibility:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         game_code:
 *                           type: string
 *                           example: "game_10"
 *                         title:
 *                           type: string
 *                           example: "Swipe Game"
 *                     truthDare:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         game_code:
 *                           type: string
 *                           example: "game_10"
 *                         title:
 *                           type: string
 *                           example: "Swipe Game"
 */
router.get("/get-active-games-info", auth, userActiveGamesInfo);

module.exports = router;