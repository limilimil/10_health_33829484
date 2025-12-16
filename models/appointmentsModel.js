// Default amount of rows returned by the model
const defaultLimit = 20;

const appointmentsModel = {

    // Inserts a new appointment request
    async insertRequest(details) {
        const query = "INSERT INTO appointments (reason, patient_id, status_id) VALUES (?, (SELECT id FROM patients WHERE username = ?), (SELECT id FROM appointment_states WHERE status = 'pending'))";
        const result = await db.query(query, details);
        return result;
    },

    // Helper function for building WHERE statements
    filterBuilder(values) {
        let predicates = [];
        let params = [];
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

        // All rows where without a date or doctor
        if (values?.unassigned) {
            predicates.push("doctor_id IS NULL");
        }

        if (values?.upcoming) {
            predicates.push("(appointment_datetime > CURDATE() OR (appointment_datetime IS NULL AND status_id = (SELECT id FROM appointment_states WHERE status = 'pending')))");
        }

        // Combine WHERE predicates into a single statement
        if (predicates.length > 0) {
            const where = " WHERE " + predicates.join(" AND ");
            return {where, params};
        }  else {
            return {where: "", params};
        }

    },

    // Retrieves a list of appointments from the database, can be filtered using an object of parameters
    async getAppointments(values, limit=defaultLimit) {
        let query = "SELECT appointments.id, appointment_datetime, reason, patient_id, doctor_id, CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctor_name, status FROM appointments LEFT JOIN doctors ON appointments.doctor_id = doctors.id JOIN appointment_states ON appointments.status_id = appointment_states.id";

        const page = values?.page || 1; // First page is returned if none specified
        const offset = (page - 1) * limit;

        // // Combine WHERE predicates into a single statement
        const subquery = this.filterBuilder(values);
        query += subquery.where;
        let params = subquery.params;

        // Rows without a date and status pending (unfulfilled appointment requests) are ordered first followed by appointment date in descending order 
        query += " ORDER BY CASE WHEN status = 'pending' AND appointment_datetime IS NULL THEN 0 ELSE 1 END, appointment_datetime DESC";

        // Applies a limit on the number of rows returned
        query += " LIMIT ? OFFSET ?";
        params.push(limit);
        params.push(offset);

        const [result] = await db.query(query, params);
        return result;
    },

    // Returns the total amount of rows with filters
    async rowCount(values) {
        let query = "SELECT COUNT(*) AS total FROM appointments";
        const subquery = this.filterBuilder(values);
        query += subquery.where;
        let params = subquery.params;
        const [result] = await db.query(query, params);
        return result[0].total;
    },

    // Helper function for retrieving a single appointment by id
    async getAppointment(appointment_id) {
        return this.getAppointments({ id: appointment_id });
    },

    // Helper function for retrieving all appointments for a patient
    async patientAppointments(patient_id, upcomingOnly = false) {
        return this.getAppointments({ patient_id, upcoming: upcomingOnly });
    },

    async updateAppointment(details) {
        const query = "UPDATE appointments SET appointment_datetime = ?, status_id = (SELECT id FROM appointment_states WHERE status = ?), doctor_id = ? WHERE id = ?"
        const result = await db.query(query, details);
        return result;
    },

    async cancel(id) {
        const query = "UPDATE appointments SET appointment_datetime = NULL, status_id = (SELECT id FROM appointment_states WHERE status = 'cancelled'), doctor_id = NULL WHERE id = ?"
        const result = await db.query(query, id);
        return result;
    },

    async getStates() {
        const query = "SELECT status FROM appointment_states";
        const [result] = await db.query(query);
        return result;
    }
    
}

module.exports = appointmentsModel;