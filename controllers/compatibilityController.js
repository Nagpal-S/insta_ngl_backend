const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Compatibility = require("../models/compatibilityModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");

exports.getCompatibilityTemplates = async (req, res) => {
    try {
        const templates = await Compatibility.getTemplates();

        if(!templates || templates.length === 0) {
            return errorResponse(res, "No compatibility templates found", 404);
        }
        
        successResponse(res, "Compatibility templates fetched successfully", templates);
    } catch (err) {
        errorResponse(res, "Error fetching compatibility templates", 500, err.message);
    }
};

exports.getCompatibilityQuestionsCategories = async (req, res) => {
    try {
        const categories = await Compatibility.getQuestionsCategories();

        if(!categories || categories.length === 0) {
            return errorResponse(res, "No compatibility questions categories found", 404);
        }

        successResponse(res, "Compatibility questions categories fetched successfully", categories);
    } catch (err) {
        errorResponse(res, "Error fetching compatibility questions categories", 500, err.message);
    }
};

exports.getCompatibilityQuestions = async (req, res) => {
    try {
        const questions = await Compatibility.getQuestions();

        if(!questions || questions.length === 0) {
            return errorResponse(res, "No compatibility questions found", 404);
        }

        successResponse(res, "Compatibility questions fetched successfully", questions);
    } catch (err) {
        errorResponse(res, "Error fetching compatibility questions", 500, err.message);
    }
};

exports.createCompatibilityQuestions = async (req, res) => {
    try {
        const questions = req.body.questions;

        if (!Array.isArray(questions) || questions.length === 0) {
            return errorResponse(res, "Questions array is required", 400);
        }

        const createdQuestions = [];

        const quizCode = `quiz_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        // create overall quiz details
        const quizDetails = {
            user_id: req.userInfo.id,
            title: req.body.title,
            description: req.body.description,
            quiz_code: quizCode,
            active: "1"
        };

        const quiz = await Compatibility.createQuiz(quizDetails);
        if(!quiz || !quiz.insertId) {
            return errorResponse(res, "Error creating compatibility quiz", 500);
        }

        for (const q of questions) {
            const { question, category_id, answer_a, answer_b, answer_c, answer_d, correct_option } = q;

            if (!question || !category_id || !answer_a || !answer_b || !answer_c || !answer_d || !correct_option) {
                return errorResponse(res, "All fields are required for each question", 400);
            }

            // Generate a unique quiz code for each question

            const newQuestion = await Compatibility.createQuestion({
                question,
                category_id,
                answer_a,
                answer_b,
                answer_c,
                answer_d,
                correct_option,
                quiz_id: quiz.insertId,
            });

            if (!newQuestion || !newQuestion.insertId) {
                return errorResponse(res, "Error creating compatibility question", 500);
            }

            
        }

        successResponse(res, "Compatibility questions created successfully", {
                quiz_id: quiz.insertId,
                quiz_code: quizCode
            });
    } catch (err) {
        errorResponse(res, "Error creating compatibility questions", 500, err.message);
    }
};

exports.getQuizByCode = async (req, res) => {
    try {
        const quizCode = req.params.quizCode;
        if (!quizCode) {
            return errorResponse(res, "Quiz code is required", 400);
        }
        const quiz = await Compatibility.getQuizByCode(quizCode);
        if (!quiz) {
            return errorResponse(res, "Quiz not found", 404);
        }
        const questions = await Compatibility.getQuestionsByQuizId(quiz.id);
        if (!questions || questions.length === 0) {
            return errorResponse(res, "No questions found for this quiz", 404);
        }
        successResponse(res, "Quiz fetched successfully", {
            quiz,
            questions
        });
    } catch (err) {
        errorResponse(res, "Error fetching quiz", 500, err.message);
    }
};

exports.submitQuizAnswers = async (req, res) => {
    try {
        const { quiz_code, answers, user } = req.body;

        if (!quiz_code || !answers || !Array.isArray(answers) || answers.length === 0) {
            return errorResponse(res, "Quiz code and answers are required", 400);
        }

        const quiz = await Compatibility.getQuizByCode(quiz_code);
        if (!quiz) {
            return errorResponse(res, "Quiz not found", 404);
        }

        const score = await Compatibility.calculateScore(answers, user, quiz.id);

        successResponse(res, "Quiz submitted successfully", { score });
    } catch (err) {
        errorResponse(res, "Error submitting quiz answers", 500, err.message);
    }
};

exports.getQuizList = async (req, res) => {
    try {
        const quizzes = await Compatibility.getAllQuizzes(req.userInfo.id);
        successResponse(res, "Quizzes fetched successfully", quizzes);
    } catch (err) {
        errorResponse(res, "Error fetching quizzes", 500, err.message);
    }
};

exports.myQuizResults = async (req, res) => {
    try {
        const quizCode = req.params.quizCode;

        if (!quizCode) {
            return errorResponse(res, "Quiz code is required", 400);
        }

        const quiz = await Compatibility.getQuizByCode(quizCode);
        if (!quiz) {
            return errorResponse(res, "Quiz not found", 404);
        }

        const topResults = await Compatibility.getTopQuizResults(quiz.id);
        if (!topResults || topResults.length === 0) {
            return errorResponse(res, "No results found for this quiz", 404);
        }

        const allResults = await Compatibility.getAllQuizResults(quiz.id);

        successResponse(res, "Quiz results fetched successfully", {
            quiz,
            topResults,
            allResults
        });
    } catch (err) {
        errorResponse(res, "Error fetching quiz results", 500, err.message);
    }
};

exports.getResultByUser = async (req, res) => {
    try {
        const user = req.params.userName;
        const quizCode = req.params.quizCode;

        if (!quizCode) {
            return errorResponse(res, "Quiz code is required", 400);
        }

        const quiz = await Compatibility.getQuizByCode(quizCode);
        if (!quiz) {
            return errorResponse(res, "Quiz not found", 404);
        }

        const resultOverview = await Compatibility.getQuizResultByUser(quiz.id, user);
        if (!resultOverview) {
            return errorResponse(res, "No result found for this user", 404);
        }

        const result = await Compatibility.getQuizResponseByUser(resultOverview.id);

        successResponse(res, "Quiz result fetched successfully", {
            quiz,
            resultOverview,
            result
        });
    } catch (err) {
        errorResponse(res, "Error fetching quiz result", 500, err.message);
    }
};
