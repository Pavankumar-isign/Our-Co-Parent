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
public class CoParentDTO {
	private String id;
	private String name;
	private String email;
	private String phone;
	private String relationship;
	private String userId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
