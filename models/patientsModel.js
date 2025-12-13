const patientsModel = {
    // Inserts a new user into the patients database
    async insert(details) {
        const query = "INSERT INTO patients (first_name, last_name, email, nhs_number, username, hashed_password) VALUES (?,?,?,?,?,?)";
        const result = await db.query(query, details);
        return result;
    },

    // Get the patient login credentials
    async getPatientAuth(username) {
        const query = "SELECT username, hashed_password FROM patients WHERE username = ?";
        const [result] = await db.query(query, username);
        return result;
    },

    // Returns the patients first name
    async getName(username) {
        const query = "SELECT first_name FROM patients WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0].first_name;
    },

    async getID(username) {
        const query = "SELECT id FROM patients WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0].id;
    }
}

module.exports = patientsModel;