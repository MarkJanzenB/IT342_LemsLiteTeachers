package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "year_section")
public class YearSectionEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "year_id")
	private int yearId;

	@Column(name = "year")
	private String year;

	@Column(name = "section")
	private String section;

	@Column(name = "is_active")
	private boolean active;

	@OneToMany(mappedBy = "yearSection")
	private List<TeacherScheduleEntity> teacherSchedules;

	public YearSectionEntity() {
		super();
	}

	public YearSectionEntity(int yearId, String year, String section, boolean active, String department) {
		this.yearId = yearId;
		this.year = year;
		this.section = section;
		this.active = active;
	}

	@JsonProperty("year_id")
	public int getYearId() {
		return yearId;
	}

	public void setYearId(int yearId) {
		this.yearId = yearId;
	}

	@JsonProperty("year")
	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	@JsonProperty("section")
	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	@JsonProperty("is_active")
	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

}
