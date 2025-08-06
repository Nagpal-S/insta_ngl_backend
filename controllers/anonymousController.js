const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Anonymous = require("../models/anonymousModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");

exports.getAnonymousTemplates = async (req, res) => {
    try {
        const templates = await Anonymous.getTemplates();

        if (!templates || templates.length === 0) {
            return errorResponse(res, "No anonymous templates found", 404);
        }

        successResponse(res, "Anonymous templates fetched successfully", templates);
    } catch (err) {
        errorResponse(res, "Error fetching anonymous templates", 500, err.message);
    }
};

exports.createAnonymousQuiz = async (req, res) => {
    try {
        const { template_id } = req.body;
        if (!template_id) {
            return errorResponse(res, "Template ID is required", 400);
        }

        const quizCode = `quiz_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        // create overall quiz details
        const details = {
            user_id: req.userInfo.id,
            message_code: quizCode,
            template_id: template_id,
            active: "1"
        };

        const newQuiz = await Anonymous.createQuiz(details);
        if (!newQuiz || !newQuiz.insertId) {
            return errorResponse(res, "Failed to create anonymous quiz", 500);
        }
        successResponse(res, "Anonymous quiz created successfully", {message_code: quizCode, id: newQuiz.insertId});
    } catch (err) {
        errorResponse(res, "Error creating anonymous quiz", 500, err.message);
    }
};

exports.sendAnonymousMessage = async (req, res) => {
    try {
        const { message_code, message, user } = req.body;
        if (!message_code || !message) {
            return errorResponse(res, "Message code and message are required", 400);
        }

        const messageQuiz = await Anonymous.getQuizByCode(message_code);
        if (!messageQuiz) {
            return errorResponse(res, "Quiz not found", 404);
        }
        
        const result = await Anonymous.saveMessage({ message_id: messageQuiz.id, message, user });
        if (!result || !result.insertId) {
            return errorResponse(res, "Failed to send anonymous message", 500);
        }
        successResponse(res, "Anonymous message sent successfully", { message });
    } catch (err) {
        errorResponse(res, "Error sending anonymous message", 500, err.message);
    }
};

exports.getMyAnonymousQuizzes = async (req, res) => {
    try {
        const userId = req.userInfo.id;
        const quizzes = await Anonymous.getMyQuizzes(userId);
        if (!quizzes || quizzes.length === 0) {
            return errorResponse(res, "No anonymous quizzes found", 404);
        }
        successResponse(res, "Anonymous quizzes fetched successfully", quizzes);
    } catch (err) {
        errorResponse(res, "Error fetching anonymous quizzes", 500, err.message);
    }
};

exports.getMyAnonymousQuizResponse = async (req, res) => {
    try {
        const { message_code } = req.params;
        if (!message_code) {
            return errorResponse(res, "Message code is required", 400);
        }
        const messageQuiz = await Anonymous.getQuizByCode(message_code);
        if (!messageQuiz) {
            return errorResponse(res, "Quiz not found", 404);
        }
        const responses = await Anonymous.getMyQuizResponses(messageQuiz.id);
        if (!responses || responses.length === 0) {
            return errorResponse(res, "No responses found for this quiz", 404);
        }
        successResponse(res, "Anonymous quiz responses fetched successfully", responses);
    } catch (err) {
        errorResponse(res, "Error fetching anonymous quiz responses", 500, err.message);
    }
};
