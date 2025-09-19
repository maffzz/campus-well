package com.example.psychsvc;

import com.example.psychsvc.Student;
import com.example.psychsvc.Appointment;
import com.example.psychsvc.StudentRepo;
import com.example.psychsvc.AppointmentRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class PsychController {

    private final StudentRepo students;
    private final AppointmentRepo appts;

    public PsychController(StudentRepo s, AppointmentRepo a){
        this.students = s;
        this.appts = a;
    }

    @PostMapping("/students")
    public Student createStudent(@RequestBody Student s){
        return students.save(s);
    }

    @GetMapping("/students/{id}")
    public Student getStudent(@PathVariable Long id){
        return students.findById(id)
                .orElseThrow(() -> new RuntimeException("Student no encontrado con id: " + id));
    }

    @GetMapping("/students/{id}/history")
    public List<Appointment> getHistory(@PathVariable Long id){
        return appts.findByStudentId(id);
    }

    @PostMapping("/appointments")
    public Appointment createAppointment(@RequestBody Appointment a){
        return appts.save(a);
    }

    @GetMapping("/health")
    public Map<String,String> healthCheck(){
        Map<String,String> response = new HashMap<>();
        response.put("status","ok");
        return response;
    }
}