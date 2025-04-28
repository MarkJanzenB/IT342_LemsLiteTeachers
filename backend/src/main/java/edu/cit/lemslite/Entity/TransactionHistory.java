package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "TransactionHistory")
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int itemId;
    private int userId;
    private String transactionType; // e.g., "resupply", "borrow", "return", "incident"
    private Date transactionDate;
    private String details; // Additional details about the transaction

    @ManyToOne
    @JoinColumn(name = "borrow_item_id", nullable = true)
    private BorrowItemEntity borrowItem;

    @ManyToOne
    @JoinColumn(name = "batch_resupply_id", nullable = true)
    private BatchResupplyEntity batchResupply;

    public TransactionHistory() {}

    public BorrowItemEntity getBorrowItem() { // Add getter
        return borrowItem;
    }

    public void setBorrowItem(BorrowItemEntity borrowItem) { // Add setter
        this.borrowItem = borrowItem;
    }

    public BatchResupplyEntity getBatchResupply() { // Add getter
        return batchResupply;
    }

    public void setBatchResupply(BatchResupplyEntity batchResupply) { // Add setter
        this.batchResupply = batchResupply;
    }
    public TransactionHistory(int id, int itemId, int userId, String transactionType, Date transactionDate, String details) {
        this.id = id;
        this.itemId = itemId;
        this.userId = userId;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.details = details;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public Date getTransactionDate() { return transactionDate; }
    public void setTransactionDate(Date transactionDate) { this.transactionDate = transactionDate; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
