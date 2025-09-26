package com.example.psychsvc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Random;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class PsychSvcApplication {

    public static void main(String[] args) {
        SpringApplication.run(PsychSvcApplication.class, args);
    }

    @Bean
    CommandLineRunner seedData(StudentRepo students, AppointmentRepo appts) {
        return args -> {
            String seed = System.getenv("SEED_PSYCH");
            if (seed == null || !seed.equalsIgnoreCase("true")) {
                return;
            }
            if (students.count() > 0 && appts.count() >= 20000) {
                return;
            }
            Random rnd = new Random();
            long existingStudents = students.count();
            int targetStudents = 5000;
            if (existingStudents < targetStudents) {
                List<Student> bufS = new ArrayList<>();
                for (int i = (int) existingStudents + 1; i <= targetStudents; i++) {
                    Student s = new Student();
                    s.setName("Student " + i);
                    s.setEmail("student" + i + "@campus.edu");
                    s.setCareer("Engineering");
                    s.setCohort("202" + (i % 5));
                    bufS.add(s);
                    if (bufS.size() >= 1000) {
                        students.saveAll(bufS);
                        bufS.clear();
                    }
                }
                if (!bufS.isEmpty()) students.saveAll(bufS);
            }

            Appointment.Status[] statuses = Appointment.Status.values();
            long maxId = students.count();
            int total = 20000;
            long existingAppts = appts.count();
            if (existingAppts < total) {
                List<Appointment> bufA = new ArrayList<>();
                for (int i = (int) existingAppts; i < total; i++) {
                    Appointment a = new Appointment();
                    long sid = 1 + rnd.nextInt((int) maxId);
                    a.setStudentId(sid);
                    a.setPsychologist("Dr. "+ (char)('A' + rnd.nextInt(26)));
                    a.setDate(OffsetDateTime.now(ZoneOffset.UTC).minusDays(rnd.nextInt(365)));
                    a.setStatus(statuses[rnd.nextInt(statuses.length)]);
                    bufA.add(a);
                    if (bufA.size() >= 1000) {
                        appts.saveAll(bufA);
                        bufA.clear();
                    }
                }
                if (!bufA.isEmpty()) appts.saveAll(bufA);
            }
        };
    }
}