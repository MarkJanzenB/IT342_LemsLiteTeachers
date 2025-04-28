package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

//to be revised
@Entity
@Table(name = "teacher_schedule")
public class TeacherScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="teacher_schedule_id")
    private int teacherScheduleId;
    //Time default format is HH:mm:ss
    @Column(name = "start_time")
    private LocalTime startTime; // Changed to LocalTime
    @Column(name = "end_time")
    private LocalTime endTime;   // Changed to LocalTime
    @Column(name="lab_num")
    private String labNum;
    @Column(name = "date")
    private Date date;
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = true)
    private UserEntity teacher;
    @ManyToOne
    @JoinColumn(name = "year_id", nullable = true)
    private YearSectionEntity yearSection;
    @ManyToOne
    @JoinColumn(name = "createdby_id", nullable = true)
    private UserEntity createdBy;
    @Column(name = "date_created")
    private LocalDate dateCreated;
    @OneToOne(mappedBy = "teacherSchedule")
    private BorrowItemEntity BorrowItemEntity;

    public TeacherScheduleEntity() {
        super();
    }

    public TeacherScheduleEntity(int teacherScheduleId, LocalTime startTime, LocalTime endTime, String labNum, Date date,
                                 UserEntity teacher, YearSectionEntity yearSection, UserEntity createdBy, LocalDate dateCreated) {
        super();
        this.teacherScheduleId = teacherScheduleId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.labNum = labNum;
        this.date = date;
        this.teacher = teacher;
        this.yearSection = yearSection;
        this.createdBy = createdBy;
        this.dateCreated = dateCreated;
    }

    @PrePersist
    protected void onCreate() {
        this.dateCreated = LocalDate.now();
    }

    @JsonProperty("teacher_schedule_id")
    public int getTeacherScheduleId() {
        return teacherScheduleId;
    }
    public void setTeacherScheduleId(int teacherScheduleId) {
        this.teacherScheduleId = teacherScheduleId;
    }
    @JsonProperty("start_time")
    public LocalTime getStartTime() { // Changed to LocalTime
        return startTime;
    }
    public void setStartTime(LocalTime startTime) { // Changed to LocalTime
        this.startTime = startTime;
    }
    @JsonProperty("end_time")
    public LocalTime getEndTime() {   // Changed to LocalTime
        return endTime;
    }
    public void setEndTime(LocalTime endTime) {     // Changed to LocalTime
        this.endTime = endTime;
    }
    @JsonProperty("lab_num")
    public String getLabNum() {
        return labNum;
    }
    public void setLabNum(String labNum) {
        this.labNum = labNum;
    }
    @JsonProperty("date")
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    @JsonProperty("teacher")
    public UserEntity getTeacher() {
        return teacher;
    }
    public void setTeacher(UserEntity teacher) {
        this.teacher = teacher;}
    @JsonProperty("year_and_section")
    public YearSectionEntity getYearSection() {
        return yearSection;
    }
    public void setYearSection(YearSectionEntity yearSection) {
        this.yearSection = yearSection;
    }
    @JsonProperty("created_by")
    public UserEntity getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(UserEntity createdBy) {
        this.createdBy = createdBy;
    }
    @JsonProperty("date_created")
    public LocalDate getDateCreated() {
        return dateCreated;
    }
    public void setDateCreated(LocalDate dateCreated) {
        this.dateCreated = dateCreated;
    }
}