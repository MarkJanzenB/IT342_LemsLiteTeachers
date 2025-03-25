package edu.cit.lemslite.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.lemslite.entity.TeacherScheduleEntity;
import edu.cit.lemslite.repository.TeacherScheduleRepository;
@Service
public class TeacherScheduleService {
    @Autowired
    TeacherScheduleRepository teacherScheduleRepository;
    public List<TeacherScheduleEntity> getAllTeacherSchedules() {
        return teacherScheduleRepository.findAll();
    }
    
    public TeacherScheduleEntity AddTeacherSchedule(TeacherScheduleEntity teachsched) {
    	return teacherScheduleRepository.save(teachsched);
    }
}
