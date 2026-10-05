-- SwachhDisha MySQL Database Schema

CREATE DATABASE IF NOT EXISTS swachhdisha;
USE swachhdisha;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    role ENUM('CITIZEN', 'ADMIN') NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Waste Reports Table
CREATE TABLE IF NOT EXISTS waste_reports (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    photo_url LONGTEXT NULL,
    status ENUM('PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    reporter_id VARCHAR(50) NULL,
    reporter_name VARCHAR(100) NULL,
    reporter_contact VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_ward (ward),
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at)
);

-- 3. Report Updates / Activity Timeline Table
CREATE TABLE IF NOT EXISTS report_updates (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL,
    status ENUM('PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') NOT NULL,
    message TEXT NOT NULL,
    updated_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES waste_reports(id) ON DELETE CASCADE,
    INDEX idx_report_id (report_id)
);

-- 4. High-Risk Hotspot Areas Table
CREATE TABLE IF NOT EXISTS hotspot_areas (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    report_count INT NOT NULL DEFAULT 0,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    common_category VARCHAR(50) NOT NULL,
    last_reported_at TIMESTAMP NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    description TEXT NOT NULL,
    resolution_rate INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
