package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "preparing_item")
public class PreparingItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Auto-generated ID (primary key)

    @Column(nullable = false)
    private String referenceCode;  // Reference code like PI-LA0015 (automatically generated)

    @Column(name = "unique_id", nullable = true)
    private String uniqueId;  // Lab in charge assigns a unique ID (if applicable)

    @Column(nullable = false)
    private String instiId;  // Institution/borrower's ID (temporary reference for whom the items are being prepared)

    @Column(nullable = false)
    private String itemName;  // Name of the item

    @Column(nullable = false)
    private String categoryName;  // Category of the item (e.g., Electronics, Furniture)

    @Column(nullable = false)
    private int quantity;  // Number of items requested by the borrower

    @Column(nullable = false)
    private String status;  // Status of the preparation (e.g., "preparing", "finalized")

    // Relationship to ItemEntity (many PreparingItemEntities can refer to one ItemEntity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)  // Foreign key reference to ItemEntity
    private ItemEntity item;

    // Constructor, Getters, and Setters
    public PreparingItemEntity() {}

    public PreparingItemEntity(String referenceCode, String instiId, String itemName, String categoryName, int quantity, String status, ItemEntity item) {
        this.referenceCode = referenceCode;
        this.uniqueId = null;  // Initially null, can be set later
        this.instiId = instiId;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.status = status;
        this.item = item;  // Associate the ItemEntity with the PreparingItem
    }

    // Getters and setters
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

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
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

    // Getter and setter for the associated ItemEntity
    public ItemEntity getItem() {
        return item;
    }

    public void setItem(ItemEntity item) {
        this.item = item;
    }
}
