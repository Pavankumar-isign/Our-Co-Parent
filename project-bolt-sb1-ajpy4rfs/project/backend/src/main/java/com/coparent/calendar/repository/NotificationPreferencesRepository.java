package com.coparent.calendar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coparent.calendar.entity.NotificationPreferences;

public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, String> {
}
