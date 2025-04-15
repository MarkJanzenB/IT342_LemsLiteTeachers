package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="subject")
public class SubjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subjectId;
    @Column(name = "subject_name")
    private String subjectName;

    public SubjectEntity() {
        super();
    }

    public SubjectEntity(int subjectId, String subjectName) {
        super();
        this.subjectId = subjectId;
        this.subjectName = subjectName;
    }

    public int getSubjectId() {
        return subjectId;
    }

    @JsonProperty("subject_id")
    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    @JsonProperty("subject_name")
    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}
