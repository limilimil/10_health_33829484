const appointmentsModel = {
    // Inserts a new user into the patients database
    async insertRequest(details) {
        const query = "INSERT INTO appointments (reason, patient_id, status_id) VALUES (?, (SELECT id FROM patients WHERE username = ?), (SELECT id FROM appointment_states WHERE status = 'pending'))";
        const result = await db.query(query, details);
        return result;
    }
}

module.exports = appointmentsModel;