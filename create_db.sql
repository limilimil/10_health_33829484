# Create database script for Health app

# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create the tables
# Stores the patient accounts
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    nhs_number CHAR(10) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    hashed_password CHAR(60) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

# Stores the doctor accounts
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    hashed_password CHAR(60) NOT NULL
);

# Stores the appointment statuses
CREATE TABLE IF NOT EXISTS appointment_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(20)
);

# Stores the appointment bookings
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_datetime DATETIME,
    reason VARCHAR(255),
    status_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_status
        FOREIGN KEY (status_id) REFERENCES appointment_states(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
  CONSTRAINT fk_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);