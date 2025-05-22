package com.coparent.calendar.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildDTO {
	private String id;
	private String name;
	private LocalDate dateOfBirth;
	private String gender;
	private String notes;
	private String parentId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
