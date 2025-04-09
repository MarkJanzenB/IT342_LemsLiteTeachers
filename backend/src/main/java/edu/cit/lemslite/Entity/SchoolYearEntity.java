package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "SchoolYear")
public class SchoolYearEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sy_id")
    private int syId;

    @Column(name = "year", nullable = false)
    private String year;

    @Column(name = "start_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date endDate;

    public SchoolYearEntity() {
        super();
    }

    public SchoolYearEntity(int syId, String year, Date startDate, Date endDate) {
        this.syId = syId;
        this.year = year;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public int getSyId() {
        return syId;
    }

    public void setSyId(int syId) {
        this.syId = syId;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}