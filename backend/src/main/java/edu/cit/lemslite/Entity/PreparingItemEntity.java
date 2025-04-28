package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preparing_item")
public class PreparingItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private String referenceCode;
    private String instiId;
    private String itemName;
    private String categoryName;
    private int quantity;
    private String status;
    @Column(name = "date_created")
    private LocalDate dateCreated;
    private String variant;

    @ManyToOne
    @JoinColumn(name = "teacher_schedule_id")
    private TeacherScheduleEntity teacherSchedule;

    @OneToMany(mappedBy = "preparingItem", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, orphanRemoval = false)
    @JsonIgnore
    private List<ItemEntity> items = new ArrayList<>();

    public PreparingItemEntity() {}

    public PreparingItemEntity(String referenceCode, String instiId, String itemName, String categoryName, int quantity, String status, LocalDate dateCreated, TeacherScheduleEntity teacherSchedule) {
        this.referenceCode = referenceCode;
        this.instiId = instiId;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.status = status;
        this.dateCreated = dateCreated;
        this.teacherSchedule = teacherSchedule;

    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public String getInstiId() {
        return instiId;
    }

    public void setInstiId(String instiId) {
        this.instiId = instiId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDate dateCreated) {
        this.dateCreated = dateCreated;
    }

    public TeacherScheduleEntity getTeacherSchedule() {
        return teacherSchedule;
    }

    public void setTeacherSchedule(TeacherScheduleEntity teacherSchedule) {
        this.teacherSchedule = teacherSchedule;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

}