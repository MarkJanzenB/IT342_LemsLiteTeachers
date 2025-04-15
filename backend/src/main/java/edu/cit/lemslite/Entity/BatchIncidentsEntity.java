package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "BatchIncidents")
public class BatchIncidentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String batchId;
    private String incidentType;
    private String incidentDescription;
    private String incidentDate;
    private String incidentTime;
    private String reportedBy;
    private String status;

    @ManyToOne
    @JoinColumn(name = "resupply_id", nullable = true)
    private BatchResupplyEntity BatchResupply;

    @ManyToOne
    @JoinColumn(name = "return_id", nullable = true)
    private BatchReturnEntity BatchReturn;

    @ManyToOne
    @JoinColumn(name = "sy_id", nullable = false)
    private SchoolYearEntity schoolYear;

    public BatchIncidentsEntity() {}

    public BatchIncidentsEntity(int id, String batchId, String incidentType, String incidentDescription,
                                String incidentDate, String incidentTime, String reportedBy, String status) {
        this.id = id;
        this.batchId = batchId;
        this.incidentType = incidentType;
        this.incidentDescription = incidentDescription;
        this.incidentDate = incidentDate;
        this.incidentTime = incidentTime;
        this.reportedBy = reportedBy;
        this.status = status;
    }

    // Existing getters and setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getBatchId() {
        return batchId;
    }
    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }
    public String getIncidentType() {
        return incidentType;
    }

    // Missing getters and setters
    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }
    public String getIncidentDescription() {
        return incidentDescription;
    }
    public void setIncidentDescription(String incidentDescription) {
        this.incidentDescription = incidentDescription;
    }
    public String getIncidentDate() {
        return incidentDate;
    }
    public void setIncidentDate(String incidentDate) {
        this.incidentDate = incidentDate;
    }
    public String getIncidentTime() {
        return incidentTime;
    }
    public void setIncidentTime(String incidentTime) {
        this.incidentTime = incidentTime;
    }
    public String getReportedBy() {
        return reportedBy;
    }
    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    // Foreign key relationship getters and setters
    public BatchResupplyEntity getBatchResupply() {
        return BatchResupply;
    }
    public void setBatchResupply(BatchResupplyEntity BatchResupply) {
        this.BatchResupply = BatchResupply;
    }
    public BatchReturnEntity getBatchReturn() {
        return BatchReturn;
    }
    public void setBatchReturn(BatchReturnEntity BatchReturn) {
        this.BatchReturn = BatchReturn;
    }
    public SchoolYearEntity getSchoolYear() {
        return schoolYear;
    }
    public void setSchoolYear(SchoolYearEntity schoolYear) {
        this.schoolYear = schoolYear;
    }
}