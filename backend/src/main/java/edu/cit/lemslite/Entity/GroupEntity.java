package edu.cit.lemslite.Entity;

import jakarta.persistence.*;

@Entity
//added specifc table name
//without this, the table name would be Group_entity which is not the same as the ERD
//ERD has 'group' as entity name however we cannot make that as a table name because the word 'group' is reserved keyword for mysql that is why we added tbl in the end
@Table(name="Grouptbl")
public class GroupEntity {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int group_id;
    @Column(name = "group_name")
    private String group_name;

    public GroupEntity(){}

    public GroupEntity(int group_id, String group_name){
        this.group_id = group_id;
        this.group_name = group_name;
    }

    public int getGroup_id() {
        return group_id;
    }

    public void setGroup_id(int group_id) {
        this.group_id = group_id;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }
}
