package com.coparent.calendar.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.coparent.calendar.entity.InfoBankSection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InfoBankEntryDTO {
	private String id;
	private String title;
	private String description;
	private InfoBankSection section;
	private Set<String> associatedMemberIds; // User IDs
	private boolean isPrivate;
	private boolean isEmergencyContact;
	private String createdBy; // User ID
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Set<InfoBankFileDTO> files;
}
