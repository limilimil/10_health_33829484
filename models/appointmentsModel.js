const appointmentsModel = {
    // Inserts a new appointment request
    async insertRequest(details) {
        const query = "INSERT INTO appointments (reason, patient_id, status_id) VALUES (?, (SELECT id FROM patients WHERE username = ?), (SELECT id FROM appointment_states WHERE status = 'pending'))";
        const result = await db.query(query, details);
        return result;
    },

    // Retrieves a list of appointments from the database, can be filtered using an object of parameters
    async getAppointments(values) {
        let query = "SELECT appointments.id, appointment_datetime, reason, patient_id, doctor_id, status FROM appointments JOIN appointment_states ON appointments.status_id = appointment_states.id";
        let predicates = [];
        let params = [];

        if (values?.status) {
            predicates.push("status_id = (SELECT id FROM appointment_states WHERE status = ?");
            params.push(values.status);
        }

        if (values?.id) {
            predicates.push("appointments.id = ?")
            params.push(values.id);
        }

        // Combine WHERE predicates into a single statement
        if (predicates.length > 0) {
            query += " WHERE " + predicates.join(" AND ");
        }

        const [result] = await db.query(query, params);
        return result;
    },

    // Helper function for retrieving a single appointment by id
    async getAppointment(appointment_id) {
        return this.getAppointments({ id: appointment_id });
    }
    
}

module.exports = appointmentsModel;