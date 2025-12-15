// Amount of rows returned by the model
const limit = 20;

const appointmentsModel = {

    // Inserts a new appointment request
    async insertRequest(details) {
        const query = "INSERT INTO appointments (reason, patient_id, status_id) VALUES (?, (SELECT id FROM patients WHERE username = ?), (SELECT id FROM appointment_states WHERE status = 'pending'))";
        const result = await db.query(query, details);
        return result;
    },

    // Retrieves a list of appointments from the database, can be filtered using an object of parameters
    async getAppointments(values) {
        let query = "SELECT appointments.id, appointment_datetime, reason, patient_id, doctor_id, CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctor_name, status FROM appointments LEFT JOIN doctors ON appointments.doctor_id = doctors.id JOIN appointment_states ON appointments.status_id = appointment_states.id";
        let predicates = [];
        let params = [];
        const page = values?.page || 1; // First page is returned if none specified
        const offset = (page - 1) * limit;

        // Filter appointments by status using the status name
        if (values?.status) {
            predicates.push("status_id = (SELECT id FROM appointment_states WHERE status = ?)");
            params.push(values.status);
        }

        if(values?.patient_id) {
            predicates.push("patient_id = ?");
            params.push(values.patient_id);
        }

        // Retrieve a single appointment by id
        if (values?.id) {
            predicates.push("appointments.id = ?")
            params.push(values.id);
        }

        if (values?.start_date) {
            predicates.push("appointment_datetime >= ?")
            params.push(values.start_date);
        }

        if (values?.end_date) {
            predicates.push("appointment_datetime <= ?")
            params.push(values.end_date);
        }

        // Combine WHERE predicates into a single statement
        if (predicates.length > 0) {
            query += " WHERE " + predicates.join(" AND ");
        }

        query += " LIMIT ? OFFSET ?";
        params.push(limit);
        params.push(offset);

        const [result] = await db.query(query, params);
        return result;
    },

    // Helper function for retrieving a single appointment by id
    async getAppointment(appointment_id) {
        return this.getAppointments({ id: appointment_id });
    },

    // Helper function for retrieving all appointments for a patient
    async patientAppointments(patient_id) {
        return this.getAppointments({ patient_id });
    },

    async updateAppointment(details) {
        const query = "UPDATE appointments SET appointment_datetime = ?, status_id = (SELECT id FROM appointment_states WHERE status = ?), doctor_id = ? WHERE id = ?"
        const result = await db.query(query, details);
        return result;
    },

    async getStates() {
        const query = "SELECT status FROM appointment_states";
        const [result] = await db.query(query);
        return result;
    }
    
}

module.exports = appointmentsModel;