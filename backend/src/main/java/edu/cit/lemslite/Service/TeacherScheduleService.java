package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.TeacherScheduleEntity;
import edu.cit.lemslite.Entity.UserEntity;
import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Repository.TeacherScheduleRepository;
import edu.cit.lemslite.Repository.UserRepository;
import edu.cit.lemslite.Repository.YearSectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TeacherScheduleService {
    @Autowired
    TeacherScheduleRepository teacherScheduleRepository;

    @Autowired
    YearSectionRepository yearSectionRepository;
    
    @Autowired
    UserRepository userrepo;

    private static final Logger log = LoggerFactory.getLogger(TeacherScheduleService.class);

    public List<TeacherScheduleEntity> getAllTeacherSchedules() {
        return teacherScheduleRepository.findAll();
    }

    public TeacherScheduleEntity AddTeacherSchedule(TeacherScheduleEntity teachsched, int teacherId, int createdby) {
    	System.out.println(teachsched.toString());
        // Get the teacher user entity
        UserEntity teacher = userrepo.findById(teacherId).orElse(null);
        teachsched.setTeacher(teacher);
        
        YearSectionEntity yearSec = yearSectionRepository.findById(teachsched.getYearSection().getYrsecId()).orElseThrow();
        teachsched.setYearSection(yearSec);

        // Set the created by user
        UserEntity user = userrepo.findById(createdby).orElse(null);
        teachsched.setCreatedBy(user);
        
        teachsched.setSyId(null);

        log.info("Adding new teacher schedule for teacher ID: {}", teacherId);
        return teacherScheduleRepository.save(teachsched);
    }
    public ResponseEntity<?> getScheduleById(int scheduleId) {
        log.info("Fetching schedule with ID: {}", scheduleId);
        Optional<TeacherScheduleEntity> schedule = teacherScheduleRepository.findById(scheduleId);

        if(schedule.isPresent()) {
            return ResponseEntity.ok(schedule.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Schedule with ID " + scheduleId + " not found");
        }
    }

    public ResponseEntity<?> getSchedulesByTeacherId(int teacherId) {
        log.info("Fetching schedules for teacher ID: {}", teacherId);
        UserEntity teacher = userrepo.findById(teacherId).orElse(null);

        if (teacher == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Teacher with ID " + teacherId + " not found");
        }

        List<TeacherScheduleEntity> schedules = teacherScheduleRepository.findByTeacher(teacher);

        if(schedules.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No schedules found for teacher ID " + teacherId);
        }

        return ResponseEntity.ok(schedules);
    }
    public ResponseEntity<?> getSchedulesByLabNum(String labNum) {
        log.info("Fetching schedules for lab number: {}", labNum);
        List<TeacherScheduleEntity> schedules = teacherScheduleRepository.findByLabNum(labNum);

        if(schedules.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No schedules found for lab number " + labNum);
        }

        return ResponseEntity.ok(schedules);
    }

    public ResponseEntity<?> getSchedulesByDate(Date date) {
        log.info("Fetching schedules for date: {}", date);
        List<TeacherScheduleEntity> schedules = teacherScheduleRepository.findByDate(date);

        if(schedules.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No schedules found for the given date");
        }

        return ResponseEntity.ok(schedules);
    }

    public ResponseEntity<?> updateSchedule(int scheduleId, TeacherScheduleEntity newSchedule) {
        log.info("Updating schedule with ID: {}", scheduleId);

        Optional<TeacherScheduleEntity> scheduleOptional = teacherScheduleRepository.findById(scheduleId);

        if(scheduleOptional.isPresent()) {
            TeacherScheduleEntity schedule = scheduleOptional.get();

            if(newSchedule.getStartTime() != null) {
                schedule.setStartTime(newSchedule.getStartTime());
            }

            if(newSchedule.getEndTime() != null) {
                schedule.setEndTime(newSchedule.getEndTime());
            }

            if(newSchedule.getLabNum() != null) {
                schedule.setLabNum(newSchedule.getLabNum());
            }

            if(newSchedule.getDate() != null) {
                schedule.setDate(newSchedule.getDate());
            }

            if(newSchedule.getTeacher() != null) {
                schedule.setTeacher(newSchedule.getTeacher());
            }

            if(newSchedule.getYearSection() != null && newSchedule.getYearSection().getYrsecId() != 0) {
                log.info("Updating year section with ID: {}", newSchedule.getYearSection().getYrsecId());
                Optional<YearSectionEntity> yearSectionOptional = yearSectionRepository.findById(newSchedule.getYearSection().getYrsecId());

                if(yearSectionOptional.isPresent()) {
                    schedule.setYearSection(yearSectionOptional.get());
                } else {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body("Year Section with ID " + newSchedule.getYearSection().getYrsecId() + " not found");
                }
            }

            return ResponseEntity.ok(teacherScheduleRepository.save(schedule));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Schedule with ID " + scheduleId + " not found");
        }
    }

    public ResponseEntity<?> deleteSchedule(int scheduleId) {
        log.info("Deleting schedule with ID: {}", scheduleId);

        if(teacherScheduleRepository.existsById(scheduleId)) {
            teacherScheduleRepository.deleteById(scheduleId);
            return ResponseEntity.ok("Schedule successfully deleted");
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Schedule with ID " + scheduleId + " not found");
        }
    }
}