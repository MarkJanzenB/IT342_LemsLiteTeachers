package edu.cit.lemslite.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Time;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.Date;




//to be revised
@Entity
@Table(name = "TeacherSchedule")
public class TeacherScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="teacher_schedule_id")
    private int teacherScheduleId;
    //Time default format is HH:mm:ss
    @Column(name = "start_time")
    private Time startTime;
    @Column(name = "end_time")
    private Time endTime;
    @Column(name="lab_num")
    private int labNum;
    @Column(name = "date")
    //Date default format is YYYY-MM-DD
    private Date date;
    @Column(name = "teacher_id")
    private int teacherId;
    public TeacherScheduleEntity() {
        super();
    }

	@JsonProperty("teacher_schedule_id")
    public int getTeacherScheduleId() {
        return teacherScheduleId;
    }
    public void setTeacherScheduleId(int teacherScheduleId) {
        this.teacherScheduleId = teacherScheduleId;
    }
    @JsonProperty("start_time")
    public Time getStartTime() {
        return startTime;
    }
    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }
    @JsonProperty("end_time")
    public Time getEndTime() {
        return endTime;
    }
    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }
    @JsonProperty("lab_num")
    public int getLabNum() {
        return labNum;
    }
    public void setLabNum(int labNum) {
        this.labNum = labNum;
    }
    @JsonProperty("date")
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    @JsonProperty("teacher_id")
    public int getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }
}
