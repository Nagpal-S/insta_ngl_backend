const db = require("../config/db");
// const { param } = require("../routes/socialRoutes");

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.query("SELECT users.* FROM users WHERE email = ?", [email]);
        return rows[0];
    },
    findBan: async (id) => {
        const [rows] = await db.query("SELECT * FROM ban_users WHERE user_id = ? AND remove = 0", [id]);
        return rows[0];
    },
    findByPhone: async (phone) => {

        const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
        return rows[0];

    },
    findById: async (id) => {

        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];

    },
    create: async (userData) => {
        const { username, email, password } = userData;
        const [result] = await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password]);
        return result.insertId;
    },
    searchByEmail: async (email) => {

        var query = "SELECT email FROM users WHERE email LIKE ?"
        var params = [`%${email}%`]  // `%` is the wildcard for partial matching
    
        // console.log('Last Query:', db.format(query, params));
        // return
        const [rows] = await db.execute(query, params);
        return rows;
    
    },
    updateDeviceId: async (id, deviceId) => {

        await db.execute("UPDATE users SET device_id = ? WHERE id = ?", [deviceId, id]);

    },

    updatePassword: async (id, password) => {

        await db.execute("UPDATE users SET password = ?, register = '1' WHERE id = ?", [password, id]);

    },
    employeeInventory: async (employee_id) => {

        var query = "SELECT * FROM materials_employee WHERE employee_id = ?"
        var params = [employee_id]
    
        // console.log('Last Query:', db.format(query, params));
        // return
        const [rows] = await db.execute(query, params);
        return rows;
    
    },
    employeeInventoryDetails: async (employee_id) => {

        var query = "SELECT states.name stateName, states.code stateCode, states.id stateId, materials_employee.quantity, materials.name, materials.name_spanish, materials_employee.material_id FROM materials_employee LEFT JOIN materials ON materials.id = materials_employee.material_id LEFT JOIN states ON materials.state_id = states.id  WHERE employee_id = ? AND states.remove = '0'"
        var params = [employee_id]
    
        // console.log('Last Query:', db.format(query, params));
        // return
        const [rows] = await db.execute(query, params);
        return rows;
    
    },

};

module.exports = User;

// console.log('Last Query:', db.format(query, params));
// return