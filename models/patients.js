const patients = {
    async insert (details) {
        const query = "INSERT INTO patients (first_name, last_name, email, nhs_number, username, hashed_password) VALUES (?,?,?,?,?,?)";
        const result = await db.query(query, details);
        return result;
    }

}

module.exports = patients;