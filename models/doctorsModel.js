const doctorsModel = {

    // Get the doctors login credentials
    async getDoctorsAuth(username) {
        const query = "SELECT username, hashed_password FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result;
    },

    // Returns the doctors last name
    async getLastName(username) {
        const query = "SELECT last_name FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0].last_name;
    }
}

module.exports = doctorsModel;