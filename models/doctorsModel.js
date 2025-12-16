const doctorsModel = {

    // Get the doctors login credentials
    async getDoctorsAuth(username) {
        const query = "SELECT username, hashed_password FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result;
    },

    // Retrieves a doctor using their username
    async getDoctorWithUsername(username) {
        const query = "SELECT first_name, last_name, id FROM doctors WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0];
    },

    // Returns all doctors in the database
    async getDoctors() {
        const query = "SELECT id, first_name, last_name FROM doctors";
        const [result] = await db.query(query);
        return result;
    },

    // Gets a doctor row using their ID
    async getDoctor(id) {
        const query = "SELECT first_name, last_name FROM doctors WHERE id = ?"
    }

}

module.exports = doctorsModel;