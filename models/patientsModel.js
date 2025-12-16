const limit = 20;

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

    // Return the patients username using ID
    async getID(username) {
        const query = "SELECT id FROM patients WHERE username = ?";
        const [result] = await db.query(query, username);
        return result[0].id;
    },

    // Returns a list of patients
    async getPatients(values) {
        let query = "SELECT id, first_name, last_name, nhs_number, email, username FROM patients";
        let predicates = [];
        let params = [];

        // Determines the SQL OFFSET value so the correct page can be returned
        const page = values?.page || 1; // First page is returned if none specified
        const offset = (page - 1) * limit; 

        // Filter options

        // Returns only patients with the specified id
        if(values?.id) {
            predicates.push("id = ?");
            params.push(values.id);
        }

        // Filter patients by first name
        if(values?.first_name) {
            predicates.push("first_name LIKE ?");
            params.push("%" + values.first_name + "%");
        }

        // Filter patients by last name
        if(values?.last_name) {
            predicates.push("last_name LIKE ?");
            params.push("%" + values.last_name + "%");
        }

        // Filter patients by username
        if(values?.username) {
            predicates.push("username = ?");
            params.push(values.username);
        }
        
        // Combine WHERE predicates into a single statement
        if (predicates.length > 0) {
            query += " WHERE " + predicates.join(" AND ");
        }

        // Must be last as LIMIT follows WHERE and ORDER
        query += " LIMIT ? OFFSET ?";
        params.push(limit);
        params.push(offset);

        const [result] = await db.query(query, params);
        
        
        return result;
    },

    // Helper function for retrieving a single patient by id
    async getPatient(patient_id) {
        return this.getPatients({ id: patient_id });
    },
    // Helper function for retrieving a single patient by username
    async getPatientWithUsername(username) {
        return this.getPatients({ username: username });
    }
}

module.exports = patientsModel;