const db = require("../config/db");

const Compatibility = {
    findByEmail: async(email) => {
        const [rows] = await db.query("SELECT users.* FROM users WHERE email = ?", [email]);
        return rows[0];
    },
    getTemplates: async() => {
        const query = `
            SELECT ct.id, ct.title, ct.description, ct.icon
            FROM compatibility_templates ct
            WHERE ct.active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    getQuestionsCategories: async() => {
        const query = `
            SELECT cqc.id, cqc.title
            FROM compatibility_questions_category cqc
            WHERE cqc.active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    getQuestions: async() => {
        const query = `
            SELECT cq.id, cq.question, cq.category_id, cqc.title AS category_title, answer_a, answer_b, answer_c, answer_d
            FROM compatibility_questions cq
            JOIN compatibility_questions_category cqc ON cq.category_id = cqc.id
            WHERE cq.active = '1' and cqc.active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    createQuestion: async(data) => {
        const query = `
            INSERT INTO compatibility_questions_quiz (question, category_id, answer_a, answer_b, answer_c, answer_d, correct_option, quiz_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.question,
            data.category_id,
            data.answer_a,
            data.answer_b,
            data.answer_c,
            data.answer_d,
            data.correct_option,
            data.quiz_id
        ];
        // console.log('Last Query:', db.format(query, params));
        // return
        const [result] = await db.query(query, params);
        return result;
    },
    createQuiz: async(data) => {
        const query = `
            INSERT INTO compatibility_questions_quiz_details (user_id, title, description, quiz_code, active)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            data.user_id,
            data.title,
            data.description,
            data.quiz_code,
            "1"
        ];
        const [result] = await db.query(query, params);
        return result;
    },
    getQuizByCode: async(quizCode) => {
        const query = `
            SELECT cq.id, cq.title, cq.description, cq.quiz_code, cq.active, cq.no_of_responses, cq.created 
            FROM compatibility_questions_quiz_details cq
            WHERE cq.quiz_code = ? AND cq.active = '1'
        `;
        const [rows] = await db.query(query, [quizCode]);
        return rows[0];
    },
    getQuestionsByQuizId: async(quizId) => {
        const query = `
            SELECT cq.id, cq.question, cq.category_id, cqc.title AS category_title, answer_a, answer_b, answer_c, answer_d, correct_option
            FROM compatibility_questions_quiz cq
            JOIN compatibility_questions_category cqc ON cq.category_id = cqc.id
            WHERE cq.quiz_id = ?
        `;
        const [rows] = await db.query(query, [quizId]);
        return rows;
    },
    getQuestionById: async(questionId) => {
        const query = `
            SELECT cq.id, cq.question, cq.category_id, cqc.title AS category_title, answer_a, answer_b, answer_c, answer_d, correct_option
            FROM compatibility_questions_quiz cq
            JOIN compatibility_questions_category cqc ON cq.category_id = cqc.id
            WHERE cq.id = ?
        `;
        const [rows] = await db.query(query, [questionId]);
        return rows[0];
    },
    calculateScore: async(answers, user, quizId) => {


        // store user info in compatibility_questions_quiz_result_details
        const query = `
            INSERT INTO compatibility_questions_quiz_result_details (user, quiz_id, quiz_total)
            VALUES (?, ?, ?)
        `;
        const params = [user, quizId, 0]; // Initial score is 0
        var result = await db.query(query, params);

        // Logic to calculate score based on quizId and answers
        // This is a placeholder implementation
        let score = 0;
        for (const answer of answers) {

            const question = await Compatibility.getQuestionById(answer.question_id);

            // store every answer in compatibility_questions_quiz_result
            const answerQuery = `
                INSERT INTO compatibility_questions_quiz_results (question_id, answer, correct_answer, answer_type, result_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            let answerType = 'WRONG'; // Default answer type
            if (question && question.correct_option === answer.selected_option) {
                score++;
                answerType = 'CORRECT';
            }

            // update compatibility_questions_quiz_result_details with the score
            const updateQuery = `
                UPDATE compatibility_questions_quiz_result_details
                SET quiz_total = ?
                WHERE id = ?
            `;
            const updateParams = [score, result[0].insertId];
            await db.query(updateQuery, updateParams);

            const answerParams = [answer.question_id, answer.selected_option, question.correct_option, answerType, result[0].insertId];
            await db.query(answerQuery, answerParams);
        }

        // update compatibility_questions_quiz_details with +1 no_of_responses
        const updateQuizQuery = `
                UPDATE compatibility_questions_quiz_details
                SET no_of_responses = no_of_responses + 1
                WHERE id = ?
            `;
        const updateQuizParams = [quizId];
        await db.query(updateQuizQuery, updateQuizParams);

        return score;
    },
    getTopQuizResults: async(quizId) => {
        const query = `
            SELECT cr.user, cr.quiz_total, cr.id
            FROM  compatibility_questions_quiz_result_details cr 
            WHERE cr.quiz_id = ?
            Order by cr.quiz_total DESC
            limit 3
        `;

        const [rows] = await db.query(query, [quizId]);
        return rows;
    },
    getAllQuizResults: async(quizId) => {
        const query = `
            SELECT cr.user, cr.quiz_total, cr.id
            FROM  compatibility_questions_quiz_result_details cr
            WHERE cr.quiz_id = ?
            Order by cr.created ASC
        `;
        const [rows] = await db.query(query, [quizId]);
        return rows;
    },
    getAllQuizzes: async(userId) => {
        const query = `
            SELECT cq.id, cq.title, cq.description, cq.quiz_code, cq.active, cq.no_of_responses, cq.created
            FROM compatibility_questions_quiz_details cq
            WHERE cq.user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    getQuizResultByUser: async(quizId, user) => {
        const query = `
            SELECT cr.id, cr.quiz_total, cr.created
            FROM compatibility_questions_quiz_result_details cr
            WHERE cr.quiz_id = ? AND cr.user = ?
        `;

        const [rows] = await db.query(query, [quizId, user]);
        return rows[0];
    },
    getQuizResponseByUser: async(resultId) => {

        const query = `
            SELECT cr.id, cr.question_id, cr.answer, cr.correct_answer, cr.answer_type
            FROM compatibility_questions_quiz_results cr
            WHERE cr.result_id = ?
        `;
        const [rows] = await db.query(query, [resultId]);
        return rows;
    },
    getTotalGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM compatibility_questions_quiz_details
            WHERE user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTotalResponsesCountByUser: async(userId) => {
        const query = `
            SELECT SUM(no_of_responses) as total_responses
            FROM compatibility_questions_quiz_details
            WHERE user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_responses;
    },
    getTodaysActiveGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM compatibility_questions_quiz_details
            WHERE user_id = ? AND DATE(created) = CURDATE()
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTodaysActiveGamesByUser: async(userId) => {
        const query = `
            SELECT id, title, quiz_code, no_of_responses, created
            FROM compatibility_questions_quiz_details
            WHERE user_id = ? AND DATE(created) = CURDATE() AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }
};

module.exports = Compatibility;