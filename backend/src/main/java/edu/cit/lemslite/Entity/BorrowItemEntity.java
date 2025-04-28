package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Entity
@Table(name = "borrow_items")
public class BorrowItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String borrowedId; // Unique Borrowed ID per transaction

    @ManyToOne
    @JoinColumn(name = "uid", nullable = false)
    private UserEntity user;

    /*
     * itemId & uniqueId Currently not being used
     * Delete if it has no purpose
     * */
    private int itemId; // Unique Item ID from PreparingItemEntity
    @Column(name = "unique_id", nullable = true)
    private String uniqueId; // Unique ID manually assigned by lab in-charge

    private String itemName;
    private String categoryName;
    private int quantity;

    /*
     *
     * */
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date borrowedDate;

    @OneToOne
    @JoinColumn(name = "teacher_schedule_id")
    private TeacherScheduleEntity teacherSchedule;

    // Static atomic counter for auto increment number (per month/year)
    private static final AtomicInteger autoIncrement = new AtomicInteger(1);

    @OneToMany(mappedBy = "borrowItem", cascade = CascadeType.ALL)
    private List<TransactionHistory> transactionHistories; // Link to transaction history

    public BorrowItemEntity() {}

    public BorrowItemEntity(UserEntity user, int itemId, String uniqueId, String itemName, String categoryName, int quantity, String status, Date borrowedDate) {
        this.user = user;
        this.itemId = itemId;
        this.uniqueId = uniqueId;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.status = status;
        this.borrowedDate = borrowedDate;
        this.borrowedId = generateBorrowedId();  // Generate Borrowed ID
    }

    private String generateBorrowedId() {
        // Get current date in MMYY format
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMyy");
        String datePart = dateFormat.format(new Date());

        // Generate random auto-increment number, formatted as a 3-digit number
        String incrementPart = String.format("%03d", autoIncrement.getAndIncrement());

        // Combine to form the borrowed ID
        return "BI" + datePart + incrementPart;
    }

    // Getters and Setters
    public String getBorrowedId() {
        return borrowedId;
    }

    public void setBorrowedId(String borrowedId) {
        this.borrowedId = borrowedId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
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

    public Date getBorrowedDate() {
        return borrowedDate;
    }

    public void setBorrowedDate(Date borrowedDate) {
        this.borrowedDate = borrowedDate;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setTeacherSchedule(TeacherScheduleEntity teacherScheduleEntity) {
    }

    public TeacherScheduleEntity getTeacherSchedule() {
        return teacherSchedule;
    }
}
