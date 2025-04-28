package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name="requests")
public class RequestEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="request_id")
	private int requestId;
	
	@ManyToOne
	@JoinColumn(name = "teacher_id", nullable = true)
	private UserEntity teacher;

	@Column(name="class_status")
	private String classStatus;

	private String status;

	@Column(name="date_requested")
	private LocalDateTime dateRequested;
	
	@Column(name="date_schedule")
	private LocalDate dateSchedule;
	
	@Column(name="start_time")
	private LocalTime startTime;
	
	@Column(name="end_time")
	private LocalTime endTime;
	
	@ManyToOne
	@JoinColumn(name = "approver_id", nullable = true)
	private UserEntity approver;
	
	@Column(name="date_approved")
	private LocalDateTime dateApproved;
	
	private String remarks;
	
	@ManyToOne
	@JoinColumn(name = "subject_id", nullable = true)
	private SubjectEntity subject;
	
	private String room;
	
	public RequestEntity() {
		super();
		// TODO Auto-generated constructor stub
	}


	public RequestEntity(int requestId, UserEntity teacher, String classStatus, String status, LocalDateTime dateRequested,
						 LocalDate dateSchedule, LocalTime startTime, LocalTime endTime, UserEntity approver,
						 LocalDateTime dateApproved, String remarks, SubjectEntity subject, String room) {
		super();
		this.requestId = requestId;
		this.teacher = teacher;
		this.classStatus = classStatus;
		this.status = status;
		this.dateRequested = dateRequested;
		this.dateSchedule = dateSchedule;
		this.startTime = startTime;
		this.endTime = endTime;
		this.approver = approver;
		this.dateApproved = dateApproved;
		this.remarks = remarks;
		this.subject = subject;
		this.room = room;
	}

	@JsonProperty("request_id")
	public int getRequestId() {
		return requestId;
	}

	public void setRequestId(int requestId) {
		this.requestId = requestId;
	}

	public UserEntity getTeacher() {
		return teacher;
	}

	public void setTeacher(UserEntity teacher) {
		this.teacher = teacher;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@JsonProperty("class_status")
	public String getClassStatus() {
		return classStatus;
	}

	public void setClassStatus(String classStatus) {
		this.classStatus = classStatus;
	}


	@JsonProperty("date_requested")
	public LocalDateTime getDateRequested() {
		return dateRequested;
	}

	public void setDateRequested(LocalDateTime dateRequested) {
		this.dateRequested = dateRequested;
	}

	@JsonProperty("date_schedule")
	public LocalDate getDateSchedule() {
		return dateSchedule;
	}

	public void setDateSchedule(LocalDate dateSchedule) {
		this.dateSchedule = dateSchedule;
	}

	@JsonProperty("start_time")
	public LocalTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalTime startTime) {
		this.startTime = startTime;
	}

	@JsonProperty("end_time")
	public LocalTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalTime endTime) {
		this.endTime = endTime;
	}

	public UserEntity getApprover() {
		return approver;
	}

	public void setApprover(UserEntity approver) {
		this.approver = approver;
	}

	@JsonProperty("date_approved")
	public LocalDateTime getDateApproved() {
		return dateApproved;
	}

	public void setDateApproved(LocalDateTime dateApproved) {
		this.dateApproved = dateApproved;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public SubjectEntity getSubject() {
		return subject;
	}

	public void setSubject(SubjectEntity subject) {
		this.subject = subject;
	}

	public String getRoom() {
		return room;
	}

	public void setRoom(String room) {
		this.room = room;
	}
}
