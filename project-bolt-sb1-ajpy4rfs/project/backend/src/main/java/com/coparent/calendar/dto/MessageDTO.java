package com.coparent.calendar.dto;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
	private String id;
	private String subject;
	private String body;
	private String senderId;
	private Set<String> recipientIds;
	private boolean isRead;
	private boolean isArchived;
	private LocalDateTime sentAt;
	private String toneAnalysis;
	private Set<MessageAttachmentDTO> attachments;
}
