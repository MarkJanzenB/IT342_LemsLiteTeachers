package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "year_section")
public class YearSectionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "yrsec_id")
    private int yrsec_id;
    
    @Column(name = "year")
    private int year;
    
    @Column(name = "section")
    private String section;
    
    @Column(name = "yearsect")
    private String yearsect;
    
    // Default constructor
    public YearSectionEntity() {
    }
    
    // Parameterized constructor
    public YearSectionEntity(int yrsec_id, int year, String section, String yearsect) {
        this.yrsec_id = yrsec_id;
        this.year = year;
        this.section = section;
        this.yearsect = yearsect;
    }
//    @PrePersist
//    @PreUpdate
//    private void updateYearsect() {
//        this.yearsect = this.year + "-" + this.section;
//    }


    // Getters and Setters
    @JsonProperty("yrsec_id")
    public int getYrsecId() {
        return yrsec_id;
    }
    
    public void setYrsecId(int yrsec_id) {
        this.yrsec_id = yrsec_id;
    }
    
    @JsonProperty("year")
    public int getYear() {
        return year;
    }
    
    public void setYear(int year) {
        this.year = year;
    }
    
    @JsonProperty("section")
    public String getSection() {
        return section;
    }
    
    public void setSection(String section) {
        this.section = section;
    }
    
    @JsonProperty("yearsect")
    public String getYearsect() {
        return yearsect;
    }
    
    public void setYearsect(String yearsect) {
        this.yearsect = yearsect;
    }
    @PrePersist
    @PreUpdate
    private void updateYearsect() {
        this.yearsect = this.year + "-" + this.section;
    }

}