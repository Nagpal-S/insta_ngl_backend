const db = require("../config/db");

/**
 * current sql table list
 * 
 * * truth_n_dare_templates
 * - id
 * - active
 * - title
 *
 * * truth_n_dare_games
 * - id
 * - title
 * - active
 * - user_id
 * - no_of_responses
 * - game_link
 * 
 * * truth_n_dares_games_responses
 * - id
 * - game_id
 * - user
 * - response
 * - created
 */

const TruthnDareGame = {
    getTemplates: async () => {
        const query = `
            SELECT id, title
            FROM truth_n_dare_templates
            WHERE active = '1'
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    createGame: async (title, gameLink) => {
        const query = `
            INSERT INTO truth_n_dare_games (title, active, no_of_responses, game_link)
            VALUES (?, '1', 0, ?)
        `;
        const [result] = await db.query(query, [title, gameLink]);
        if (result.affectedRows > 0) {
            return result.insertId;
        }
        return null;
    },
    getGamesByUserId: async (userId) => {
        const query = `
            SELECT id, title, game_link, no_of_responses
            FROM truth_n_dare_games
            WHERE user_id = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },
    getResponsesByGameId: async (gameId) => {
        const query = `
            SELECT id, user, response, created
            FROM truth_n_dare_games_responses
            WHERE game_id = ?
        `;
        const [rows] = await db.query(query, [gameId]);
        return rows;
    },
    playGame: async (gameId, user, response) => {
        const query = `
            INSERT INTO truth_n_dare_games_responses (game_id, user, response)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [gameId, user, response]);

        // update no_of_responses
        const updateQuery = `
            UPDATE truth_n_dare_games
            SET no_of_responses = no_of_responses + 1
            WHERE id = ?
        `;
        await db.query(updateQuery, [gameId]);

        return result.affectedRows > 0;
    },
    getGameDetailsByGameCode: async (gameCode) => {
        const query = `
            SELECT id, title, game_link, no_of_responses
            FROM truth_n_dare_games
            WHERE game_link = ? AND active = '1'
        `;
        const [rows] = await db.query(query, [gameCode]);
        return rows[0] || null;
    }
};
// b master ice cream 
module.exports = TruthnDareGame;