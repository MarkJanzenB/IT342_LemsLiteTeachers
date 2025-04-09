package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="Item")
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

    @Column(name = "item_name")
    private String itemName;

    @ManyToOne
    @JoinColumn(name = "borrow_item_id", nullable = true)
    private BorrowItemEntity borrowItemEntity;
    @Column(name = "unique_id")
    private String uniqueId;

    @Column(name = "is_auto_uid")
    private boolean isAutoUid;

    private String status;

    @Column(name = "date_added")
    private LocalDate dateAdded;

    private int quantity;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(nullable = false)
    private String variant;

    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = true)
    private InventoryEntity inventory;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "borrowcart_id", nullable = true)
    private BorrowCartEntity borrowCart;

    @ManyToOne
    @JoinColumn(name = "BorrowItemEntity_id", nullable = true)
    private BorrowItemEntity BorrowItemEntity;

//    @ManyToOne
//    @JoinColumn(name = "manufacturer_id", nullable = true)
//    private ManufacturerEntity manufacturer;
//
    @ManyToOne
    @JoinColumn(name = "resupply_id", nullable = true)
    private BatchResupplyEntity batchResupply;

    public ItemEntity() {
        super();
        // TODO Auto-generated constructor stub
    }

    public ItemEntity(int itemId, String itemName, String uniqueId, InventoryEntity inventory, UserEntity user, String status, BorrowCartEntity borrowCart, BorrowItemEntity BorrowItemEntity, int quantity, LocalDate expiryDate, String variant) {
        super();
        this.itemId = itemId;
        this.itemName = itemName;
        this.uniqueId = uniqueId;
        this.inventory = inventory;
        this.isAutoUid = false;
        this.user = user;
        this.status = status;
        this.borrowCart = borrowCart;
        this.BorrowItemEntity = BorrowItemEntity;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.variant = variant;
//        this.manufacturer = manufacturer;
//        this.batchResupply = batchResupply;
    }

    @PrePersist
    protected void onCreate() {
        this.dateAdded = LocalDate.now();
    }

    @JsonProperty("item_id")
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    @JsonProperty("item_name")
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    @JsonProperty("unique_id")
    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public boolean isAutoUid() {
        return isAutoUid;
    }
	public InventoryEntity getInventory() {
		return inventory;
	}

	public void setInventory(InventoryEntity inventory) {
		this.inventory = inventory;
	}
    public BorrowItemEntity getBorrowItemEntity() {
        return borrowItemEntity;
    }

    public void setBorrowItemEntity(BorrowItemEntity borrowItemEntity) {
        this.borrowItemEntity = borrowItemEntity;
    }

    public void setAutoUid(boolean isAutoUid) {
        this.isAutoUid = isAutoUid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @JsonProperty("date_added")
    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public BorrowCartEntity getBorrowCart() {
        return borrowCart;
    }

    public void setBorrowCart(BorrowCartEntity borrowCart) {
        this.borrowCart = borrowCart;
    }


//    public ManufacturerEntity getManufacturer() {
//        return manufacturer;
//    }
//
//    public void setManufacturer(ManufacturerEntity manufacturer) {
//        this.manufacturer = manufacturer;
//    }
//
    public BatchResupplyEntity getBatchResupply() {
        return batchResupply;
    }

    public void setBatchResupply(BatchResupplyEntity batchResupply) {
        this.batchResupply = batchResupply;
    }
}