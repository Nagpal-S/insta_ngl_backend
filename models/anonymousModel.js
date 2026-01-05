const db = require("../config/db");

const Anonymous = {
    getTemplates: async() => {
        const query = `
            SELECT amt.id, amt.title, amt.description, amt.icon, amt.sub_title, amt.sub_description
            FROM anonymous_message_templates amt
            WHERE amt.active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    createQuiz: async(details) => {
        const query = `
            INSERT INTO anonymous_message (user_id, message_code, template_id, active, no_of_responses)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            details.user_id,
            details.message_code,
            details.template_id,
            details.active,
            0 // Assuming no_of_responses starts at 0
        ]);
        return result;
    },
    getQuizByCode: async(message_code) => {
        const query = `
            SELECT * FROM anonymous_message WHERE message_code = ? AND active = '1'
        `;
        const [result] = await db.query(query, [message_code]);
        return result[0]; // Return the first result
    },
    saveMessage: async({ message_id, message, user }) => {
        const query = `
            INSERT INTO anonymous_message_response (message_id, message, user)
            VALUES (?, ?, ?)
        `;

        const updateQuizQuery = `
                UPDATE anonymous_message
                SET no_of_responses = no_of_responses + 1
                WHERE id = ?
            `;
        await db.query(updateQuizQuery, [message_id]);
        const [result] = await db.query(query, [message_id, message, user]);
        return result;
    },
    getMyQuizzes: async(userId) => {
        const query = `
            SELECT am.id, am.message_code, am.template_id, am.active, am.no_of_responses, amt.title, amt.description, amt.icon, amt.sub_title, amt.sub_description
            FROM anonymous_message am
            JOIN anonymous_message_templates amt ON am.template_id = amt.id
            WHERE am.user_id = ? AND am.active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    getMyQuizResponses: async(messageId) => {
        const query = `
            SELECT amr.id, amr.message, amr.user, amr.created
            FROM anonymous_message_response amr
            WHERE amr.message_id = ?
        `;
        const [rows] = await db.query(query, [messageId]);
        return rows;
    },
    getTotalGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM anonymous_message
            WHERE user_id = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTotalResponsesCountByUser: async(userId) => {
        const query = `
            SELECT SUM(no_of_responses) as total_responses
            FROM anonymous_message
            WHERE user_id = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_responses;
    },
    getTodaysActiveGamesCountByUser: async(userId) => {
        const query = `
            SELECT COUNT(*) as total_games
            FROM anonymous_message
            WHERE user_id = ? AND active = '1' AND DATE(created) = CURDATE()
        `;
        const [rows] = await db.query(query, [userId]);
        return rows[0].total_games;
    },
    getTodaysActiveGamesByUser: async(userId) => {
        const query = `
            SELECT anonymous_message.*, anonymous_message_templates.title, anonymous_message_templates.description
            FROM anonymous_message
            LEFT JOIN anonymous_message_templates ON anonymous_message.template_id = anonymous_message_templates.id
            WHERE user_id = ? AND anonymous_message.active = '1'
            ORDER BY id DESC
            LIMIT 5
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }
};

module.exports = Anonymous;