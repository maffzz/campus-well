package com.example.psychsvc;

import com.example.psychsvc.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepo extends JpaRepository<Student, Long> {}