package com.example.psychsvc;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
public class Appointment {
    @Id @GeneratedValue
    private Long id;
    private Long studentId;
    private String psychologist;
    private OffsetDateTime date;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status { PENDING, CONFIRMED, CANCELLED }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getPsychologist() { return psychologist; }
    public void setPsychologist(String psychologist) { this.psychologist = psychologist; }

    public OffsetDateTime getDate() { return date; }
    public void setDate(OffsetDateTime date) { this.date = date; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}