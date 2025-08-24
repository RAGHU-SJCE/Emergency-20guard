-- Development Seed Data for EmergencyGuard
-- This file contains sample data for development and testing

-- Sample users (passwords are hashed for 'password123')
INSERT OR IGNORE INTO users (uuid, email, phone, first_name, last_name, password_hash, is_active, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '+1-555-0123', 'John', 'Doe', '$2b$10$rBfTFO8vCZwC2bVvN3qyOOx.7LvJtK9gN3J6JVf.6xgN1LwN3qyOOx', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '+1-555-0456', 'Jane', 'Smith', '$2b$10$rBfTFO8vCZwC2bVvN3qyOOx.7LvJtK9gN3J6JVf.6xgN1LwN3qyOOx', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'admin@emergencyguard.com', '+1-555-0789', 'Admin', 'User', '$2b$10$rBfTFO8vCZwC2bVvN3qyOOx.7LvJtK9gN3J6JVf.6xgN1LwN3qyOOx', true, true);

-- Sample emergency contacts for John Doe (user_id: 1)
INSERT OR IGNORE INTO emergency_contacts (user_id, name, relationship, phone, email, priority, notification_preferences, is_verified) VALUES
(1, 'Sarah Doe', 'Spouse', '+1-555-1111', 'sarah.doe@example.com', 1, '{"sms": true, "email": true, "push": false}', true),
(1, 'Robert Doe', 'Father', '+1-555-2222', 'robert.doe@example.com', 2, '{"sms": true, "email": false, "push": false}', true),
(1, 'Dr. Wilson', 'Doctor', '+1-555-3333', 'dr.wilson@hospital.com', 3, '{"sms": false, "email": true, "push": false}', true),
(1, 'Mike Johnson', 'Best Friend', '+1-555-4444', 'mike.j@example.com', 4, '{"sms": true, "email": true, "push": true}', false);

-- Sample emergency contacts for Jane Smith (user_id: 2)
INSERT OR IGNORE INTO emergency_contacts (user_id, name, relationship, phone, email, priority, notification_preferences, is_verified) VALUES
(2, 'Tom Smith', 'Brother', '+1-555-5555', 'tom.smith@example.com', 1, '{"sms": true, "email": true, "push": false}', true),
(2, 'Mary Smith', 'Mother', '+1-555-6666', 'mary.smith@example.com', 2, '{"sms": true, "email": true, "push": false}', true),
(2, 'Dr. Johnson', 'Family Doctor', '+1-555-7777', 'dr.johnson@clinic.com', 3, '{"sms": false, "email": true, "push": false}', true);

-- Sample emergency events (historical data)
INSERT OR IGNORE INTO emergency_events (
    uuid, user_id, event_type, status, severity, 
    location_latitude, location_longitude, location_accuracy, location_address,
    location_timestamp, emergency_number, call_duration, response_time, notes
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001', 1, 'medical', 'resolved', 'high',
    40.7128, -74.0060, 5.0, '123 Main St, New York, NY 10001',
    '2024-12-20 14:30:00', '911', 180, 165, 'Chest pain emergency. Paramedics responded quickly. Transported to NYC General Hospital. Full recovery.'
),
(
    '660e8400-e29b-41d4-a716-446655440002', 1, 'general', 'resolved', 'medium',
    40.7580, -73.9855, 3.0, '456 Broadway, New York, NY 10013',
    '2024-12-15 09:15:00', '911', 120, 95, 'Witnessed car accident. Called for assistance. Emergency services arrived promptly.'
),
(
    '660e8400-e29b-41d4-a716-446655440003', 2, 'medical', 'resolved', 'high',
    40.6782, -73.9442, 4.0, '789 Atlantic Ave, Brooklyn, NY 11238',
    '2024-12-10 22:45:00', '911', 210, 135, 'Allergic reaction to food. EpiPen administered. Taken to Brooklyn Methodist Hospital.'
),
(
    '660e8400-e29b-41d4-a716-446655440004', 2, 'fire', 'resolved', 'critical',
    40.6831, -73.9712, 2.0, '321 5th Ave, Brooklyn, NY 11215',
    '2024-12-05 16:20:00', '911', 300, 240, 'Kitchen fire in apartment building. Fire department responded. Minor smoke damage only.'
);

-- Sample emergency notifications (what was sent during emergencies)
INSERT OR IGNORE INTO emergency_notifications (
    emergency_event_id, contact_id, notification_type, status, 
    message_content, external_id, sent_at, delivered_at
) VALUES
-- Notifications for first emergency event
(1, 1, 'sms', 'delivered', 'EMERGENCY: John has triggered an emergency alert. Location: 123 Main St, New York, NY. Please check on him immediately.', 'sms_msg_001', '2024-12-20 14:31:00', '2024-12-20 14:31:05'),
(1, 1, 'email', 'delivered', 'Emergency Alert: John Doe has triggered a medical emergency...', 'email_msg_001', '2024-12-20 14:31:00', '2024-12-20 14:31:10'),
(1, 2, 'sms', 'delivered', 'EMERGENCY: John has triggered an emergency alert. Location: 123 Main St, New York, NY. Please check on him immediately.', 'sms_msg_002', '2024-12-20 14:31:00', '2024-12-20 14:31:15'),
(1, 3, 'email', 'delivered', 'Medical Emergency Alert: Your patient John Doe has triggered an emergency...', 'email_msg_002', '2024-12-20 14:31:30', '2024-12-20 14:31:45'),

-- Notifications for Jane's emergency
(3, 5, 'sms', 'delivered', 'EMERGENCY: Jane has triggered an emergency alert. Location: 789 Atlantic Ave, Brooklyn, NY. Please check on her immediately.', 'sms_msg_003', '2024-12-10 22:46:00', '2024-12-10 22:46:05'),
(3, 5, 'email', 'delivered', 'Emergency Alert: Jane Smith has triggered a medical emergency...', 'email_msg_003', '2024-12-10 22:46:00', '2024-12-10 22:46:12'),
(3, 6, 'sms', 'delivered', 'EMERGENCY: Jane has triggered an emergency alert. Location: 789 Atlantic Ave, Brooklyn, NY. Please check on her immediately.', 'sms_msg_004', '2024-12-10 22:46:00', '2024-12-10 22:46:08'),
(3, 6, 'email', 'delivered', 'Emergency Alert: Jane Smith has triggered a medical emergency...', 'email_msg_004', '2024-12-10 22:46:00', '2024-12-10 22:46:18');

-- Emergency services data
INSERT OR IGNORE INTO emergency_services (service_type, country_code, phone_number, is_active) VALUES
('general', 'US', '911', true),
('poison_control', 'US', '1-800-222-1222', true),
('suicide_prevention', 'US', '988', true),
('general', 'CA', '911', true),
('general', 'UK', '999', true),
('general', 'AU', '000', true),
('general', 'EU', '112', true);

-- Sample user preferences
INSERT OR IGNORE INTO user_preferences (user_id, preference_key, preference_value, data_type) VALUES
(1, 'notification_sound', 'true', 'boolean'),
(1, 'location_tracking', 'true', 'boolean'),
(1, 'emergency_contacts_limit', '5', 'number'),
(1, 'auto_share_location', 'true', 'boolean'),
(1, 'language', 'en', 'string'),
(2, 'notification_sound', 'true', 'boolean'),
(2, 'location_tracking', 'true', 'boolean'),
(2, 'emergency_contacts_limit', '3', 'number'),
(2, 'auto_share_location', 'true', 'boolean'),
(2, 'language', 'en', 'string');

-- Audit log entries (sample security/activity logs)
INSERT OR IGNORE INTO audit_log (user_id, action, resource_type, resource_id, ip_address, details, severity) VALUES
(1, 'login', 'user', '1', '192.168.1.100', '{"browser": "Chrome", "device": "Desktop"}', 'info'),
(1, 'emergency_call', 'emergency_event', '1', '192.168.1.100', '{"emergency_type": "medical", "location": "NYC"}', 'critical'),
(1, 'contact_add', 'emergency_contact', '1', '192.168.1.100', '{"contact_name": "Sarah Doe"}', 'info'),
(2, 'login', 'user', '2', '10.0.0.50', '{"browser": "Safari", "device": "iPhone"}', 'info'),
(2, 'emergency_call', 'emergency_event', '3', '10.0.0.50', '{"emergency_type": "medical", "location": "Brooklyn"}', 'critical'),
(3, 'login', 'user', '3', '127.0.0.1', '{"browser": "Firefox", "device": "Desktop"}', 'info');

-- Update statistics for development
UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id IN (1, 2, 3);
UPDATE emergency_contacts SET updated_at = CURRENT_TIMESTAMP WHERE user_id IN (1, 2);
UPDATE emergency_events SET updated_at = CURRENT_TIMESTAMP WHERE user_id IN (1, 2);
