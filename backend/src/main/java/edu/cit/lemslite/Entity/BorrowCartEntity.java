package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "borrow_cart")
public class BorrowCartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String instiId;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String categoryName;

    @Column(nullable = false)
    private int quantity;

    // Default constructor
    public BorrowCartEntity() {}

    // Constructor without itemId (for unfinalized items)
    public BorrowCartEntity(String instiId, String itemName, String categoryName, int quantity) {
        this.instiId = instiId;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantity = quantity;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
}
