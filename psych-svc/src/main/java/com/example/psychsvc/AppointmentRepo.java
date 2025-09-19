package com.example.psychsvc;

import com.example.psychsvc.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentId(Long studentId);
}