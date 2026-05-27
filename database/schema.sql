-- ============================================================
-- Blood Banking System - MySQL Database Schema
-- ============================================================
-- Run this script to set up the database from scratch.
-- Spring Boot's ddl-auto=update will auto-create tables,
-- but this script adds sample data for testing.
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS blood_banking_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blood_banking_system;

-- ── Users table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  blood_type VARCHAR(5),
  role       VARCHAR(20) DEFAULT 'USER'
);

-- ── Donors table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donors (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  blood_group VARCHAR(5)  NOT NULL,
  phone       VARCHAR(15),
  email       VARCHAR(150),
  location    VARCHAR(200),
  username    VARCHAR(100) UNIQUE,
  password    VARCHAR(255),
  available   TINYINT(1) DEFAULT 1
);

-- ── Blood Requests table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS blood_requests (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  blood_group  VARCHAR(5)  NOT NULL,
  phone        VARCHAR(15),
  email        VARCHAR(150),
  location     VARCHAR(200),
  reason       TEXT,
  status       VARCHAR(20) DEFAULT 'PENDING',
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Sample Data (for demo & testing)
-- ============================================================

-- Sample users
INSERT IGNORE INTO users (name, email, password, blood_type, role) VALUES
  ('Admin User',   'admin@bloodbank.com',  'admin123',  'O+', 'ADMIN'),
  ('Ravi Reddy',   'ravi@example.com',     'password1', 'B+', 'USER'),
  ('Priya Singh',  'priya@example.com',    'password2', 'A+', 'USER'),
  ('Mohammed Ali', 'ali@example.com',      'password3', 'O-', 'USER');

-- Sample donors
INSERT IGNORE INTO donors (name, blood_group, phone, email, location, username, password, available) VALUES
  ('Ravi Kumar',    'A+', '9876543210', 'ravi@email.com',   'Hyderabad', 'ravi_donor',    'donor123', 1),
  ('Priya Sharma',  'B+', '9876543211', 'priya@email.com',  'Bangalore', 'priya_donor',   'donor123', 1),
  ('Arun Reddy',    'O+', '9876543212', 'arun@email.com',   'Chennai',   'arun_donor',    'donor123', 1),
  ('Fatima Begum',  'AB+','9876543213', 'fatima@email.com', 'Mumbai',    'fatima_donor',  'donor123', 1),
  ('Suresh Babu',   'O-', '9876543214', 'suresh@email.com', 'Delhi',     'suresh_donor',  'donor123', 1),
  ('Kavitha Nair',  'A-', '9876543215', 'kavitha@email.com','Pune',      'kavitha_donor', 'donor123', 0),
  ('Deepak Mehta',  'B-', '9876543216', 'deepak@email.com', 'Kolkata',   'deepak_donor',  'donor123', 1),
  ('Anjali Das',    'AB-','9876543217', 'anjali@email.com', 'Jaipur',    'anjali_donor',  'donor123', 1);

-- Sample blood requests
INSERT IGNORE INTO blood_requests (name, blood_group, phone, email, location, reason, status, requested_at) VALUES
  ('Patient A', 'O+',  '9000000001', 'patA@email.com', 'KIMS Hospital, Hyderabad', 'Emergency surgery',       'PENDING',   NOW()),
  ('Patient B', 'A+',  '9000000002', 'patB@email.com', 'Apollo Hospital, Chennai', 'Accident victim',         'FULFILLED', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  ('Patient C', 'B-',  '9000000003', 'patC@email.com', 'AIIMS, Delhi',             'Cancer treatment',        'PENDING',   DATE_SUB(NOW(), INTERVAL 2 DAY)),
  ('Patient D', 'AB+', '9000000004', 'patD@email.com', 'Fortis, Bangalore',        'Kidney transplant',       'PENDING',   DATE_SUB(NOW(), INTERVAL 3 DAY)),
  ('Patient E', 'O-',  '9000000005', 'patE@email.com', 'Medanta, Gurgaon',         'Thalassemia treatment',   'CANCELLED', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ============================================================
-- Verify tables
-- ============================================================
SELECT 'users'         AS table_name, COUNT(*) AS rows FROM users
UNION ALL
SELECT 'donors',        COUNT(*) FROM donors
UNION ALL
SELECT 'blood_requests',COUNT(*) FROM blood_requests;
