-- Migration 001: Initial Schema
-- Created: 2024-12-25
-- Description: Initial database schema for EmergencyGuard application

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    medical_info TEXT,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    priority INTEGER DEFAULT 1,
    notification_preferences TEXT, -- JSON stored as TEXT for SQLite compatibility
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emergency events
CREATE TABLE IF NOT EXISTS emergency_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INTEGER,
    event_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    severity VARCHAR(20) DEFAULT 'high',
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_accuracy DECIMAL(10, 2),
    location_address TEXT,
    location_timestamp TIMESTAMP,
    emergency_number VARCHAR(20),
    call_duration INTEGER,
    response_time INTEGER,
    notes TEXT,
    system_info TEXT, -- JSON stored as TEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Emergency notifications
CREATE TABLE IF NOT EXISTS emergency_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emergency_event_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    notification_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    message_content TEXT,
    external_id VARCHAR(255),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_event_id) REFERENCES emergency_events(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES emergency_contacts(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_events_user_id ON emergency_events(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_events_uuid ON emergency_events(uuid);
CREATE INDEX IF NOT EXISTS idx_emergency_events_status ON emergency_events(status);

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_emergency_contacts_timestamp 
    AFTER UPDATE ON emergency_contacts
    BEGIN
        UPDATE emergency_contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_emergency_events_timestamp 
    AFTER UPDATE ON emergency_events
    BEGIN
        UPDATE emergency_events SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
