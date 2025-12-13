const appointmentsModel = {
    // Inserts a new user into the patients database
    async insertRequest(details) {
        const query = "INSERT INTO appointments (reason, patient_id, status_id) VALUES (?, (SELECT id FROM patients WHERE username = ?), (SELECT id FROM appointment_states WHERE status = 'pending'))";
        const result = await db.query(query, details);
        return result;
    },

    async getAppointments(values) {
        let query = "SELECT * FROM appointments JOIN appointment_states ON status_id = appointment_states.id";
        let predicates = [];
        let params = [];

        if (values?.status) {
            predicates.push("status_id = (SELECT id FROM appointment_states WHERE status = ?");
            params.push(values.status);
        }

        // Combine WHERE predicates into a single statement
        if (predicates.length > 0) {
            query += " WHERE " + predicates.join(" AND ");
        }

        const [result] = await db.query(query, params);
        return result;
    }
    
}

module.exports = appointmentsModel;