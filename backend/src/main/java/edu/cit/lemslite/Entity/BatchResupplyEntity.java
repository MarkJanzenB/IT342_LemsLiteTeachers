package edu.cit.lemslite.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "BatchResupply")
public class BatchResupplyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resupply_id")
    private int resupplyId;

    @Column(name = "date_resupply")
    private Date dateResupply;

    @ManyToOne
    @JoinColumn(name = "added_by", nullable = false)
    private UserEntity addedBy;

    @OneToMany(mappedBy = "batchResupply", cascade = CascadeType.ALL)
    private List<ItemEntity> items;

    public BatchResupplyEntity() {
        super();
    }

    public BatchResupplyEntity(int resupplyId, Date dateResupply, UserEntity addedBy, List<ItemEntity> items) {
        super();
        this.resupplyId = resupplyId;
        this.dateResupply = dateResupply;
        this.addedBy = addedBy;
        this.items = items;
    }

    @JsonProperty("resupply_id")
    public int getResupplyId() {
        return resupplyId;
    }

    public void setResupplyId(int resupplyId) {
        this.resupplyId = resupplyId;
    }

    @JsonProperty("date_resupply")
    public Date getDateResupply() {
        return dateResupply;
    }

    public void setDateResupply(Date dateResupply) {
        this.dateResupply = dateResupply;
    }

    @JsonProperty("added_by")
    public UserEntity getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(UserEntity addedBy) {
        this.addedBy = addedBy;
    }

    @JsonProperty("items")
    public List<ItemEntity> getItems() {
        return items;
    }

    public void setItems(List<ItemEntity> items) {
        this.items = items;
    }
}