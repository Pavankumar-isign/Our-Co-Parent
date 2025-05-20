package com.coparent.calendar.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "message_attachments")
public class MessageAttachment {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "message_id", nullable = false)
	private Message message;

	@Column(nullable = false)
	private String fileName;

	@Column(nullable = false)
	private String fileType;

	@Column(nullable = false)
	private String filePath;

	@Column(nullable = false)
	private Long fileSize;

	@Column(nullable = false)
	private LocalDateTime uploadedAt;
}