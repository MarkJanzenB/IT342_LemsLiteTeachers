package edu.cit.lemslite.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name="Users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int userId;
	
	@Column(name = "first_name")
	private String firstName;
	@Column(name = "last_name")
	private String lastName;
	private String password;
	@Column(name = "insti_id")
	private String instiId;
	private String email;
	@Column(nullable = false, name = "is_new")
	private boolean isNew;
	
	@ManyToOne
	@JoinColumn(name = "role_id")
	private RoleEntity role;
	
	@OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<RequestEntity> requests = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<BorrowItem> borrowedItems = new ArrayList<>();
	
	@OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, orphanRemoval = false)
	@JsonIgnore
	private List<ItemEntity> items = new ArrayList<>();
	
	public UserEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserEntity(int userId, String firstName, String lastName, String password, String instiId, String email,
			boolean isNew, RoleEntity role) {
		super();
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.password = password;
		this.instiId = instiId;
		this.email = email;
		this.isNew = isNew;
		this.role = role;
	}

	@JsonProperty("user_id")
	public int getUid() {
		return userId;
	}

	public void setUid(int userId) {
		this.userId = userId;
	}

	@JsonProperty("first_name")
	public String getFname() {
		return firstName;
	}

	public void setFname(String firstName) {
		this.firstName = firstName;
	}

	@JsonProperty("last_name")
	public String getLname() {
		return lastName;
	}

	public void setLname(String lastName) {
		this.lastName = lastName;
	}

	@JsonIgnore
	public String getPassword() {
		return password;
	}

	@JsonProperty
	public void setPassword(String password) {
		this.password = password;
	}

	@JsonProperty("insti_id")
	public String getInstiId() {
		return instiId;
	}

	public void setInstiId(String instiId) {
		this.instiId = instiId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public RoleEntity getRole() {
		return role;
	}

	public void setRole(RoleEntity role) {
		this.role = role;
	}

	@JsonProperty("is_new")
	public boolean isNew() {
		return isNew;
	}

	public void setNew(boolean isNew) {
		this.isNew = isNew;
	}

	public List<RequestEntity> getRequests() {
		return requests;
	}

	public void setRequests(List<RequestEntity> requests) {
		this.requests = requests;
	}
}
