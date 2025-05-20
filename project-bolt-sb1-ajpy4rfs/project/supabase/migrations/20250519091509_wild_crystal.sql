```sql
-- Create user profiles table
CREATE TABLE user_profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    phone VARCHAR(20),
    address TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create security settings table
CREATE TABLE security_settings (
    user_id VARCHAR(36) PRIMARY KEY,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    two_factor_secret VARCHAR(255),
    last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create notification preferences table
CREATE TABLE notification_preferences (
    user_id VARCHAR(36) PRIMARY KEY,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    sms_notifications BOOLEAN NOT NULL DEFAULT false,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    message_notifications BOOLEAN NOT NULL DEFAULT true,
    calendar_notifications BOOLEAN NOT NULL DEFAULT true,
    expense_notifications BOOLEAN NOT NULL DEFAULT true,
    document_notifications BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create triggers to update timestamps
DELIMITER //

CREATE TRIGGER user_profiles_update_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER security_settings_update_timestamp
BEFORE UPDATE ON security_settings
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER notification_preferences_update_timestamp
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;
```