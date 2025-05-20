package com.coparent.calendar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coparent.calendar.entity.NotificationPreferences;
import com.coparent.calendar.entity.SecuritySettings;
import com.coparent.calendar.entity.User;
import com.coparent.calendar.entity.UserProfile;
import com.coparent.calendar.repository.NotificationPreferencesRepository;
import com.coparent.calendar.repository.SecuritySettingsRepository;
import com.coparent.calendar.repository.UserProfileRepository;
import com.coparent.calendar.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
	private final UserRepository userRepository;
	private final UserProfileRepository profileRepository;
	private final SecuritySettingsRepository securityRepository;
	private final NotificationPreferencesRepository notificationRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public UserProfile getUserProfile(String userId) {
		return profileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Profile not found"));
	}

	@Transactional
	public UserProfile updateProfile(String userId, UserProfile profile) {
		UserProfile existingProfile = profileRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Profile not found"));

		existingProfile.setLanguage(profile.getLanguage());
		existingProfile.setPhone(profile.getPhone());
		existingProfile.setAddress(profile.getAddress());

		return profileRepository.save(existingProfile);
	}

	@Transactional
	public void updatePassword(String userId, String currentPassword, String newPassword) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new RuntimeException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}

	@Transactional
	public SecuritySettings enable2FA(String userId) {
		SecuritySettings settings = securityRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Security settings not found"));

		settings.setTwoFactorEnabled(true);
		settings.setTwoFactorSecret(generateSecretKey());

		return securityRepository.save(settings);
	}

	@Transactional
	public NotificationPreferences updateNotificationPreferences(String userId, NotificationPreferences preferences) {
		NotificationPreferences existing = notificationRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Notification preferences not found"));

		existing.setEmailNotifications(preferences.isEmailNotifications());
		existing.setSmsNotifications(preferences.isSmsNotifications());
		existing.setPushNotifications(preferences.isPushNotifications());
		existing.setMessageNotifications(preferences.isMessageNotifications());
		existing.setCalendarNotifications(preferences.isCalendarNotifications());
		existing.setExpenseNotifications(preferences.isExpenseNotifications());
		existing.setDocumentNotifications(preferences.isDocumentNotifications());

		return notificationRepository.save(existing);
	}

	private String generateSecretKey() {
		// Implementation of 2FA secret key generation
		return "secret";
	}
}