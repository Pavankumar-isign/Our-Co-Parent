package com.coparent.calendar.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "families")
public class Family {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(nullable = false)
	private String familyName;

//	@OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
//	private Set<Child> children;

	@OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<User> users;

	@Column(nullable = false)
	private boolean isActive = true;

	@Column(nullable = false, updatable = false)
	private Long createdAt;

	@Column(nullable = false)
	private Long updatedAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = System.currentTimeMillis();
		this.updatedAt = this.createdAt;
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = System.currentTimeMillis();
	}
}
