package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "BatchReturn")
public class BatchReturnEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "return_id")
    private int returnId;

    @Column(name = "date_returned")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateReturned;

    @ManyToOne
    @JoinColumn(name = "borrow_id", nullable = false)
    private BorrowItemEntity BorrowItemEntity;

    @ManyToOne
    @JoinColumn(name = "received_by", nullable = false)
    private UserEntity receivedBy;

    public BatchReturnEntity() {}

    public BatchReturnEntity(int returnId, Date dateReturned, BorrowItemEntity BorrowItemEntity, UserEntity receivedBy) {
        this.returnId = returnId;
        this.dateReturned = dateReturned;
        this.BorrowItemEntity = BorrowItemEntity;
        this.receivedBy = receivedBy;
    }

    // Getters and Setters
    public int getReturnId() {
        return returnId;
    }

    public void setReturnId(int returnId) {
        this.returnId = returnId;
    }

    public Date getDateReturned() {
        return dateReturned;
    }

    public void setDateReturned(Date dateReturned) {
        this.dateReturned = dateReturned;
    }

//    public BorrowItemEntity getBorrowItemEntity() {return BorrowItemEntity;
//    }

    public void setBorrowItemEntity(BorrowItemEntity BorrowItemEntity) {
        this.BorrowItemEntity = BorrowItemEntity;
    }

    public UserEntity getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(UserEntity receivedBy) {
        this.receivedBy = receivedBy;
    }
}