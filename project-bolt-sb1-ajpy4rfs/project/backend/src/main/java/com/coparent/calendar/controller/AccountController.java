package com.coparent.calendar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.coparent.calendar.entity.NotificationPreferences;
import com.coparent.calendar.entity.SecuritySettings;
import com.coparent.calendar.entity.UserProfile;
import com.coparent.calendar.service.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {
	private final AccountService accountService;

	@GetMapping("/profile")
	public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
		UserProfile profile = accountService.getUserProfile(userDetails.getUsername());
		return ResponseEntity.ok(profile);
	}

	@PutMapping("/profile")
	public ResponseEntity<UserProfile> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody UserProfile profile) {
		UserProfile updatedProfile = accountService.updateProfile(userDetails.getUsername(), profile);
		return ResponseEntity.ok(updatedProfile);
	}

	@PutMapping("/security/password")
	public ResponseEntity<Void> updatePassword(@AuthenticationPrincipal UserDetails userDetails,
			@RequestParam String currentPassword, @RequestParam String newPassword) {
		accountService.updatePassword(userDetails.getUsername(), currentPassword, newPassword);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/security/2fa/enable")
	public ResponseEntity<SecuritySettings> enable2FA(@AuthenticationPrincipal UserDetails userDetails) {
		SecuritySettings settings = accountService.enable2FA(userDetails.getUsername());
		return ResponseEntity.ok(settings);
	}

	@PutMapping("/notifications")
	public ResponseEntity<NotificationPreferences> updateNotificationPreferences(
			@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody NotificationPreferences preferences) {
		NotificationPreferences updated = accountService.updateNotificationPreferences(userDetails.getUsername(),
				preferences);
		return ResponseEntity.ok(updated);
	}
}