const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const truthnDare = require("../models/truthnDareModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const e = require("express");

exports.getTruthOrDareTemplate = async (req, res) => {

    try {

        const templates = await truthnDare.getTemplates()
        if(!templates || templates.length == 0){

            errorResponse(res, "No templates found", 200)

        }

        successResponse(res, "Templates list found", templates)

    } catch (error) {

        errorResponse(res, "Error getting templates list" + error.message, 500)

    }

};

exports.createTruthnDareGame = async (req, res) => {

    try {

        // req.body will check title and create the truth and dare game
        const { title } = req.body;

        if (!title) {
            return errorResponse(res, "Title is required", 400);
        }

        const game_link = `quiz_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Assuming you have a function to create a game in your model
        const newGame = await truthnDare.createGame(title, game_link);
        if (!newGame) {
            return errorResponse(res, "Failed to create game", 500);
        }
        successResponse(res, "Game created successfully", { id: newGame, gameLink: game_link });
    } catch (error) {

        errorResponse(res, "Error creating game: " + error.message, 500);
        
    }

}

exports.getListOfMygames = async (req, res) => {
    try {
        const userId = req.userInfo.id; // Get user ID from the request
        const games = await truthnDare.getGamesByUserId(userId);
        if (!games || games.length === 0) {
            return errorResponse(res, "No games found", 404);
        }
        successResponse(res, "Games retrieved successfully", games);
    } catch (error) {
        errorResponse(res, "Error retrieving games: " + error.message, 500);
    }
};

exports.getGameResponses = async (req, res) => {
    try {
        const gameId = req.params.gameId; // Get game ID from the request parameters
        const responses = await truthnDare.getResponsesByGameId(gameId);
        if (!responses || responses.length === 0) {
            return errorResponse(res, "No responses found for this game", 404);
        }
        successResponse(res, "Responses retrieved successfully", responses);
    } catch (error) {
        errorResponse(res, "Error retrieving responses: " + error.message, 500);
    }
};

exports.playGame = async (req, res) => {
    try {
        const { response, gameId, user } = req.body; // Get response from the request body

        if (!response) {
            return errorResponse(res, "Response is required", 400);
        }

        const result = await truthnDare.playGame(gameId, user, response);
        if (!result) {
            return errorResponse(res, "Failed to play game", 500);
        }

        successResponse(res, "Game played successfully", {played: true});
    } catch (error) {
        errorResponse(res, "Error playing game: " + error.message, 500);
    }
};

exports.getGameDetailsByGameCode = async (req, res) => {
    try {
        const gameCode = req.params.gameCode; // Get game code from the request parameters
        const gameDetails = await truthnDare.getGameDetailsByGameCode(gameCode);
        if (!gameDetails) {
            return errorResponse(res, "Game not found", 404);
        }
        successResponse(res, "Game details retrieved successfully", gameDetails);
    } catch (error) {
        errorResponse(res, "Error retrieving game details: " + error.message, 500);
    }
};
