package com.coparent.calendar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coparent.calendar.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
	boolean existsByEmail(String email);

	Optional<User> findByEmail(String email);

}
