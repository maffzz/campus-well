package com.example.psychsvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Random;
import java.util.List;
import java.util.ArrayList;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private AppointmentRepo appointmentRepo;

    private final Random random = new Random();

    private final String[] names = {
        "Ana García", "Carlos López", "María Rodríguez", "José Martínez", "Laura Sánchez",
        "David González", "Sofia Hernández", "Miguel Torres", "Isabella Flores", "Diego Ramírez",
        "Valentina Castro", "Sebastián Morales", "Camila Herrera", "Nicolás Vargas", "Gabriela Jiménez",
        "Andrés Ruiz", "Daniela Moreno", "Felipe Aguilar", "Isabella Rojas", "Santiago Peña"
    };

    private final String[] careers = {
        "Computer Science", "Psychology", "Engineering", "Business", "Medicine",
        "Law", "Architecture", "Education", "Communications", "Mathematics"
    };

    private final String[] psychologists = {
        "Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis",
        "Dr. Miller", "Dr. Wilson", "Dr. Moore", "Dr. Taylor", "Dr. Anderson"
    };

    private final Appointment.Status[] statuses = {
        Appointment.Status.PENDING, Appointment.Status.CONFIRMED, Appointment.Status.CANCELLED
    };

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (studentRepo.count() > 0) {
            System.out.println("Data already exists. Skipping seed.");
            return;
        }

        System.out.println("Starting data seeding...");

        // Generate 2000 students
        List<Student> students = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            Student student = new Student();
            student.setName(names[random.nextInt(names.length)] + " " + (i + 1));
            student.setEmail("student" + (i + 1) + "@campus.edu");
            student.setCareer(careers[random.nextInt(careers.length)]);
            student.setCohort("202" + (random.nextInt(4) + 1)); // 2021-2024
            students.add(student);
        }
        studentRepo.saveAll(students);
        System.out.println("Created " + students.size() + " students");

        // Generate 2000 appointments
        List<Appointment> appointments = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            Appointment appointment = new Appointment();
            appointment.setStudentId((long) (random.nextInt(2000) + 1));
            appointment.setPsychologist(psychologists[random.nextInt(psychologists.length)]);
            
            // Generate random date within the next 6 months
            OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
            OffsetDateTime futureDate = now.plusDays(random.nextInt(180));
            futureDate = futureDate.withHour(9 + random.nextInt(8)); // 9 AM to 5 PM
            futureDate = futureDate.withMinute(random.nextInt(4) * 15); // 0, 15, 30, 45
            appointment.setDate(futureDate);
            
            appointment.setStatus(statuses[random.nextInt(statuses.length)]);
            appointments.add(appointment);
        }
        appointmentRepo.saveAll(appointments);
        System.out.println("Created " + appointments.size() + " appointments");

        System.out.println("Data seeding completed!");
    }
}
