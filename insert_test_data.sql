# Insert data into the tables

USE health;

INSERT INTO doctors (first_name, last_name, email, username, hashed_password) 
VALUES ('Gregory', 'House', 'example@email.com', 'house', '$2a$12$LdAnUjo4wLApLb/baNippOr5tbXM7wP8XCmwIjAo2YfZjjmJEMhmK'),
('John', 'Goldsmiths', 'gold@smiths.com', 'gold', '$2a$12$pLIFrb/XNlyMoBpBWz5PEuuvVEXfesWhOtMl3WD8BVuUtpfgI6nXq');

INSERT INTO patients (first_name, last_name, email, nhs_number, username, hashed_password) 
VALUES ('John', 'Goldsmiths', 'gold@smiths.com', '0893056022', 'gold', '$2a$12$pLIFrb/XNlyMoBpBWz5PEuuvVEXfesWhOtMl3WD8BVuUtpfgI6nXq');

INSERT INTO appointment_states (status)
VALUES ('pending'), ('confirmed'), ('completed'), ('cancelled');

INSERT INTO appointments (appointment_datetime, reason, status_id, patient_id, doctor_id)
VALUES ('2023-12-01 16:05:00', "Feeling sick", 3, 1, 1),
('2024-06-22 09:15:00', "I have leg cramps", 3, 1, 1),
('2024-11-10 13:30:00', "I am having trouble sleeping", 4, 1, NULL),
('2025-07-20 14:35:00', "Routine blood test", 3, 1, 1),
('2025-08-05 09:45:00', "Migraine", 3, 1, 2),
('2025-09-01 16:10:00', "Back pain", 3, 1, 1),
('2025-09-30 11:25:00', "Allergy flare", 3, 1, 2),
('2025-03-18 15:40:00', "Mild headache", 3, 1, 1),
('2025-05-02 10:55:00', "Vaccination", 3, 1, 2),
('2024-11-10 13:30:00', "Annual checkup", 4, 1, NULL),
('2024-11-11 12:15:00', "CT scan", 4, 1, 1),
('2025-12-07 10:20:00', "Flu symptoms", 3, 1, 1),
('2024-12-08 13:30:00', "Follow-up appointment", 4, 1, 2),
('2025-12-08 14:45:00', "Follow-up call", 3, 1, 2),
('2025-12-16 12:00:00', "Physio session", 1, 1, NULL),
('2025-12-18 15:10:00', "Consultation", 1, 1, NULL),
('2025-12-20 09:30:00', "Medication refill", 2, 1, 1),
('2025-12-30 15:25:00', "Specialist referral", 2, 1, 2),
('2026-01-11 09:10:00', "MRI Scan", 4, 1, NULL),
('2026-01-12 09:50:00', "Routine check up", 1, 1, NULL),
('2026-01-15 10:30:00', "I have a major migraine", 2, 1, 1),
('2026-01-16 12:20:00', "Allergy test", 4, 1, NULL),
('2026-01-28 14:05:00', "Therapy appointment", 2, 1, 1),
('2026-02-15 11:40:00', "Surgery consult", 2, 1, 2),
('2026-03-05 16:55:00', "Vaccination booster", 1, 1, NULL)