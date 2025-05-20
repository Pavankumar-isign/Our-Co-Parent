package com.coparent.calendar.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageAttachmentDTO {
	private String id;
	private String fileName;
	private String fileType;
	private String filePath;
	private Long fileSize;
	private LocalDateTime uploadedAt;
}