package com.coparent.calendar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coparent.calendar.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
}
