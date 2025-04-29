package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "BatchReturn")
public class BatchReturnEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "return_id")
    private int returnId;

    @Column(name = "date_returned")
    private LocalDate dateReturned;

    @ManyToOne
    @JoinColumn(name = "preparing_item_id", nullable = false)
    private PreparingItemEntity preparingItem;

    @ManyToOne
    @JoinColumn(name = "received_by", nullable = false)
    private UserEntity receivedBy;

    public BatchReturnEntity() {}

    public BatchReturnEntity(int returnId, LocalDate dateReturned, PreparingItemEntity preparingItem, UserEntity receivedBy) {
        this.returnId = returnId;
        this.dateReturned = dateReturned;
        this.preparingItem = preparingItem;
        this.receivedBy = receivedBy;
    }

    // Getters and Setters
    public int getReturnId() {
        return returnId;
    }

    public void setReturnId(int returnId) {
        this.returnId = returnId;
    }

    public LocalDate getDateReturned() {
        return dateReturned;
    }

    public void setDateReturned(LocalDate dateReturned) {
        this.dateReturned = dateReturned;
    }

    public PreparingItemEntity getPreparingItem() {
		return preparingItem;
	}

	public void setPreparingItem(PreparingItemEntity preparingItem) {
		this.preparingItem = preparingItem;
	}

	public UserEntity getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(UserEntity receivedBy) {
        this.receivedBy = receivedBy;
    }
}