package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="Reservation")
public class ReservationEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="reservation_id")
	private int reservationId;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private LocalDateTime reservationDate;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private UserEntity user;
	
    @OneToOne
    @JoinColumn(name="item_id")
    private ItemEntity item;
	
	@ManyToOne
	@JoinColumn(name="schedule_id")
    private TeacherScheduleEntity teacherSchedule;
	
	public ReservationEntity() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public ReservationEntity(int reservationId, LocalDateTime reservationDate, UserEntity user, ItemEntity item,
			TeacherScheduleEntity teacherSchedule) {
		super();
		this.reservationId = reservationId;
		this.reservationDate = reservationDate;
		this.user = user;
		this.item = item;
		this.teacherSchedule = teacherSchedule;
	}

	@JsonProperty("reservation_id")
	public int getReservationId() {
		return reservationId;
	}

	public void setReservationId(int reservationId) {
		this.reservationId = reservationId;
	}

	@JsonProperty("reservation_date")
	public LocalDateTime getReservationDate() {
		return reservationDate;
	}

	public void setReservationDate(LocalDateTime reservationDate) {
		this.reservationDate = reservationDate;
	}

	@JsonProperty("user_id")
	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	@JsonProperty("item_id")
	public ItemEntity getItem() {
		return item;
	}

	public void setItem(ItemEntity item) {
		this.item = item;
	}

	@JsonProperty("schedule_id")
	public TeacherScheduleEntity getTeacherSchedule() {
		return teacherSchedule;
	}

	public void setTeacherSchedule(TeacherScheduleEntity teacherSchedule) {
		this.teacherSchedule = teacherSchedule;
	}
	
	
}
