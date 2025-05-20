package com.coparent.calendar.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferences {
	@Id
	@Column(name = "user_id")
	private String id;

	@OneToOne
	@MapsId
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false)
	private boolean emailNotifications;

	@Column(nullable = false)
	private boolean smsNotifications;

	@Column(nullable = false)
	private boolean pushNotifications;

	@Column(nullable = false)
	private boolean messageNotifications;

	@Column(nullable = false)
	private boolean calendarNotifications;

	@Column(nullable = false)
	private boolean expenseNotifications;

	@Column(nullable = false)
	private boolean documentNotifications;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}