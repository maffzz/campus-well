-- Initialize database for CampusWell project
USE campuswell;

-- Create events table for sports-svc
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table for sports-svc
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (student_id, event_id)
);

-- Insert sample events
INSERT INTO events (name, type, date, location) VALUES
('Basketball Tournament', 'sport', '2024-02-15 18:00:00', 'Sports Complex'),
('Soccer Match', 'sport', '2024-02-20 16:00:00', 'Main Field'),
('Tennis Championship', 'sport', '2024-02-25 14:00:00', 'Tennis Courts'),
('Volleyball League', 'sport', '2024-03-01 17:00:00', 'Volleyball Court'),
('Swimming Competition', 'sport', '2024-03-05 15:00:00', 'Swimming Pool'),
('Study Group Meeting', 'academic', '2024-02-18 19:00:00', 'Library Room 101'),
('Career Fair', 'academic', '2024-02-22 10:00:00', 'Main Auditorium'),
('Workshop: Time Management', 'academic', '2024-02-28 16:00:00', 'Conference Room A');
