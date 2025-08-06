const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SwipeGame = require("../models/swipeGameModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");

exports.getSwipeGameQuestions = async (req, res) => {
    try {
        const questions = await SwipeGame.getQuestions();

        if (!questions || questions.length === 0) {
            return errorResponse(res, "No swipe game questions found", 404);
        }

        successResponse(res, "Swipe game questions fetched successfully", questions);
    } catch (err) {
        errorResponse(res, "Error fetching swipe game questions", 500, err.message);
    }
};

exports.setSwipeGameQuestion = async (req, res) => {
    try {

        const gameCode = `quiz_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // create game with userInfo.id
        const userId = req.userInfo.id;
        const title = req.body.title;
        const gameId = await SwipeGame.createGame(userId, gameCode, title);

        const questions = req.body.questions;

        // Validate and insert each question into the database
        await Promise.all(
            questions.map(q => {
                const { question } = q;
                // Insert question into the database
                return SwipeGame.setQuestion(question, gameId);
            })
        );
        successResponse(res, "Swipe game questions set successfully", {
            gameId,
            gameCode
        });
    } catch (err) {
        errorResponse(res, "Error setting swipe game questions", 500, err.message);
    }
};

exports.getGameByCode = async (req, res) => {
    try {
        const { gameCode } = req.params;
        const game = await SwipeGame.getGameByCode(gameCode);

        if (!game) {
            return errorResponse(res, "Game not found", 404);
        }

        const gameQuestions = await SwipeGame.getQuestionsByGameId(game.id);

        successResponse(res, "Game fetched successfully", { game, gameQuestions });
    } catch (err) {
        errorResponse(res, "Error fetching game", 500, err.message);
    }
};

exports.playSwipeGame = async (req, res) => {
    try {

        // req.body will have user and list of questions with question id and swipe direction
        const { gameCode, user, questions } = req.body;

        const result = await SwipeGame.handleSwipe(gameCode, questions, user);
        if (!result) {
            return errorResponse(res, "Error processing swipe actions", 500);
        }

        successResponse(res, "Swipe actions processed successfully");
    } catch (err) {
        errorResponse(res, "Error processing swipe actions", 500, err.message);
    }
};

exports.getListOfMyGames = async (req, res) => {
    try {
        const userId = req.userInfo.id;
        const games = await SwipeGame.getGamesByUserId(userId);
        if (!games || games.length === 0) {
            return errorResponse(res, "No games found for this user", 404);
        }
        successResponse(res, "Games fetched successfully", games);
    } catch (err) {
        errorResponse(res, "Error fetching games", 500, err.message);
    }
};

exports.getMyGameDetails = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = await SwipeGame.getGameInfoById(gameId);

        if (!game) {
            return errorResponse(res, "Game not found", 404);
        }

        const topRightSwipe = await SwipeGame.getTopRightSwipe(gameId);

        successResponse(res, "Game details fetched successfully", {game, topRightSwipe});
    } catch (err) {
        errorResponse(res, "Error fetching game details", 500, err.message);
    }
};
