package com.example.psychsvc;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Student {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String email;
    private String career;
    private String cohort;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCareer() { return career; }
    public void setCareer(String career) { this.career = career; }

    public String getCohort() { return cohort; }
    public void setCohort(String cohort) { this.cohort = cohort; }
}