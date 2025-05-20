package com.coparent.calendar.dto;

import com.coparent.calendar.entity.UserRole;

import lombok.Data;

@Data
public class RegisterRequest {
	private String name;
	private String email;
	private String password;
	private UserRole role;
	private String phone;
	private String address;
	private String profession; // for professionals only
	private String licenseNumber; // for professionals only
}
