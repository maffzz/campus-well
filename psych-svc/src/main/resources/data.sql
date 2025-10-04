
INSERT INTO student (name, email, career, cohort) VALUES
('Ana García', 'ana.garcia@campus.edu', 'Computer Science', '2024'),
('Carlos López', 'carlos.lopez@campus.edu', 'Psychology', '2023'),
('María Rodríguez', 'maria.rodriguez@campus.edu', 'Engineering', '2024'),
('José Martínez', 'jose.martinez@campus.edu', 'Business', '2023'),
('Laura Sánchez', 'laura.sanchez@campus.edu', 'Medicine', '2024'),
('David González', 'david.gonzalez@campus.edu', 'Computer Science', '2023'),
('Sofia Hernández', 'sofia.hernandez@campus.edu', 'Psychology', '2024'),
('Miguel Torres', 'miguel.torres@campus.edu', 'Engineering', '2023'),
('Isabella Flores', 'isabella.flores@campus.edu', 'Business', '2024'),
('Diego Ramírez', 'diego.ramirez@campus.edu', 'Medicine', '2023');

-- Insert sample appointments
INSERT INTO appointment (student_id, psychologist, date, status) VALUES
(1, 'Dr. Smith', '2024-02-15 10:00:00+00:00', 'CONFIRMED'),
(2, 'Dr. Johnson', '2024-02-16 14:30:00+00:00', 'PENDING'),
(3, 'Dr. Williams', '2024-02-17 09:15:00+00:00', 'CONFIRMED'),
(4, 'Dr. Brown', '2024-02-18 16:00:00+00:00', 'CANCELLED'),
(5, 'Dr. Davis', '2024-02-19 11:30:00+00:00', 'PENDING'),
(6, 'Dr. Miller', '2024-02-20 13:45:00+00:00', 'CONFIRMED'),
(7, 'Dr. Wilson', '2024-02-21 15:20:00+00:00', 'PENDING'),
(8, 'Dr. Moore', '2024-02-22 08:30:00+00:00', 'CONFIRMED'),
(9, 'Dr. Taylor', '2024-02-23 12:15:00+00:00', 'CANCELLED'),
(10, 'Dr. Anderson', '2024-02-24 17:00:00+00:00', 'PENDING');
