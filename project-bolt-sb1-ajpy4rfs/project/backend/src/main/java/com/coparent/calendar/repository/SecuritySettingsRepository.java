package com.coparent.calendar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coparent.calendar.entity.SecuritySettings;

public interface SecuritySettingsRepository extends JpaRepository<SecuritySettings, String> {
}
