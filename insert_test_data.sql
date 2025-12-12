# Insert data into the tables

USE health;

INSERT INTO doctors (first_name, last_name, email, username, hashed_password) 
VALUES ('Gregory', 'House', 'example@email.com', 'house', '$2a$12$LdAnUjo4wLApLb/baNippOr5tbXM7wP8XCmwIjAo2YfZjjmJEMhmK'),
('John', 'Goldsmiths', 'gold@smiths.com', 'gold', '$2a$12$pLIFrb/XNlyMoBpBWz5PEuuvVEXfesWhOtMl3WD8BVuUtpfgI6nXq');

INSERT INTO patients (first_name, last_name, email, nhs_number, username, hashed_password) 
VALUES ('John', 'Goldsmiths', 'gold@smiths.com', '0893056022', 'gold', '$2a$12$pLIFrb/XNlyMoBpBWz5PEuuvVEXfesWhOtMl3WD8BVuUtpfgI6nXq');

INSERT INTO appointment_states (status)
VALUES ('pending'), ('confirmed'), ('completed'), ('cancelled');