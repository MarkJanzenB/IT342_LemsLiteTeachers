package com.capstone.LEMS.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Inventory")
public class InventoryEntity {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private int inventoryId;
    @Column(name = "quantity")
    private float quantity;
    @Column(name = "unit")
    private String unit;
    private String name;
    private String status;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private ItemCategoryEntity itemCategory;
    
    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<ItemEntity> items = new ArrayList<>();

    public InventoryEntity() {
        super();

    }

    public InventoryEntity(int inventoryId, float quantity, String unit, ItemCategoryEntity item_category, String name, String status, String description) {
		super();
		this.inventoryId = inventoryId;
		this.quantity = quantity;
		this.unit = unit;
		this.itemCategory = item_category;
		this.name = name;
		this.status = status;
		this.description = description;
	}

	@JsonProperty("inventory_id")
    public int getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(int inventoryId) {
        this.inventoryId = inventoryId;
    }

    @JsonProperty("quantity")
    public float getQuantity() {
        return quantity;
    }

    public void setQuantity(float quantity) {this.quantity = quantity; }

    @JsonProperty("unit")
    public String  getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    @JsonProperty("item_category")
	public ItemCategoryEntity getItemCategory() {
		return itemCategory;
	}

	public void setItemCategory(ItemCategoryEntity item_category) {
		this.itemCategory = item_category;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "[quantity=" + quantity + ", unit=" + unit + ", name="
				+ name + ", description=" + description + ", itemCategory=" + itemCategory.getCategoryId() + "]";
	}
	
	
}
