const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SwipeGame = require("../models/swipeGameModel");
const Compatibility = require("../models/compatibilityModel");
const TruthnDare = require("../models/truthnDareModel");
const Anonymous = require("../models/anonymousModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");

exports.userHomePageInfo = async(req, res) => {

    try {

        const userId = req.userInfo.id

        const [swipeGameQuestions, compatibilityQuestions, truthDareQuestions, anonymousQuestions] = await Promise.all([
            SwipeGame.getTotalGamesCountByUser(userId),
            Compatibility.getTotalGamesCountByUser(userId),
            TruthnDare.getTotalGamesCountByUser(userId),
            Anonymous.getTotalGamesCountByUser(userId)
        ]);

        const [countResponsesFromSwipeGame, countResponsesFromCompatibility, countResponsesFromTruthDare, countResponsesFromAnonymous] = await Promise.all([
            SwipeGame.getTotalResponsesCountByUser(userId),
            Compatibility.getTotalResponsesCountByUser(userId),
            TruthnDare.getTotalResponsesCountByUser(userId),
            Anonymous.getTotalResponsesCountByUser(userId)
        ]);

        const [countTodaysActiveSwipeGame, countTodaysActiveCompatibilityGames, countTodaysActiveTruthDareGames, countTodaysActiveAnonymousGames] = await Promise.all([
            SwipeGame.getTodaysActiveGamesCountByUser(userId),
            Compatibility.getTodaysActiveGamesCountByUser(userId),
            TruthnDare.getTodaysActiveGamesCountByUser(userId),
            Anonymous.getTodaysActiveGamesCountByUser(userId)
        ]);

        successResponse(res, "User home page info fetched successfully", {
            swipeGame: {
                totalGames: swipeGameQuestions,
                totalResponses: countResponsesFromSwipeGame,
                todaysActiveGames: countTodaysActiveSwipeGame
            },
            compatibility: {
                totalGames: compatibilityQuestions,
                totalResponses: countResponsesFromCompatibility,
                todaysActiveGames: countTodaysActiveCompatibilityGames
            },
            truthDare: {
                totalGames: truthDareQuestions,
                totalResponses: countResponsesFromTruthDare,
                todaysActiveGames: countTodaysActiveTruthDareGames
            },
            anonymous: {
                totalGames: anonymousQuestions,
                totalResponses: countResponsesFromAnonymous,
                todaysActiveGames: countTodaysActiveAnonymousGames
            }
        });

    } catch (error) {
        errorResponse(res, "Error fetching user home page info", 500, error.message);
    }

};

exports.userActiveGamesInfo = async(req, res) => {
    try {
        const userId = req.userInfo.id;

        const [activeSwipeGames, activeCompatibilityGames, activeTruthDareGames, activeAnonymousGames] = await Promise.all([
            SwipeGame.getTodaysActiveGamesByUser(userId),
            Compatibility.getTodaysActiveGamesByUser(userId),
            TruthnDare.getTodaysActiveGamesByUser(userId),
            Anonymous.getTodaysActiveGamesByUser(userId)
        ]);

        successResponse(res, "User active games info fetched successfully", {
            swipeGame: {
                todaysActiveGames: activeSwipeGames
            },
            compatibility: {
                todaysActiveGames: activeCompatibilityGames
            },
            truthDare: {
                todaysActiveGames: activeTruthDareGames
            },
            anonymous: {
                todaysActiveGames: activeAnonymousGames
            }
        });

    } catch (error) {
        errorResponse(res, "Error fetching user active games info", 500, error.message);
    }
};