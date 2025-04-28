package edu.cit.lemslite.Entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="ItemCategory")
public class ItemCategoryEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;
    @Column(name = "category_name")
    private String categoryName;
    
    @OneToMany(mappedBy = "itemCategory", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<InventoryEntity> inventories = new ArrayList<>();

    public ItemCategoryEntity() {
        super();
        // TODO Auto-generated constructor stub
    }

    public ItemCategoryEntity(int categoryId, String categoryName) {
        super();
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    @JsonProperty("category_id")
    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    @JsonProperty("category_name")
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}

