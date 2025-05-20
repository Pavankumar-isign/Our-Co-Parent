package com.coparent.calendar.dto;

import com.coparent.calendar.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
	private String id;
	private String name;
	private String email;
	private UserRole role;
	private String color;
}