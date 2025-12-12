const doctorsModel = {

    // Get the patient login credentials
    async getDoctorsAuth(username) {
        const query = "SELECT username, hashed_password FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result;
    },

    async getLastName(username) {
        const query = "SELECT last_name FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0].last_name;
    }
}

module.exports = doctorsModel;