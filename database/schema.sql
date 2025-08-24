-- EmergencyGuard Database Schema
-- SQLite/PostgreSQL compatible schema for emergency response system

-- Users table for authentication and user management
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    medical_info TEXT, -- Medical conditions, allergies, medications
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts for each user
CREATE TABLE emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- spouse, parent, sibling, friend, doctor, etc.
    phone VARCHAR(20),
    email VARCHAR(255),
    priority INTEGER DEFAULT 1, -- 1 = highest priority
    notification_preferences JSON, -- {sms: true, email: true, push: false}
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emergency events/calls log
CREATE TABLE emergency_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INTEGER,
    event_type VARCHAR(50) NOT NULL, -- medical, fire, police, general
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, cancelled
    severity VARCHAR(20) DEFAULT 'high', -- low, medium, high, critical
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_accuracy DECIMAL(10, 2),
    location_address TEXT,
    location_timestamp TIMESTAMP,
    emergency_number VARCHAR(20), -- 911, 112, etc.
    call_duration INTEGER, -- in seconds
    response_time INTEGER, -- in seconds from call to resolution
    notes TEXT,
    system_info JSON, -- device info, app version, network status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Contact notifications sent during emergencies
CREATE TABLE emergency_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emergency_event_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    notification_type VARCHAR(20) NOT NULL, -- sms, email, push
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    message_content TEXT,
    external_id VARCHAR(255), -- Twilio SID, SendGrid ID, etc.
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_event_id) REFERENCES emergency_events(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES emergency_contacts(id) ON DELETE CASCADE
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    device_info JSON, -- browser, OS, device type
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System audit log for security and compliance
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL, -- login, emergency_call, contact_add, etc.
    resource_type VARCHAR(50), -- user, emergency_event, contact
    resource_id VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON, -- additional context
    severity VARCHAR(20) DEFAULT 'info', -- debug, info, warning, error, critical
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Emergency service providers (for future expansion)
CREATE TABLE emergency_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_type VARCHAR(50) NOT NULL, -- police, fire, medical, poison_control
    country_code VARCHAR(3) NOT NULL,
    region VARCHAR(100), -- state, province, etc.
    phone_number VARCHAR(20) NOT NULL,
    sms_number VARCHAR(20),
    email VARCHAR(255),
    website_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    coverage_area JSON, -- geographic boundaries
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences and settings
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, preference_key)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_uuid ON users(uuid);
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(user_id, priority);
CREATE INDEX idx_emergency_events_user_id ON emergency_events(user_id);
CREATE INDEX idx_emergency_events_status ON emergency_events(status);
CREATE INDEX idx_emergency_events_created_at ON emergency_events(created_at);
CREATE INDEX idx_emergency_events_uuid ON emergency_events(uuid);
CREATE INDEX idx_emergency_notifications_event_id ON emergency_notifications(emergency_event_id);
CREATE INDEX idx_emergency_notifications_status ON emergency_notifications(status);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Triggers for updated_at timestamps (SQLite version)
CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_emergency_contacts_timestamp 
    AFTER UPDATE ON emergency_contacts
    BEGIN
        UPDATE emergency_contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_emergency_events_timestamp 
    AFTER UPDATE ON emergency_events
    BEGIN
        UPDATE emergency_events SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Insert default emergency services (US)
INSERT INTO emergency_services (service_type, country_code, phone_number, is_active) VALUES
('general', 'US', '911', true),
('poison_control', 'US', '1-800-222-1222', true),
('suicide_prevention', 'US', '988', true);

-- Insert default emergency services (International)
INSERT INTO emergency_services (service_type, country_code, phone_number, is_active) VALUES
('general', 'EU', '112', true),
('general', 'UK', '999', true),
('general', 'AU', '000', true),
('general', 'CA', '911', true);
