package com.coparent.calendar.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfoBankFileDTO {
	private String id;
	private String fileName;
	private String fileType;
	private String filePath;
	private LocalDateTime uploadedAt;
}