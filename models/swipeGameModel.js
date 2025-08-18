const db = require("../config/db");

const SwipeGame = {
    getQuestions: async() => {
        const query = `
            SELECT sgq.id, sgq.question, sgq.icon
            FROM swipe_game_questions_template sgq
            WHERE sgq.active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    createGame: async(userId, gameCode, title) => {
        const query = `
            INSERT INTO swipe_game (user_id, active, no_of_responses, game_code, title)
            VALUES (?, '1', 0, ?, ?)
        `;
        const [result] = await db.query(query, [userId, gameCode, title]);
        return result.insertId; // Return the ID of the newly created game
    },
    setQuestion: async(question, gameId) => {
        const query = `
            INSERT INTO swipe_game_questions (question, game_id, left_swipe_count, right_swipe_count)
            VALUES (?, ?, 0, 0)
        `;
        const [result] = await db.query(query, [question, gameId]);
        return result;
    },
    getGameByCode: async(gameCode) => {
        const query = `
            SELECT *
            FROM swipe_game
            WHERE game_code = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [gameCode]);
        return rows[0]; // Return the first game found
    },
    getQuestionsByGameId: async(gameId) => {
        const query = `
            SELECT sgq.id, sgq.question
            FROM swipe_game_questions sgq
            WHERE sgq.game_id = ?
        `;
        const [rows] = await db.query(query, [gameId]);
        return rows;
    },
    handleSwipe: async(game_code, questionsList, user) => {
        // Process each question swipe

        // insert swipe_game_questions_result_details user, total_left, total_right, game_id
        // Update the swipe counts for each question
        if (!Array.isArray(questionsList) || questionsList.length === 0) {
            throw new Error("Invalid questions list");
        }

        const query = `
            SELECT *
            FROM swipe_game
            WHERE game_code = ?
        `;
        const [gameInfo] = await db.query(query, [game_code]);

        // console.log("Game Info:", gameInfo[0].id);

        // total_left and total_right counters
        let total_left = 0;
        let total_right = 0;

        const [res] = await db.query(`
            INSERT INTO swipe_game_questions_result_details (user, total_left, total_right, game_id)
            VALUES (?, ?, ?, ?)
        `, [user, total_left, total_right, gameInfo[0].id]);

        // console.log("Swipe Game Result Inserted:", res['insertId']);


        // count them from questionsList
        questionsList.forEach(async q => {
            if (q.swipeDirection === 'left') {
                total_left++;
            } else if (q.swipeDirection === 'right') {
                total_right++;
            }

            // insert swipe_game_questions_result with result_id, question_id, swipe_type
            const cr = await db.query(`
                INSERT INTO swipe_game_questions_result (result_id, question_id, swipe_type)
                VALUES (?, ?, ?)
            `, [res['insertId'], q.questionId, q.swipeDirection]);

            const ur = await db.query(`
                    UPDATE swipe_game_questions
                    SET ${q.swipeDirection}_swipe_count = ${q.swipeDirection}_swipe_count + 1
                    WHERE id = ?
                `, [q.questionId]);

            // update total_left and total_right in swipe_game_questions_result_details
            await db.query(`
                UPDATE swipe_game_questions_result_details
                SET total_left = ?, total_right = ?
                WHERE id = ?
            `, [total_left, total_right, res['insertId']]);
        });

        // update no_of_responses in swipe_game
        await db.query(`
            UPDATE swipe_game
            SET no_of_responses = no_of_responses + 1
            WHERE id = ?
        `, [gameInfo[0].id]);

        return true;

    },
    getGamesByUserId: async(userId) => {
        const query = `
            SELECT id, title, game_code, no_of_responses, created
            FROM swipe_game
            WHERE user_id = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    getGameInfoById: async(gameId) => {
        const query = `
            SELECT id, question, left_swipe_count, right_swipe_count
            FROM swipe_game_questions
            WHERE game_id = ?
        `;
        const [rows] = await db.query(query, [gameId]);
        return rows;
    },
    getTopRightSwipe: async(gameId) => {
        const query = `
            SELECT user, total_left, total_right
            FROM swipe_game_questions_result_details
            WHERE game_id = ?
            ORDER BY total_right DESC
            LIMIT 3
        `;
        const [rows] = await db.query(query, [gameId]);
        return rows;
    },
    getTotalGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM swipe_game
            WHERE user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTotalResponsesCountByUser: async(userId) => {
        const query = `
            SELECT SUM(no_of_responses) as total_responses
            FROM swipe_game
            WHERE user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_responses;
    },
    getTodaysActiveGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM swipe_game
            WHERE user_id = ? AND DATE(created) = CURDATE()
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTodaysActiveGamesByUser: async(userId) => {
        const query = `
            SELECT id, title, game_code, no_of_responses, created
            FROM swipe_game
            WHERE user_id = ? AND DATE(created) = CURDATE() AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }
};

module.exports = SwipeGame;