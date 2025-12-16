const doctorsModel = {

    // Get the doctors login credentials
    async getDoctorsAuth(username) {
        const query = "SELECT username, hashed_password FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result;
    },

    // Returns the doctors last name
    async getDoctorWithUsername(username) {
        const query = "SELECT first_name, last_name, id FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0];
    },

    async getDoctors() {
        const query = "SELECT id, first_name, last_name FROM doctors";
        const [result] = await db.query(query);
        return result;
    },

    async getDoctor(id) {
        const query = "SELECT first_name, last_name FROM doctors WHERE id = ?"
    }

}

module.exports = doctorsModel;