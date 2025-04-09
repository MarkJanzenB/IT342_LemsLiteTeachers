package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

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
    
    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = true)
    private InventoryEntity inventory;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity user;
    public ItemEntity() {
        super();
        // TODO Auto-generated constructor stub
    }

	public ItemEntity(int itemId, String itemName, String uniqueId, InventoryEntity inventory, UserEntity user, String status) {
		super();
		this.itemId = itemId;
		this.itemName = itemName;
		this.uniqueId = uniqueId;
		this.inventory = inventory;
		this.isAutoUid = false;
		this.user = user;
		this.status = status;
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
    
    public UserEntity getUser() {
    	return user;
    }
    
    public void setUser(UserEntity user) {
    	this.user = user;
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
	public boolean isAutoUid() {
		return isAutoUid;
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

}
