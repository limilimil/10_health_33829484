# Health Booking Management System

A booking management application designed for health services.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## Features
- Health service user account registration
- Appointment requests
- Appointment management
- Appointment editing
- Database filtering and search
- Secure authentication
- Server side validation and sanitisation on user input
- Accessible form design

## Packages
- node.js
- express
- express-session
- express-validator
- express-sanitizer
- express-ejs-layouts
- ejs
- dotenv
- bcrypt
- mysql2

## Dotenv

This project uses the dotenv module to securely store database credentials in a .env file, keeping them out of the source code. The .env file contains variables HEALTH_DB_HOST, HEALTH_DB_USER, and is included in .gitignore so it’s never pushed to GitHub. In index.js, these variables are loaded with require('dotenv').config() and accessed via process.env to configure the database connection
Variables:
- HEALTH_HOST
- HEALTH_USER
- HEALTH_PASSWORD
- HEALTH_DATABASE
- HEALTH_BASE_PATH
- HEALTH_SESSION_SECRET
- HEALTH_NODE_ENV
